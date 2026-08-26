"""Fetch freely reusable Hindu scripture and reference content from Wikimedia."""

from __future__ import annotations

import html
import json
import re
from html.parser import HTMLParser
from typing import Any
from urllib.parse import urlencode
from urllib.request import Request, urlopen


USER_AGENT = "DivinityHarmony/1.0 (educational reader; https://github.com/mohantysre-ai/divinity-harmony)"
TIMEOUT_SECONDS = 25
MAX_CHAPTERS = 250

WIKISOURCE_ROOTS = {
    "bhagavad gita": "The Bhagavad Gita (Arnold translation)",
    "valmiki ramayana": "The Ramayana",
    "ramayana": "The Ramayana",
    "mahabharata": "The Mahabharata",
    "rigveda samhita": "The Rig Veda",
    "rig veda": "The Rig Veda",
    "upanishads": "The Upanishads",
    "isha upanishad": "Isha Upanishad",
    "katha upanishad": "Katha Upanishad",
}


class _PlainTextParser(HTMLParser):
    block_tags = {
        "p", "div", "section", "article", "header", "footer", "li", "ul", "ol",
        "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "br", "tr", "table",
    }

    def __init__(self) -> None:
        super().__init__()
        self.parts: list[str] = []
        self.skip_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in {"style", "script", "noscript"}:
            self.skip_depth += 1
            return
        if not self.skip_depth and tag in self.block_tags:
            self.parts.append("\n")

    def handle_endtag(self, tag: str) -> None:
        if tag in {"style", "script", "noscript"} and self.skip_depth:
            self.skip_depth -= 1
            return
        if not self.skip_depth and tag in self.block_tags:
            self.parts.append("\n")

    def handle_data(self, data: str) -> None:
        if not self.skip_depth:
            self.parts.append(data)

    def text(self) -> str:
        value = html.unescape("".join(self.parts)).replace("\xa0", " ")
        value = re.sub(r"[ \t]+", " ", value)
        value = re.sub(r"\n[ \t]+", "\n", value)
        value = re.sub(r"\n{3,}", "\n\n", value)
        return value.strip()


def html_to_text(value: str) -> str:
    parser = _PlainTextParser()
    parser.feed(value)
    return parser.text()


def _api(host: str, params: dict[str, str]) -> dict[str, Any]:
    query = urlencode({**params, "format": "json", "formatversion": "2", "origin": "*"})
    request = Request(
        f"https://{host}/w/api.php?{query}",
        headers={"User-Agent": USER_AGENT, "Accept-Language": "en,sa;q=0.9"},
    )
    with urlopen(request, timeout=TIMEOUT_SECONDS) as response:
        return json.load(response)


def _search(host: str, query: str, limit: int = 8) -> list[str]:
    data = _api(host, {
        "action": "query", "list": "search", "srsearch": query, "srnamespace": "0",
        "srlimit": str(limit),
    })
    return [item["title"] for item in data.get("query", {}).get("search", []) if item.get("title")]


def _page_info(host: str, title: str) -> dict[str, str]:
    data = _api(host, {
        "action": "query", "titles": title, "prop": "info", "inprop": "url",
    })
    pages = data.get("query", {}).get("pages", [])
    if not pages or pages[0].get("missing"):
        return {}
    return {"title": pages[0].get("title", title), "url": pages[0].get("fullurl", "")}


def _parse_page(host: str, title: str) -> str:
    data = _api(host, {"action": "parse", "page": title, "prop": "text"})
    parsed = data.get("parse", {}).get("text", "")
    return html_to_text(parsed) if isinstance(parsed, str) else ""


def _subpages(host: str, root: str) -> list[str]:
    titles: list[str] = []
    continuation = ""
    while len(titles) < MAX_CHAPTERS:
        params = {
            "action": "query", "list": "allpages", "apprefix": f"{root}/",
            "apnamespace": "0", "aplimit": "max",
        }
        if continuation:
            params["apcontinue"] = continuation
        data = _api(host, params)
        titles.extend(page["title"] for page in data.get("query", {}).get("allpages", []) if page.get("title"))
        continuation = data.get("continue", {}).get("apcontinue", "")
        if not continuation:
            break
    return titles[:MAX_CHAPTERS]


