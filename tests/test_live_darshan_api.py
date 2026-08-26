import importlib.util
import json
import sys
import unittest
from pathlib import Path


SERVER_DIR = Path(__file__).resolve().parents[1] / "server"
sys.path.insert(0, str(SERVER_DIR))
MODULE_PATH = SERVER_DIR / "live_darshan_api.py"
SPEC = importlib.util.spec_from_file_location("live_darshan_api", MODULE_PATH)
api = importlib.util.module_from_spec(SPEC)
assert SPEC and SPEC.loader
SPEC.loader.exec_module(api)


class LiveDarshanParserTests(unittest.TestCase):
    def test_extracts_initial_data(self):
        expected = {"contents": {"example": True}}
        page = f"<script>var ytInitialData = {json.dumps(expected)};</script>"
        self.assertEqual(api.extract_initial_data(page), expected)

    def test_keeps_only_youtube_live_badges_and_deduplicates(self):
        live_renderer = {
            "videoId": "XLodj9R6fZI",
            "title": {"runs": [{"text": "Live Shirdi Sai Baba Temple"}]},
            "ownerText": {"runs": [{"text": "Darshan Channel"}]},
            "viewCountText": {"runs": [{"text": "2,345 watching"}]},
            "thumbnail": {"thumbnails": [{"url": "https://i.ytimg.com/test?x=1&amp;y=2"}]},
            "badges": [
                {"metadataBadgeRenderer": {"style": "BADGE_STYLE_TYPE_LIVE_NOW", "label": "LIVE"}}
            ],
        }
        recorded_renderer = {
            "videoId": "recorded123",
            "title": {"simpleText": "Recorded video with LIVE in its title"},
            "thumbnailOverlays": [
                {"thumbnailOverlayTimeStatusRenderer": {"style": "DEFAULT", "text": {"simpleText": "2:10"}}}
            ],
        }
        data = {
            "contents": [
                {"videoRenderer": live_renderer},
                {"nested": {"videoRenderer": live_renderer}},
                {"videoRenderer": recorded_renderer},
            ]
        }

        results = api.parse_live_results(data)

        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["videoId"], "XLodj9R6fZI")
        self.assertEqual(results[0]["watchingNow"], "2,345 watching")
        self.assertEqual(results[0]["thumbnailUrl"], "https://i.ytimg.com/test?x=1&y=2")

    def test_accepts_live_thumbnail_overlay(self):
        data = {
            "videoRenderer": {
                "videoId": "overlayLive1",
                "title": {"simpleText": "Temple Darshan"},
                "thumbnailOverlays": [
                    {"thumbnailOverlayTimeStatusRenderer": {"style": "LIVE", "text": {"simpleText": "LIVE"}}}
                ],
            }
        }
        self.assertEqual(api.parse_live_results(data)[0]["videoId"], "overlayLive1")


if __name__ == "__main__":
    unittest.main()
