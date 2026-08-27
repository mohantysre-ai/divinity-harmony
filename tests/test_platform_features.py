import sys
import tempfile
import unittest
from pathlib import Path

SERVER_DIR = Path(__file__).resolve().parents[1] / "server"
sys.path.insert(0, str(SERVER_DIR))

import db  # noqa: E402
from ai_explain import explain  # noqa: E402
from panchang import daily_panchang  # noqa: E402


class PlatformFeatureTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        db.DB_PATH = str(Path(self.temp.name) / "test.db")
        db.init_db()

    def tearDown(self):
        self.temp.cleanup()

    def test_profile_japa_and_favorites_persist(self):
        profile = db.save_profile("device-1", {"name": "Devotee", "gotra": "Known family", "language": "hi"})
        self.assertEqual(profile["name"], "Devotee")
        sessions = db.save_japa("device-1", "1", 108, "2026-08-27")
        self.assertEqual(sessions["sessions"][0]["count"], 108)
        favorites = db.set_favorite("device-1", "mantra", "1", True)
        self.assertEqual(favorites[0]["resource_id"], "1")

    def test_panchang_returns_daily_fields(self):
        result = daily_panchang("2026-08-27", 20.29, 85.82)
        self.assertIn("tithi", result)
        self.assertIn("nakshatra", result)
        self.assertRegex(result["sunrise"], r"\d{2}:\d{2}")

    def test_explainer_has_no_key_glossary_fallback(self):
        result = explain("ॐ शान्ति शान्ति शान्ति")
        self.assertIn(result["source"], {"glossary", "cache"})
        self.assertTrue(result["explanation"])


if __name__ == "__main__":
    unittest.main()
