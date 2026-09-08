import importlib.util
import io
import json
import os
import sys
import unittest
from pathlib import Path
from unittest.mock import patch


SERVER_DIR = Path(__file__).resolve().parents[1] / "server"
sys.path.insert(0, str(SERVER_DIR))
SPEC = importlib.util.spec_from_file_location("translation", SERVER_DIR / "translation.py")
translation = importlib.util.module_from_spec(SPEC)
assert SPEC and SPEC.loader
SPEC.loader.exec_module(translation)


class DynamicTranslationTests(unittest.TestCase):
    def setUp(self):
        translation.TRANSLATIONS._values.clear()

    def test_localizes_live_metadata_and_preserves_transport_fields(self):
        provider = {
            "data": {
                "translations": [
                    {"translatedText": "ଶ୍ରୀ ଜଗନ୍ନାଥଙ୍କ ସିଧା ପ୍ରସାରଣ"},
                    {"translatedText": "ଆଜିର ମନ୍ଦିର ଦର୍ଶନ"},
                    {"translatedText": "ଭକ୍ତି ଚ୍ୟାନେଲ"},
                    {"translatedText": "୨,୪୦୮ ଦର୍ଶକ"},
                ]
            }
        }
        mocked_response = io.BytesIO(json.dumps(provider).encode())
        item = {
            "videoId": "abc123",
            "title": "Live Shri Jagannath Darshan",
            "description": "Temple darshan today",
            "channelTitle": "Bhakti Channel",
            "watchingNow": "2,408 watching",
            "embedUrl": "https://www.youtube-nocookie.com/embed/abc123",
        }

        with patch.dict(os.environ, {"GOOGLE_TRANSLATE_API_KEY": "test-key"}, clear=False):
            with patch.object(translation, "urlopen") as mocked_open:
                mocked_open.return_value.__enter__.return_value = mocked_response
                items, localized = translation.localize_live_items([item], "or")

        self.assertTrue(localized)
        self.assertEqual(items[0]["title"], "ଶ୍ରୀ ଜଗନ୍ନାଥଙ୍କ ସିଧା ପ୍ରସାରଣ")
        self.assertEqual(items[0]["watchingNow"], "୨,୪୦୮ ଦର୍ଶକ")
        self.assertEqual(items[0]["videoId"], item["videoId"])
        self.assertEqual(items[0]["embedUrl"], item["embedUrl"])

    def test_missing_key_keeps_results_usable_without_fake_transliteration(self):
        item = {"videoId": "abc123", "title": "Live Temple Darshan"}
        with patch.dict(
            os.environ,
            {"GOOGLE_TRANSLATE_API_KEY": "", "VITE_GOOGLE_API_KEY": ""},
            clear=False,
        ):
            items, localized = translation.localize_live_items([item], "or")
        self.assertFalse(localized)
        self.assertEqual(items, [item])


if __name__ == "__main__":
    unittest.main()
