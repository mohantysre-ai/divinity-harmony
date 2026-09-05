"""Worldwide temple-place search backed by OpenStreetMap Nominatim.

The endpoint is intentionally query-driven: the bundled catalog supplies rich
editorial guides, while Nominatim makes a village, overseas temple or newly
added place discoverable without waiting for a frontend release.
"""
from __future__ import annotations

import html
import json
import os
import re
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from typing import Any
from urllib.parse import urlencode, urlparse
from urllib.request import Request, urlopen

_CACHE: dict[str, tuple[float, list[dict[str, Any]]]] = {}
_LOCK = threading.Lock()
_TTL_SECONDS = 60 * 60
_TRANSLATION_TTL_SECONDS = 30 * 24 * 60 * 60
_TRANSLATION_CACHE_LIMIT = 5000
_TRANSLATION_CACHE: dict[tuple[str, str], tuple[float, str]] = {}
_SUPPORTED_LANGUAGES = {"en", "hi", "bn", "gu", "mr", "ta", "te", "ml", "kn", "or", "pa", "as"}
_TARGET_SCRIPT = {
    "hi": re.compile(r"[\u0900-\u097f]"),
    "mr": re.compile(r"[\u0900-\u097f]"),
    "bn": re.compile(r"[\u0980-\u09ff]"),
    "as": re.compile(r"[\u0980-\u09ff]"),
    "gu": re.compile(r"[\u0a80-\u0aff]"),
    "pa": re.compile(r"[\u0a00-\u0a7f]"),
    "or": re.compile(r"[\u0b00-\u0b7f]"),
    "ta": re.compile(r"[\u0b80-\u0bff]"),
    "te": re.compile(r"[\u0c00-\u0c7f]"),
    "kn": re.compile(r"[\u0c80-\u0cff]"),
    "ml": re.compile(r"[\u0d00-\u0d7f]"),
}
_LOCALIZED_FIELDS = ("name", "deity", "city", "state", "country", "type", "timings", "summary")


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


def _needs_translation(text: str, language: str) -> bool:
    if not text or language == "en" or not any(character.isalpha() for character in text):
        return False
    target_script = _TARGET_SCRIPT.get(language)
    if target_script and target_script.search(text) and not re.search(r"[A-Za-z]", text):
        return False
    return True


def _official_google_translate(texts: list[str], language: str, api_key: str) -> list[str]:
    fields: list[tuple[str, str]] = [("q", text) for text in texts]
    fields.extend((("target", language), ("format", "text")))
    request = Request(
        "https://translation.googleapis.com/language/translate/v2?" + urlencode({"key": api_key}),
        data=urlencode(fields).encode("utf-8"),
        headers={"Content-Type": "application/x-www-form-urlencoded", "User-Agent": "DivinityHarmony/2.0"},
    )
    with urlopen(request, timeout=12) as response:
        payload = json.loads(response.read().decode("utf-8"))
    translations = payload.get("data", {}).get("translations", [])
    if len(translations) != len(texts):
        raise ValueError("Google Translation returned an incomplete batch")
    return [html.unescape(str(item.get("translatedText", "")).strip()) for item in translations]


def _public_google_translate(text: str, language: str) -> str:
    request = Request(
        "https://translate.googleapis.com/translate_a/single",
        data=urlencode({"client": "gtx", "sl": "auto", "tl": language, "dt": "t", "q": text}).encode("utf-8"),
        headers={"Content-Type": "application/x-www-form-urlencoded", "User-Agent": "Mozilla/5.0"},
    )
    with urlopen(request, timeout=12) as response:
        payload = json.loads(response.read().decode("utf-8"))
    segments = payload[0] if isinstance(payload, list) and payload else []
    return html.unescape("".join(str(segment[0]) for segment in segments if isinstance(segment, list) and segment).strip())


