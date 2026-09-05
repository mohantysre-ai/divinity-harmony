#!/usr/bin/env python3
"""Same-origin API for live YouTube temple/darshan search results.

The browser cannot read YouTube search pages directly because of CORS. This
small service runs beside nginx, reads YouTube's live-filtered search pages,
and exposes only results that YouTube marks with a LIVE badge. It deliberately
uses no Google/YouTube API key.
"""

from __future__ import annotations

import html
import json
import os
import threading
import time
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from html.parser import HTMLParser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any, Iterator
from urllib.parse import urlencode
from urllib.parse import parse_qs, urlparse
from urllib.request import Request, urlopen

from sacred_text_content import fetch_chapter, fetch_sacred_content
from ai_explain import explain
from db import get_profile, init_db, list_favorites, list_priests, save_japa, save_profile, set_favorite, subscribe_newsletter
from panchang import daily_panchang, birth_chart as approx_birth_chart
from region import geocode_place, regional_preference
from temple_search import nearby_temples, search_temples

try:
    from vedic_chart import EPHEMERIS_AVAILABLE, birth_chart
except ImportError:
    EPHEMERIS_AVAILABLE = False
    birth_chart = approx_birth_chart  # type: ignore[assignment]


SEARCH_QUERIES = (
    "live darshan temple",
    "live temple darshan",
    "live mandir darshan",
    "live temple aarti",
    "live darshan India",
    "live mandir India",
    "temple live stream India",
    "live aarti today",
    "लाइव मंदिर दर्शन",
    "लाइव आरती दर्शन",
)
YOUTUBE_SEARCH_URL = "https://www.youtube.com/results"
LIVE_DARSHAN_HUB_URL = "https://livedarshanhub.com/live-darshan/"
LIVE_FILTER = "EgJAAQ=="
CACHE_SECONDS = int(os.environ.get("LIVE_DARSHAN_CACHE_SECONDS", "300"))
REQUEST_TIMEOUT_SECONDS = int(os.environ.get("LIVE_DARSHAN_TIMEOUT_SECONDS", "20"))
PORT = int(os.environ.get("LIVE_DARSHAN_API_PORT", "8080"))


def _text(value: Any) -> str:
    if not isinstance(value, dict):
        return ""
    if isinstance(value.get("simpleText"), str):
        return value["simpleText"].strip()
    runs = value.get("runs")
    if isinstance(runs, list):
        return "".join(run.get("text", "") for run in runs if isinstance(run, dict)).strip()
    return ""


def _walk(value: Any) -> Iterator[dict[str, Any]]:
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from _walk(child)
    elif isinstance(value, list):
        for child in value:
            yield from _walk(child)


def extract_initial_data(page: str) -> dict[str, Any]:
    """Decode ytInitialData without using a fragile brace-matching regex."""
    markers = (
        "var ytInitialData = ",
        "window[\"ytInitialData\"] = ",
        "ytInitialData = ",
    )
    decoder = json.JSONDecoder()
    for marker in markers:
        start = page.find(marker)
        if start < 0:
            continue
        candidate = page[start + len(marker) :].lstrip()
        try:
            data, _ = decoder.raw_decode(candidate)
        except json.JSONDecodeError:
            continue
        if isinstance(data, dict):
            return data
    raise ValueError("YouTube search response did not contain ytInitialData")


def _is_live(renderer: dict[str, Any]) -> bool:
    for badge in renderer.get("badges", []):
        metadata = badge.get("metadataBadgeRenderer", {}) if isinstance(badge, dict) else {}
        style = str(metadata.get("style", "")).upper()
        label = str(metadata.get("label", "")).upper()
        if "LIVE_NOW" in style or label == "LIVE":
            return True

    for overlay in renderer.get("thumbnailOverlays", []):
        status = overlay.get("thumbnailOverlayTimeStatusRenderer", {}) if isinstance(overlay, dict) else {}
        if str(status.get("style", "")).upper() == "LIVE":
            return True
        if _text(status.get("text", {})).upper() == "LIVE":
            return True
    return False


