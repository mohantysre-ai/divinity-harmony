import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class TempleImageTests(unittest.TestCase):
    def test_wikimedia_search_requests_a_renderable_image_url(self):
        source = (ROOT / "src/lib/wikimedia-image.ts").read_text(encoding="utf-8")

        self.assertIn('iiprop: "url"', source)
        self.assertIn("iiurlwidth", source)
        self.assertIn("thumburl", source)


if __name__ == "__main__":
    unittest.main()
