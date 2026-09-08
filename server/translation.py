"""Server-side Google Cloud Translation for live catalogue metadata.

The browser never receives the API key. Translations are cached in memory so
the same YouTube title is not billed again on every five-minute refresh.
"""

from __future__ import annotations

import html
import json
import os
import threading
from typing import Any
from urllib.parse import urlencode
from urllib.request import Request, urlopen


SUPPORTED_LOCALES = {"hi", "bn", "gu", "mr", "ta", "te", "ml", "kn", "or", "pa", "as"}
TRANSLATE_URL = "https://translation.googleapis.com/language/translate/v2"
TRANSLATE_TIMEOUT_SECONDS = int(os.environ.get("GOOGLE_TRANSLATE_TIMEOUT_SECONDS", "15"))
TRANSLATE_BATCH_SIZE = 64


class TranslationCache:
    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._values: dict[tuple[str, str], str] = {}

    @property
    def configured(self) -> bool:
        return bool(self._api_key())

    @staticmethod
    def _api_key() -> str:
        # VITE_GOOGLE_API_KEY is accepted only as a backward-compatible runtime
        # alias. It is not passed to the Vite builder or exposed to visitors.
        return (
            os.environ.get("GOOGLE_TRANSLATE_API_KEY", "").strip()
            or os.environ.get("VITE_GOOGLE_API_KEY", "").strip()
        )

    def translate(self, values: list[str], locale: str) -> list[str]:
        if locale not in SUPPORTED_LOCALES:
            return values
        api_key = self._api_key()
        if not api_key:
            return values

        result = list(values)
        missing: list[tuple[int, str]] = []
        with self._lock:
            for index, value in enumerate(values):
                normalized = " ".join(str(value).split()).strip()
                if not normalized:
                    continue
                cached = self._values.get((locale, normalized))
                if cached is None:
                    missing.append((index, normalized))
                else:
                    result[index] = cached

        for offset in range(0, len(missing), TRANSLATE_BATCH_SIZE):
            batch = missing[offset : offset + TRANSLATE_BATCH_SIZE]
            payload = json.dumps(
                {
                    "q": [value for _, value in batch],
                    "source": "en",
                    "target": locale,
                    "format": "text",
                },
                ensure_ascii=False,
            ).encode("utf-8")
            request = Request(
                f"{TRANSLATE_URL}?{urlencode({'key': api_key})}",
                data=payload,
                headers={"Content-Type": "application/json; charset=utf-8"},
                method="POST",
            )
            with urlopen(request, timeout=TRANSLATE_TIMEOUT_SECONDS) as response:
                response_data: dict[str, Any] = json.loads(response.read().decode("utf-8"))
            translations = response_data.get("data", {}).get("translations", [])
            if len(translations) != len(batch):
                raise RuntimeError("Google Translation returned an incomplete batch")
            with self._lock:
                for (index, source), translated in zip(batch, translations):
                    text = html.unescape(str(translated.get("translatedText", "")).strip()) or source
                    self._values[(locale, source)] = text
                    result[index] = text
        return result


TRANSLATIONS = TranslationCache()


def localize_live_items(items: list[dict[str, Any]], locale: str) -> tuple[list[dict[str, Any]], bool]:
    """Translate changing YouTube fields while preserving IDs, URLs and images."""
    if locale not in SUPPORTED_LOCALES or not items:
        return items, locale == "en"

    fields = ("title", "description", "channelTitle", "watchingNow", "startedAt")
    positions: list[tuple[int, str]] = []
    values: list[str] = []
    for item_index, item in enumerate(items):
        for field in fields:
            value = str(item.get(field) or "").strip()
            if value:
                positions.append((item_index, field))
                values.append(value)

    if not TRANSLATIONS.configured:
        return items, False

    translated = TRANSLATIONS.translate(values, locale)
    localized = [dict(item) for item in items]
    for (item_index, field), value in zip(positions, translated):
        localized[item_index][field] = value
    return localized, True
