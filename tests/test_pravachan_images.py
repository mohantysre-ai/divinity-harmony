import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class PravachanImageTests(unittest.TestCase):
    def test_pravachan_cards_use_youtube_thumbnails_not_random_art(self):
        page = (ROOT / "src/pages/WisdomLivePage.tsx").read_text(encoding="utf-8")
        talk_section = page.split('tk("pravachanGuide")', 1)[1].split('tk("publisherDirect")', 1)[0]

        self.assertIn("YouTubePravachanImage", talk_section)
        self.assertIn("youtubePreview?.title", talk_section)
        self.assertNotIn("wisdomImageCandidates(x.name, x.topic)", talk_section)
        self.assertNotIn("wisdomImageSearchQuery(x.name, x.topic)", talk_section)

    def test_backend_exposes_batch_thumbnail_endpoint(self):
        server = (ROOT / "server/live_darshan_api.py").read_text(encoding="utf-8")

        self.assertIn('path == "/api/pravachan-thumbnails"', server)
        self.assertIn('"source": "youtube-search"', server)


if __name__ == "__main__":
    unittest.main()
