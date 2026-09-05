"""Worldwide temple-place search backed by OpenStreetMap Nominatim.

The endpoint is intentionally query-driven: the bundled catalog supplies rich
editorial guides, while Nominatim makes a village, overseas temple or newly
added place discoverable without waiting for a frontend release.
"""
from __future__ import annotations

import json
import threading
import time
from typing import Any
from urllib.parse import urlencode, urlparse
from urllib.request import Request, urlopen

_CACHE: dict[str, tuple[float, list[dict[str, Any]]]] = {}
_LOCK = threading.Lock()
_TTL_SECONDS = 60 * 60
_SUPPORTED_LANGUAGES = {"en", "hi", "bn", "gu", "mr", "ta", "te", "ml", "kn", "or", "pa", "as"}


def _language(value: str) -> str:
    candidate = str(value or "en").strip().lower().split("-", 1)[0]
    return candidate if candidate in _SUPPORTED_LANGUAGES else "en"


def _normalize_query(value: str) -> str:
    words = " ".join(value.strip().split())[:120]
    return words.replace("karya sidhi", "karya siddhi").replace("Karya Sidhi", "Karya Siddhi")


def _first(address: dict[str, Any], *keys: str) -> str:
    for key in keys:
        value = str(address.get(key, "")).strip()
        if value:
            return value
    return ""


def _safe_url(value: Any) -> str:
    candidate = str(value or "").strip()
    parsed = urlparse(candidate)
    return candidate if parsed.scheme in {"http", "https"} and parsed.netloc else ""


def search_temples(query: str, limit: int = 18, language: str = "en") -> list[dict[str, Any]]:
    term = _normalize_query(query)
    if len(term) < 2:
        return []

    lang = _language(language)
    key = f"search:{lang}:{term.casefold()}"
    now = time.time()
    with _LOCK:
        cached = _CACHE.get(key)
        if cached and now - cached[0] < _TTL_SECONDS:
            return cached[1]

    search_term = term if any(word in key for word in ("temple", "mandir", "kovil", "pura", "matha", "devasthan")) else f"{term} Hindu temple"
    params = urlencode(
        {
            "format": "jsonv2",
            "q": search_term,
            "limit": max(1, min(limit, 25)),
            "addressdetails": 1,
            "namedetails": 1,
            "extratags": 1,
            "accept-language": f"{lang},en",
        }
    )
    request = Request(
        f"https://nominatim.openstreetmap.org/search?{params}",
        headers={
            "User-Agent": "DivinityHarmony/2.0 (https://mantra.sigq.in)",
            "Accept-Language": f"{lang},en",
        },
    )
    with urlopen(request, timeout=12) as response:
        payload = json.loads(response.read().decode("utf-8"))

    results: list[dict[str, Any]] = []
    seen: set[str] = set()
    for hit in payload if isinstance(payload, list) else []:
        try:
            lat = float(hit["lat"])
            lon = float(hit["lon"])
        except (KeyError, TypeError, ValueError):
            continue
        address = hit.get("address") if isinstance(hit.get("address"), dict) else {}
        names = hit.get("namedetails") if isinstance(hit.get("namedetails"), dict) else {}
        tags = hit.get("extratags") if isinstance(hit.get("extratags"), dict) else {}
        display_name = str(hit.get("display_name", "")).strip()
        name = str(names.get(f"name:{lang}") or names.get("name") or hit.get("name") or display_name.split(",")[0]).strip()
        identity = f"{name.casefold()}:{lat:.5f}:{lon:.5f}"
        if not name or identity in seen:
            continue
        seen.add(identity)
        results.append(
            {
                "id": f"osm-{hit.get('osm_type', 'place')}-{hit.get('osm_id', len(results))}",
                "name": name,
                "deity": str(tags.get("deity") or tags.get("denomination") or "Hindu temple").strip(),
                "city": _first(address, "city", "town", "village", "municipality", "county"),
                "state": _first(address, "state", "region", "state_district"),
                "country": _first(address, "country"),
                "lat": lat,
                "lon": lon,
                "type": "OpenStreetMap place",
                "timings": str(tags.get("opening_hours") or "Verify current hours before travel"),
                "summary": display_name,
                "tourismUrl": "",
                "imageQuery": f"{name} {address.get('country', '')}",
                "discovered": True,
            }
        )

    with _LOCK:
        _CACHE[key] = (now, results)
    return results


def nearby_temples(lat: float, lon: float, radius_km: int = 35, language: str = "en") -> list[dict[str, Any]]:
    if not (-90 <= lat <= 90 and -180 <= lon <= 180):
        raise ValueError("Invalid coordinates")
    radius = max(2, min(radius_km, 100)) * 1000
    lang = _language(language)
    key = f"near:{lang}:{lat:.3f}:{lon:.3f}:{radius}"
    now = time.time()
    with _LOCK:
        cached = _CACHE.get(key)
        if cached and now - cached[0] < _TTL_SECONDS:
            return cached[1]

    statement = (
        f'[out:json][timeout:20];nwr(around:{radius},{lat:.5f},{lon:.5f})'
        '["amenity"="place_of_worship"]["religion"="hindu"];out center tags 60;'
    )
    request = Request(
        "https://overpass-api.de/api/interpreter?" + urlencode({"data": statement}),
        headers={"User-Agent": "DivinityHarmony/2.0 (https://mantra.sigq.in)"},
    )
    with urlopen(request, timeout=25) as response:
        payload = json.loads(response.read().decode("utf-8"))

    results: list[dict[str, Any]] = []
    for item in payload.get("elements", []) if isinstance(payload, dict) else []:
        tags = item.get("tags") if isinstance(item.get("tags"), dict) else {}
        name = str(tags.get(f"name:{lang}") or tags.get("name") or tags.get("name:en") or "Local Hindu temple").strip()
        center = item.get("center") if isinstance(item.get("center"), dict) else {}
        item_lat = item.get("lat", center.get("lat"))
        item_lon = item.get("lon", center.get("lon"))
        try:
            item_lat = float(item_lat)
            item_lon = float(item_lon)
        except (TypeError, ValueError):
            continue
        locality = str(tags.get("addr:city") or tags.get("addr:place") or tags.get("addr:village") or "Nearby").strip()
        results.append(
            {
                "id": f"osm-{item.get('type', 'place')}-{item.get('id', len(results))}",
                "name": name,
                "deity": str(tags.get("deity") or tags.get("denomination") or "Hindu temple").strip(),
                "city": locality,
                "state": str(tags.get("addr:state") or "").strip(),
                "country": str(tags.get("addr:country") or "").strip(),
                "lat": item_lat,
                "lon": item_lon,
                "type": "Nearby OpenStreetMap place",
                "timings": str(tags.get("opening_hours") or "Verify current hours before travel"),
                "summary": str(tags.get("description") or tags.get("addr:full") or "Community-mapped Hindu place of worship").strip(),
                "tourismUrl": _safe_url(tags.get("website") or tags.get("contact:website")),
                "imageQuery": f"{name} {locality}",
                "discovered": True,
            }
        )

    with _LOCK:
        _CACHE[key] = (now, results)
    return results
