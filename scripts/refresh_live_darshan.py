#!/usr/bin/env python3
"""Publish currently-live YouTube temple/darshan streams without a browser API key."""
import json
import subprocess
from datetime import datetime, timezone
from pathlib import Path

QUERIES = ["live temple darshan", "live mandir darshan", "live temple aarti", "live darshan India"]
ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "live-darshan-feed.json"

def run(command, timeout):
    try:
        result = subprocess.run(command, check=True, capture_output=True, text=True, timeout=timeout)
        return json.loads(result.stdout)
    except (subprocess.SubprocessError, json.JSONDecodeError):
        return None

def main():
    items = {}
    for query in QUERIES:
        search = run(["yt-dlp", "--quiet", "--no-warnings", "--skip-download", "--flat-playlist", "--dump-single-json", f"ytsearch50:{query}"], 120) or {}
        for entry in search.get("entries", []):
            video_id = entry.get("id")
            if not video_id or video_id in items:
                continue
            detail = run(["yt-dlp", "--quiet", "--no-warnings", "--skip-download", "--dump-single-json", f"https://www.youtube.com/watch?v={video_id}"], 45)
            if not detail or detail.get("live_status") != "is_live":
                continue
            timestamp = detail.get("release_timestamp")
            items[video_id] = {
                "videoId": video_id,
                "title": detail.get("title") or "Live Temple Darshan",
                "description": detail.get("description") or "Live darshan stream",
                "channelTitle": detail.get("channel") or detail.get("uploader") or "YouTube channel",
                "channelId": detail.get("channel_id") or "",
                "startedAt": datetime.fromtimestamp(timestamp, timezone.utc).isoformat() if timestamp else None,
            }
    OUTPUT.write_text(json.dumps({"updatedAt": datetime.now(timezone.utc).isoformat(), "items": list(items.values())}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

if __name__ == "__main__":
    main()
