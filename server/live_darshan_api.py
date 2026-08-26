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
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any, Iterator
from urllib.parse import urlencode
from urllib.request import Request, urlopen


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
        with ThreadPoolExecutor(max_workers=min(5, len(SEARCH_QUERIES))) as executor:
            futures = {executor.submit(fetch_query, query): query for query in SEARCH_QUERIES}
            for future in as_completed(futures):
                query = futures[future]
                try:
                    query_items = future.result()
                    successful_queries += 1
                    for item in query_items:
                        items.setdefault(item["videoId"], item)
                except Exception as exc:  # Network/parser errors are summarized for the UI.
                    errors.append(f"{query}: {type(exc).__name__}")

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
            "source": "youtube-live-search",
            "stale": stale,
            "queryCount": len(SEARCH_QUERIES),
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
        path = self.path.split("?", 1)[0]
        if path == "/api/live-darshan/health":
            self._json(200, {"ok": True, "service": "live-darshan-search"})
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

    def log_message(self, message: str, *args: Any) -> None:
        print(f"live-darshan-api: {message % args}", flush=True)


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print(f"live-darshan-api: listening on 127.0.0.1:{PORT}", flush=True)
    server.serve_forever()