def _clean_search_title(title: str) -> str:
    value = title.split(":", 1)[0]
    value = re.sub(r"\b(Sacred Place|Temple Traditions|Festival and Sacred Meaning|Meaning and Traditions|Rishi and Teacher|Ancestral Dharma|Heritage) Guide\b", "", value, flags=re.I)
    value = re.sub(r"\b(Sacred Stories|Iconography and Symbols|Names and Epithets|Mantras, Worship and Festivals)\b", "", value, flags=re.I)
    return re.sub(r"\s+", " ", value).strip(" -")


def _candidate_score(query: str, title: str) -> tuple[int, int]:
    needle = re.sub(r"[^a-z0-9]+", " ", query.lower()).strip()
    candidate = re.sub(r"[^a-z0-9]+", " ", title.lower()).strip()
    if candidate == needle:
        return (0, len(title))
    if candidate.startswith(needle):
        return (1, len(title))
    if needle in candidate:
        return (2, len(title))
    return (3, len(title))


def _wikisource_content(title: str, language: str) -> dict[str, Any] | None:
    host = "sa.wikisource.org" if language == "sa" else "en.wikisource.org"
    query = _clean_search_title(title)
    curated = WIKISOURCE_ROOTS.get(query.lower()) if language == "en" else None
    candidates = ([curated] if curated else []) + _search(host, query)
    candidates = sorted(dict.fromkeys(filter(None, candidates)), key=lambda item: _candidate_score(query, item))

    for candidate in candidates[:8]:
        info = _page_info(host, candidate)
        if not info:
            continue
        chapters = _subpages(host, info["title"])
        content = _parse_page(host, info["title"])
        if chapters:
            first_chapter = chapters[0]
            first_content = _parse_page(host, first_chapter)
            if len(first_content) >= 120:
                content = first_content
        if len(content) < 120 and not chapters:
            continue
        return {
            "source": "Sanskrit Wikisource" if language == "sa" else "English Wikisource",
            "sourceType": "wikisource",
            "host": host,
            "language": "Sanskrit" if language == "sa" else "English",
            "title": info["title"],
            "url": info["url"],
            "license": "Public domain or compatible free license; see the source page copyright tag.",
            "content": content,
            "activeChapter": chapters[0] if chapters and content else None,
            "chapters": chapters,
        }
    return None


def _wikipedia_content(title: str) -> dict[str, Any] | None:
    host = "en.wikipedia.org"
    query = _clean_search_title(title)
    candidates = sorted(_search(host, query), key=lambda item: _candidate_score(query, item))
    for candidate in candidates[:5]:
        info = _page_info(host, candidate)
        if not info:
            continue
        content = _parse_page(host, info["title"])
        if len(content) < 300:
            continue
        return {
            "source": "Wikipedia",
            "sourceType": "wikipedia",
            "host": host,
            "language": "English",
            "title": info["title"],
            "url": info["url"],
            "license": "Creative Commons Attribution-ShareAlike; attribution and revision history on source page.",
            "content": content,
            "activeChapter": None,
            "chapters": [],
        }
    return None


def fetch_sacred_content(title: str, category: str, language: str = "en") -> dict[str, Any]:
    scripture_category = category in {"Vedas & Vedangas", "Upanishads", "Puranas", "Gitas"}
    if language == "sa":
        result = _wikisource_content(title, "sa")
    elif scripture_category:
        result = _wikisource_content(title, "en") or _wikipedia_content(title)
    else:
        result = _wikipedia_content(title) or _wikisource_content(title, "en")
    if not result:
        raise LookupError(f"No freely reusable source content was found for {title}")
    return result


def fetch_chapter(host: str, page: str) -> dict[str, Any]:
    if host not in {"en.wikisource.org", "sa.wikisource.org"}:
        raise ValueError("Unsupported source host")
    info = _page_info(host, page)
    content = _parse_page(host, page)
    if not info or len(content) < 40:
        raise LookupError("Chapter content is unavailable")
    return {
        "source": "Sanskrit Wikisource" if host.startswith("sa.") else "English Wikisource",
        "sourceType": "wikisource",
        "host": host,
        "language": "Sanskrit" if host.startswith("sa.") else "English",
        "title": page,
        "url": info["url"],
        "license": "Public domain or compatible free license; see the source page copyright tag.",
        "content": content,
        "activeChapter": page,
        "chapters": [],
    }