def parse_live_results(data: dict[str, Any]) -> list[dict[str, Any]]:
    results: list[dict[str, Any]] = []
    seen: set[str] = set()
    for node in _walk(data):
        renderer = node.get("videoRenderer")
        if not isinstance(renderer, dict) or not _is_live(renderer):
            continue
        video_id = renderer.get("videoId")
        if not isinstance(video_id, str) or not video_id or video_id in seen:
            continue
        seen.add(video_id)

        thumbnails = renderer.get("thumbnail", {}).get("thumbnails", [])
        thumbnail_url = ""
        if isinstance(thumbnails, list) and thumbnails:
            thumbnail_url = html.unescape(str(thumbnails[-1].get("url", "")))

        title = _text(renderer.get("title", {})) or "Live Temple Darshan"
        channel_title = _text(renderer.get("ownerText", {})) or _text(renderer.get("longBylineText", {}))
        description = _text(renderer.get("descriptionSnippet", {}))
        watching = _text(renderer.get("viewCountText", {}))
        published = _text(renderer.get("publishedTimeText", {}))
        results.append(
            {
                "videoId": video_id,
                "title": title,
                "description": description or "Currently live on YouTube",
                "channelTitle": channel_title or "YouTube channel",
                "channelId": "",
                "thumbnailUrl": thumbnail_url,
                "watchingNow": watching,
                "startedAt": published,
                "url": f"https://www.youtube.com/watch?v={video_id}",
                "embedUrl": f"https://www.youtube-nocookie.com/embed/{video_id}?autoplay=1&rel=0",
                "source": "youtube-live-search",
            }
        )
    return results


def parse_mantra_recordings(data: dict[str, Any], limit: int = 6) -> list[dict[str, Any]]:
    """Return ordinary YouTube video results for an explicit devotional query."""
    results: list[dict[str, Any]] = []
    seen: set[str] = set()
    for node in _walk(data):
        renderer = node.get("videoRenderer")
        if not isinstance(renderer, dict):
            continue
        video_id = renderer.get("videoId")
        if not isinstance(video_id, str) or not video_id or video_id in seen:
            continue
        title = _text(renderer.get("title", {}))
        if not title:
            continue
        seen.add(video_id)
        thumbnails = renderer.get("thumbnail", {}).get("thumbnails", [])
        thumbnail = html.unescape(str(thumbnails[-1].get("url", ""))) if isinstance(thumbnails, list) and thumbnails else ""
        results.append({
            "videoId": video_id,
            "title": title,
            "channelTitle": _text(renderer.get("ownerText", {})) or _text(renderer.get("longBylineText", {})) or "YouTube",
            "duration": _text(renderer.get("lengthText", {})),
            "thumbnailUrl": thumbnail,
            "url": f"https://www.youtube.com/watch?v={video_id}",
            "embedUrl": f"https://www.youtube-nocookie.com/embed/{video_id}?autoplay=0&rel=0",
        })
        if len(results) >= limit:
            break
    return results


MANTRA_RECORDING_CACHE: dict[str, tuple[float, list[dict[str, Any]]]] = {}
MANTRA_RECORDING_LOCK = threading.Lock()


def search_mantra_recordings(query: str) -> list[dict[str, Any]]:
    normalized = " ".join(query.split())[:120]
    now = time.time()
    with MANTRA_RECORDING_LOCK:
        cached = MANTRA_RECORDING_CACHE.get(normalized.casefold())
        if cached and now - cached[0] < 86400:
            return cached[1]
    params = urlencode({"search_query": f"{normalized} devotional mantra full", "hl": "en", "gl": "IN"})
    request = Request(
        f"{YOUTUBE_SEARCH_URL}?{params}",
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0 Safari/537.36",
            "Accept-Language": "en-IN,en;q=0.9,hi;q=0.8",
            "Cookie": "CONSENT=YES+cb.20210328-17-p0.en+FX+410",
        },
    )
    with urlopen(request, timeout=REQUEST_TIMEOUT_SECONDS) as response:
        page = response.read().decode("utf-8", errors="replace")
    items = parse_mantra_recordings(extract_initial_data(page))
    ignored = {"mantra", "stotra", "stotram", "chalisa", "aarti", "the", "shri", "sri"}
    keywords = {
        word for word in re.sub(r"[^a-z0-9 ]", " ", normalized.casefold().replace("siva", "shiva")).split()
        if len(word) >= 4 and word not in ignored
    }
    if keywords:
        items = [item for item in items if any(word in item["title"].casefold().replace("siva", "shiva") for word in keywords)]
    with MANTRA_RECORDING_LOCK:
        MANTRA_RECORDING_CACHE[normalized.casefold()] = (now, items)
    return items