def _google_translate_batch(texts: list[str], language: str) -> list[str]:
    if not texts:
        return []
    api_key = os.environ.get("GOOGLE_TRANSLATE_API_KEY", "").strip()
    if api_key:
        try:
            translated: list[str] = []
            for offset in range(0, len(texts), 128):
                translated.extend(_official_google_translate(texts[offset : offset + 128], language, api_key))
            return translated
        except Exception:
            # A missing, expired or misconfigured key must not disable the
            # best-effort path while deployment configuration is corrected.
            pass
    try:
        with ThreadPoolExecutor(max_workers=min(12, len(texts))) as executor:
            return list(executor.map(lambda text: _public_google_translate(text, language), texts))
    except Exception:
        return []


def _translate_query_to_latin(text: str, language: str) -> str:
    """Turn a regional-script search into an English/Latin OSM lookup term."""
    target_script = _TARGET_SCRIPT.get(language)
    if language == "en" or not target_script or not target_script.search(text):
        return text
    now = time.time()
    cache_key = ("query-en", text)
    with _LOCK:
        cached = _TRANSLATION_CACHE.get(cache_key)
        if cached and now - cached[0] < _TRANSLATION_TTL_SECONDS:
            return cached[1]
    translated = _google_translate_batch([text], "en")
    latin = translated[0].strip() if translated else ""
    if not re.search(r"[A-Za-z]", latin):
        return text
    with _LOCK:
        _TRANSLATION_CACHE[cache_key] = (now, latin)
    return latin


def _translate_texts(texts: list[str], language: str) -> dict[str, str]:
    """Translate arbitrary OSM fields once, cache them, and fail safely to source text."""
    if language == "en":
        return {}
    now = time.time()
    unique = list(dict.fromkeys(text for text in texts if _needs_translation(text, language)))
    translated: dict[str, str] = {}
    missing: list[str] = []
    with _LOCK:
        for text in unique:
            cached = _TRANSLATION_CACHE.get((language, text))
            if cached and now - cached[0] < _TRANSLATION_TTL_SECONDS:
                translated[text] = cached[1]
            else:
                missing.append(text)
    if not missing:
        return translated

    # A failed translation must never make temple discovery fail. The browser
    # displays the original OSM text instead of manufacturing fake script.
    fresh = _google_translate_batch(missing, language)

    with _LOCK:
        for source, target in zip(missing, fresh):
            if target:
                translated[source] = target
                _TRANSLATION_CACHE[(language, source)] = (now, target)
        if len(_TRANSLATION_CACHE) > _TRANSLATION_CACHE_LIMIT:
            oldest = sorted(_TRANSLATION_CACHE, key=lambda key: _TRANSLATION_CACHE[key][0])
            for key in oldest[: len(_TRANSLATION_CACHE) - _TRANSLATION_CACHE_LIMIT]:
                _TRANSLATION_CACHE.pop(key, None)
    return translated


def _localize_results(results: list[dict[str, Any]], language: str) -> list[dict[str, Any]]:
    if language == "en" or not results:
        return results
    source_values = [str(item.get(field, "")).strip() for item in results for field in _LOCALIZED_FIELDS]
    translations = _translate_texts(source_values, language)
    for item in results:
        for field in _LOCALIZED_FIELDS:
            source = str(item.get(field, "")).strip()
            if source in translations:
                item[field] = translations[source]
    return results


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

    lookup_term = _translate_query_to_latin(term, lang)
    lookup_folded = lookup_term.casefold()
    search_term = lookup_term if any(word in lookup_folded for word in ("temple", "mandir", "kovil", "pura", "matha", "devasthan")) else f"{lookup_term} Hindu temple"
    params = urlencode(
        {
            "format": "jsonv2",
            "q": search_term,
            "limit": max(1, min(limit, 25)),
            "addressdetails": 1,
            "namedetails": 1,
            "extratags": 1,
            "accept-language": "en",
        }
    )
    request = Request(
        f"https://nominatim.openstreetmap.org/search?{params}",
        headers={
            "User-Agent": "DivinityHarmony/2.0 (https://mantra.sigq.in)",
            "Accept-Language": "en",
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
        name = str(names.get("name:en") or names.get("name") or hit.get("name") or display_name.split(",")[0]).strip()
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

    results = _localize_results(results, lang)
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
        name = str(tags.get("name:en") or tags.get("name") or "Local Hindu temple").strip()
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

    results = _localize_results(results, lang)
    with _LOCK:
        _CACHE[key] = (now, results)
    return results
