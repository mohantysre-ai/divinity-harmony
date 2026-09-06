"""Live, cached cultural context for India's states and union territories."""

from __future__ import annotations

import json
import threading
import time
from urllib.parse import quote
from urllib.request import Request, urlopen


STATE_TITLES = {
    "andhra-pradesh": "Andhra Pradesh", "arunachal-pradesh": "Arunachal Pradesh",
    "assam": "Assam", "bihar": "Bihar", "chhattisgarh": "Chhattisgarh", "goa": "Goa",
    "gujarat": "Gujarat", "haryana": "Haryana", "himachal-pradesh": "Himachal Pradesh",
    "jharkhand": "Jharkhand", "karnataka": "Karnataka", "kerala": "Kerala",
    "madhya-pradesh": "Madhya Pradesh", "maharashtra": "Maharashtra", "manipur": "Manipur",
    "meghalaya": "Meghalaya", "mizoram": "Mizoram", "nagaland": "Nagaland", "odisha": "Odisha",
    "punjab": "Punjab, India", "rajasthan": "Rajasthan", "sikkim": "Sikkim",
    "tamil-nadu": "Tamil Nadu", "telangana": "Telangana", "tripura": "Tripura",
    "uttar-pradesh": "Uttar Pradesh", "uttarakhand": "Uttarakhand", "west-bengal": "West Bengal",
    "andaman-nicobar": "Andaman and Nicobar Islands", "chandigarh": "Chandigarh",
    "dadra-nagar-haveli-daman-diu": "Dadra and Nagar Haveli and Daman and Diu",
    "delhi": "Delhi", "jammu-kashmir": "Jammu and Kashmir (union territory)", "ladakh": "Ladakh",
    "lakshadweep": "Lakshadweep", "puducherry": "Puducherry",
}

_cache: dict[str, tuple[float, dict]] = {}
_lock = threading.Lock()
CACHE_SECONDS = 12 * 60 * 60


def _fetch_json(url: str) -> dict:
    request = Request(url, headers={"User-Agent": "DharmDisha/1.0 (https://mantra.sigq.in)"})
    with urlopen(request, timeout=15) as response:
        return json.loads(response.read().decode("utf-8"))


def culture_context(state_id: str) -> dict:
    title = STATE_TITLES.get(state_id)
    if not title:
        raise ValueError("Unknown state or union territory.")

    with _lock:
        cached = _cache.get(state_id)
        if cached and time.time() - cached[0] < CACHE_SECONDS:
            return cached[1]

    data = _fetch_json(
        f"https://en.wikipedia.org/api/rest_v1/page/summary/{quote(title, safe='')}"
    )
    content_urls = data.get("content_urls", {}).get("desktop", {})
    result = {
        "stateId": state_id,
        "title": data.get("title") or title,
        "description": data.get("description") or "",
        "summary": data.get("extract") or "",
        "imageUrl": data.get("thumbnail", {}).get("source") or data.get("originalimage", {}).get("source") or "",
        "sourceUrl": content_urls.get("page") or f"https://en.wikipedia.org/wiki/{quote(title.replace(' ', '_'))}",
        "officialUrl": f"https://www.incredibleindia.gov.in/en/{state_id}",
        "sourceName": "Wikipedia and Incredible India",
    }
    with _lock:
        _cache[state_id] = (time.time(), result)
    return result