def fetch_query(query: str) -> list[dict[str, Any]]:
    params = urlencode({"search_query": query, "sp": LIVE_FILTER, "hl": "en", "gl": "IN"})
    request = Request(
        f"{YOUTUBE_SEARCH_URL}?{params}",
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36"
            ),
            "Accept-Language": "en-IN,en;q=0.9,hi;q=0.8",
            "Cookie": "CONSENT=YES+cb.20210328-17-p0.en+FX+410",
        },
    )
    with urlopen(request, timeout=REQUEST_TIMEOUT_SECONDS) as response:
        page = response.read().decode("utf-8", errors="replace")
    return parse_live_results(extract_initial_data(page))


class LiveDarshanHubParser(HTMLParser):
    """Read only the cards that LiveDarshanHub publishes in its live grid."""

    def __init__(self) -> None:
        super().__init__()
        self.items: list[dict[str, Any]] = []
        self.images: dict[str, str] = {}
        self.seen: set[str] = set()

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {key: html.unescape(value or "") for key, value in attrs}
        if tag == "img" and "ldh-ld-card__img" in values.get("class", ""):
            title = values.get("alt", "").strip()
            source = values.get("src", "").strip()
            if title and source:
                self.images[title] = source
            return
        if tag != "button" or "ldh-ld-card__play-btn" not in values.get("class", ""):
            return
        video_id = values.get("data-video", "").strip()
        title = values.get("data-title", "").strip()
        if not video_id or not title or video_id in self.seen:
            return
        self.seen.add(video_id)
        location = values.get("data-location", "").strip()
        deity = values.get("data-deity", "").strip()
        about = values.get("data-about", "").strip()
        self.items.append({
            "videoId": video_id,
            "title": title,
            "description": about or f"Live darshan from {title}",
            "channelTitle": " · ".join(filter(None, (deity, location))) or "Temple live stream",
            "channelId": "",
            "thumbnailUrl": self.images.get(title, ""),
            "watchingNow": "",
            "startedAt": "",
            "url": f"https://www.youtube.com/watch?v={video_id}",
            "embedUrl": f"https://www.youtube-nocookie.com/embed/{video_id}?autoplay=1&rel=0",
            "source": "live-darshan-hub",
            "sourcePage": values.get("data-url", LIVE_DARSHAN_HUB_URL),
        })


def parse_live_darshan_hub(page: str) -> list[dict[str, Any]]:
    parser = LiveDarshanHubParser()
    parser.feed(page)
    return parser.items


def fetch_live_darshan_hub() -> list[dict[str, Any]]:
    request = Request(
        LIVE_DARSHAN_HUB_URL,
        headers={
            "User-Agent": "DivinityHarmony/1.0 (+https://github.com/mohantysre-ai/divinity-harmony)",
            "Accept-Language": "en-IN,en;q=0.9",
        },
    )
    with urlopen(request, timeout=REQUEST_TIMEOUT_SECONDS) as response:
        page = response.read().decode("utf-8", errors="replace")
    return parse_live_darshan_hub(page)


class LiveSearchCache:
    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._items: list[dict[str, Any]] = []
        self._updated_at = 0.0
        self._last_error = ""

    def get(self) -> dict[str, Any]:
        now = time.time()
        with self._lock:
            if self._updated_at and now - self._updated_at < CACHE_SECONDS:
                return self._payload(stale=False)

        items: dict[str, dict[str, Any]] = {}
        errors: list[str] = []
        successful_queries = 0
        discovery_jobs: list[tuple[str, Any, tuple[Any, ...]]] = [
            (f"youtube:{query}", fetch_query, (query,)) for query in SEARCH_QUERIES
        ]
        discovery_jobs.append(("live-darshan-hub", fetch_live_darshan_hub, ()))
        with ThreadPoolExecutor(max_workers=min(6, len(discovery_jobs))) as executor:
            futures = {executor.submit(callback, *args): name for name, callback, args in discovery_jobs}
            for future in as_completed(futures):
                source_name = futures[future]
                try:
                    query_items = future.result()
                    successful_queries += 1
                    for item in query_items:
                        items.setdefault(item["videoId"], item)
                except Exception as exc:  # Network/parser errors are summarized for the UI.
                    errors.append(f"{source_name}: {type(exc).__name__}")

        with self._lock:
            if successful_queries:
                self._items = list(items.values())
                self._updated_at = now
                self._last_error = ""
                return self._payload(stale=False)
            self._last_error = "; ".join(errors) or "YouTube live search is temporarily unavailable"
            if self._items:
                return self._payload(stale=True)
            raise RuntimeError(self._last_error)

    def _payload(self, stale: bool) -> dict[str, Any]:
        updated = datetime.fromtimestamp(self._updated_at, timezone.utc).isoformat() if self._updated_at else None
        return {
            "updatedAt": updated,
            "items": self._items,
            "source": "multi-source-live-search",
            "stale": stale,
            "queryCount": len(SEARCH_QUERIES) + 1,
            "error": self._last_error if stale else None,
        }


