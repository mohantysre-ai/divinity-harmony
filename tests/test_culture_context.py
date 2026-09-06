import unittest
from unittest.mock import patch

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "server"))

import culture_context as context


class CultureContextTests(unittest.TestCase):
    def setUp(self):
        context._cache.clear()

    @patch("culture_context._fetch_json")
    def test_returns_sourced_dynamic_state_context(self, fetch):
        fetch.return_value = {
            "title": "Odisha",
            "description": "State of India",
            "extract": "Odisha has a distinctive cultural heritage.",
            "thumbnail": {"source": "https://upload.wikimedia.org/odisha.jpg"},
            "content_urls": {"desktop": {"page": "https://en.wikipedia.org/wiki/Odisha"}},
        }

        result = context.culture_context("odisha")

        self.assertIn("distinctive cultural heritage", result["summary"])
        self.assertEqual(result["imageUrl"], "https://upload.wikimedia.org/odisha.jpg")
        self.assertEqual(result["officialUrl"], "https://www.incredibleindia.gov.in/en/odisha")
        fetch.assert_called_once()

    def test_rejects_unlisted_state(self):
        with self.assertRaises(ValueError):
            context.culture_context("../../etc/passwd")


if __name__ == "__main__":
    unittest.main()
