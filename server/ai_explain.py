"""Cached mantra explanation with useful no-key fallback."""
from __future__ import annotations

import hashlib
import json
import os
from urllib.request import Request, urlopen

from db import cache_explanation, cached_explanation

GLOSSARY = {
    "ॐ": "Om is the primordial sacred sound, used to orient attention toward ultimate reality.",
    "शान्ति": "Shanti means peace—within oneself, among beings, and in the surrounding world.",
    "नमः": "Namah expresses reverence, bowing, and the release of self-centred pride.",
    "धर्म": "Dharma is sustaining order, ethical responsibility, and the right action appropriate to context.",
    "कर्म": "Karma means action and also the consequences shaped by intention and conduct.",
    "भक्ति": "Bhakti is loving devotion expressed through remembrance, worship, service, and surrender.",
}


def explain(text: str, word: str = "") -> dict:
    subject = (word or text).strip()[:1200]
    key = hashlib.sha256(subject.encode()).hexdigest()
    cached = cached_explanation(key)
    if cached:
        return {"explanation": cached, "source": "cache"}
    for term, meaning in GLOSSARY.items():
        if term in subject:
            cache_explanation(key, meaning)
            return {"explanation": meaning, "source": "glossary"}
    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if api_key:
        body = json.dumps({"model": "claude-3-5-haiku-latest", "max_tokens": 350, "messages": [{"role": "user", "content": f"Explain this Hindu sacred term or verse respectfully and concisely. Distinguish literal meaning from interpretation: {subject}"}]}).encode()
        request = Request("https://api.anthropic.com/v1/messages", data=body, headers={"x-api-key": api_key, "anthropic-version": "2023-06-01", "content-type": "application/json"})
        with urlopen(request, timeout=30) as response:
            data = json.load(response)
        answer = "\n".join(item.get("text", "") for item in data.get("content", []) if item.get("type") == "text").strip()
        if answer:
            cache_explanation(key, answer)
            return {"explanation": answer, "source": "ai"}
    return {"explanation": "This passage is available for reading and recitation. A detailed contextual explanation is not cached yet; enable the optional server-side AI key to expand unfamiliar verses.", "source": "fallback"}