CACHE = LiveSearchCache()


class Handler(BaseHTTPRequestHandler):
    def _json(self, status: int, payload: dict[str, Any]) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:  # noqa: N802 - BaseHTTPRequestHandler API
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        query = parse_qs(parsed_url.query)
        if path == "/api/live-darshan/health":
            self._json(200, {"ok": True, "service": "live-darshan-search"})
            return
        if path == "/api/panchang":
            day = query.get("date", [datetime.now(timezone.utc).date().isoformat()])[0][:10]
            try:
                lat = float(query.get("lat", ["20.5937"])[0])
                lon = float(query.get("lon", ["78.9629"])[0])
                self._json(200, daily_panchang(day, lat, lon))
            except (ValueError, OverflowError):
                self._json(400, {"error": "A valid date and coordinates are required."})
            return
        if path == "/api/birth-chart":
            birth_date = query.get("date", [""])[0][:10]
            birth_time = query.get("time", ["12:00"])[0][:8]
            place = query.get("place", [""])[0].strip()
            try:
                lat = float(query.get("lat", ["20.5937"])[0])
                lon = float(query.get("lon", ["78.9629"])[0])
                if not birth_date or len(birth_date) < 10:
                    self._json(400, {"error": "Birth date is required (YYYY-MM-DD)."})
                    return
                if place:
                    try:
                        geo = geocode_place(place)
                        lat = geo["lat"]
                        lon = geo["lon"]
                    except ValueError:
                        self._json(400, {"error": "Birth place could not be geocoded."})
                        return
                    except Exception:
                        self._json(503, {"error": "Place lookup is temporarily unavailable."})
                        return
                chart_fn = birth_chart if EPHEMERIS_AVAILABLE else approx_birth_chart
                self._json(200, chart_fn(birth_date, birth_time, lat, lon))
            except (ValueError, OverflowError):
                self._json(400, {"error": "Valid birth date, time and coordinates are required."})
            except RuntimeError as exc:
                self._json(503, {"error": str(exc)})
            return
        if path == "/api/priests":
            self._json(200, {"items": list_priests()})
            return
        if path == "/api/temples/search":
            term = query.get("q", [""])[0].strip()
            language = query.get("lang", ["en"])[0].strip()
            if len(term) < 2:
                self._json(200, {"items": []})
                return
            try:
                self._json(200, {"items": search_temples(term, language=language)})
            except Exception:
                self._json(503, {"error": "Temple search is temporarily unavailable.", "items": []})
            return
        if path == "/api/temples/nearby":
            try:
                lat = float(query.get("lat", [""])[0])
                lon = float(query.get("lon", [""])[0])
                language = query.get("lang", ["en"])[0].strip()
                self._json(200, {"items": nearby_temples(lat, lon, language=language)})
            except (ValueError, OverflowError):
                self._json(400, {"error": "Valid coordinates are required.", "items": []})
            except Exception:
                self._json(503, {"error": "Nearby temple search is temporarily unavailable.", "items": []})
            return
        if path == "/api/location-preference":
            try:
                lat = float(query.get("lat", [""])[0])
                lon = float(query.get("lon", [""])[0])
                self._json(200, regional_preference(lat, lon))
            except (ValueError, OverflowError):
                self._json(400, {"error": "Valid coordinates are required."})
            except Exception:
                self._json(503, {"error": "Regional detection is temporarily unavailable."})
            return
        if path == "/api/mantra-recordings":
            title = query.get("title", [""])[0].strip()
            if not title:
                self._json(400, {"error": "A mantra title is required."})
                return
            try:
                self._json(200, {"items": search_mantra_recordings(title)})
            except Exception:
                self._json(503, {"error": "YouTube recordings are temporarily unavailable.", "items": []})
            return
        if path == "/api/profile":
            device_id = self.headers.get("X-Device-ID", "")[:100]
            if not device_id:
                self._json(400, {"error": "Device identity is required."})
            else:
                self._json(200, get_profile(device_id))
            return
        if path == "/api/favorites":
            device_id = self.headers.get("X-Device-ID", "")[:100]
            if not device_id:
                self._json(400, {"error": "Device identity is required."})
            else:
                self._json(200, {"items": list_favorites(device_id)})
            return
        if path == "/api/sacred-texts/content":
            title = query.get("title", [""])[0].strip()[:180]
            category = query.get("category", [""])[0].strip()[:80]
            language = query.get("language", ["en"])[0]
            if not title or language not in {"en", "sa"}:
                self._json(400, {"error": "A valid title and language are required."})
                return
            try:
                self._json(200, fetch_sacred_content(title, category, language))
            except LookupError as exc:
                self._json(404, {"error": str(exc)})
            except Exception:
                self._json(503, {"error": "The free-content source is temporarily unavailable."})
            return
        if path == "/api/sacred-texts/chapter":
            host = query.get("host", [""])[0].strip()
            page = query.get("page", [""])[0].strip()[:300]
            if not host or not page:
                self._json(400, {"error": "A valid source and chapter are required."})
                return
            try:
                self._json(200, fetch_chapter(host, page))
            except (LookupError, ValueError) as exc:
                self._json(404, {"error": str(exc)})
            except Exception:
                self._json(503, {"error": "The selected chapter is temporarily unavailable."})
            return
        if path != "/api/live-darshan":
            self._json(404, {"error": "Not found"})
            return
        try:
            self._json(200, CACHE.get())
        except RuntimeError:
            self._json(
                503,
                {
                    "error": "YouTube live search is temporarily unavailable. Please refresh shortly.",
                    "items": [],
                },
            )

    def _read_json(self) -> dict[str, Any]:
        try:
            length = min(int(self.headers.get("Content-Length", "0")), 100_000)
            payload = json.loads(self.rfile.read(length) or b"{}")
            return payload if isinstance(payload, dict) else {}
        except (ValueError, json.JSONDecodeError):
            return {}

    def do_POST(self) -> None:  # noqa: N802 - BaseHTTPRequestHandler API
        path = urlparse(self.path).path
        payload = self._read_json()
        device_id = self.headers.get("X-Device-ID", "")[:100]
        if path == "/api/explain":
            text = str(payload.get("text", "")).strip()
            word = str(payload.get("word", "")).strip()
            if not text and not word:
                self._json(400, {"error": "Text or a word is required."})
                return
            try:
                self._json(200, explain(text, word))
            except Exception:
                self._json(503, {"error": "Explanation is temporarily unavailable."})
            return
        if path == "/api/newsletter":
            email = str(payload.get("email", "")).strip().lower()
            if len(email) > 254 or not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email):
                self._json(400, {"error": "A valid email address is required."})
                return
            self._json(200, subscribe_newsletter(email))
            return
        if not device_id:
            self._json(400, {"error": "Device identity is required."})
            return
        if path == "/api/profile":
            self._json(200, save_profile(device_id, payload))
            return
        if path == "/api/japa":
            try:
                result = save_japa(device_id, str(payload.get("mantraId", "")), int(payload.get("count", 0)), str(payload.get("date", "")))
                self._json(200, result)
            except (TypeError, ValueError):
                self._json(400, {"error": "Valid mantra, count, and date values are required."})
            return
        if path == "/api/favorites":
            items = set_favorite(device_id, str(payload.get("resourceType", "mantra")), str(payload.get("resourceId", "")), bool(payload.get("active", True)))
            self._json(200, {"items": items})
            return
        self._json(404, {"error": "Not found"})

    def log_message(self, message: str, *args: Any) -> None:
        print(f"live-darshan-api: {message % args}", flush=True)


if __name__ == "__main__":
    init_db()
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print(f"live-darshan-api: listening on 127.0.0.1:{PORT}", flush=True)
    server.serve_forever()
