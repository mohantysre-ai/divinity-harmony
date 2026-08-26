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
        # Extract the search entries once. The earlier implementation made a
        # second request for every result, which made YouTube throttle the CI
        # runner and left an empty feed despite live results on YouTube.
        search = run([
            "yt-dlp", "--quiet", "--no-warnings", "--skip-download",
            "--dump-single-json", "--extractor-args", "youtube:player_client=web_safari",
            f"ytsearch50:{query}",
        ], 180) or {}
        for entry in search.get("entries", []):
            video_id = entry.get("id")
            if not video_id or video_id in items:
                continue
            if entry.get("live_status") != "is_live" and not entry.get("is_live"):
                continue
            timestamp = entry.get("release_timestamp") or entry.get("timestamp")
            items[video_id] = {
                "videoId": video_id,
                "title": entry.get("title") or "Live Temple Darshan",
                "description": entry.get("description") or "Live darshan stream",
                "channelTitle": entry.get("channel") or entry.get("uploader") or "YouTube channel",
                "channelId": entry.get("channel_id") or "",
                "startedAt": datetime.fromtimestamp(timestamp, timezone.utc).isoformat() if timestamp else None,
            }
    OUTPUT.write_text(json.dumps({"updatedAt": datetime.now(timezone.utc).isoformat(), "items": list(items.values())}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

if __name__ == "__main__":
    main()
