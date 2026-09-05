import io
import json
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "server"))
import temple_search


class TempleSearchTests(unittest.TestCase):
    @patch("temple_search.urlopen")
    def test_maps_nominatim_result(self, mocked_open):
        payload = [
            {
                "osm_type": "node",
                "osm_id": 42,
                "lat": "20.8484",
                "lon": "86.3373",
                "display_name": "Biraja Temple, Jajpur, Odisha, India",
                "namedetails": {"name": "Biraja Temple"},
                "address": {"town": "Jajpur", "state": "Odisha", "country": "India"},
                "extratags": {"religion": "hindu", "opening_hours": "06:00-21:00"},
            }
        ]
        mocked_open.return_value.__enter__.return_value = io.BytesIO(json.dumps(payload).encode())
        temple_search._CACHE.clear()

        result = temple_search.search_temples("Biraja Temple")

        self.assertEqual(result[0]["name"], "Biraja Temple")
        self.assertEqual(result[0]["city"], "Jajpur")
        self.assertEqual(result[0]["country"], "India")
        self.assertTrue(result[0]["discovered"])

    def test_short_query_returns_empty(self):
        self.assertEqual(temple_search.search_temples("x"), [])

    @patch("temple_search._translate_texts")
    @patch("temple_search.urlopen")
    def test_normalizes_spelling_and_translates_dynamic_name(self, mocked_open, mocked_translate):
        payload = [{
            "osm_type": "node", "osm_id": 51, "lat": "12.94", "lon": "77.54",
            "display_name": "Karya Siddhi Hanuman Temple, Bengaluru, India",
            "namedetails": {"name": "Karya Siddhi Hanuman Temple", "name:kn": "ಕಾರ್ಯ ಸಿದ್ಧಿ ಹನುಮಾನ್ ಟೆಂಪಲ್"},
            "address": {"city": "Bengaluru", "state": "Karnataka", "country": "India"},
            "extratags": {"deity": "Hanuman"},
        }]
        mocked_open.return_value.__enter__.return_value = io.BytesIO(json.dumps(payload).encode())
        mocked_translate.return_value = {"Karya Siddhi Hanuman Temple": "ಕಾರ್ಯ ಸಿದ್ಧಿ ಹನುಮಾನ್ ದೇವಸ್ಥಾನ"}
        temple_search._CACHE.clear()

        result = temple_search.search_temples("karya sidhi hanuman", language="kn")

        self.assertEqual(result[0]["name"], "ಕಾರ್ಯ ಸಿದ್ಧಿ ಹನುಮಾನ್ ದೇವಸ್ಥಾನ")
        requested_url = mocked_open.call_args.args[0].full_url
        self.assertIn("karya+siddhi+hanuman", requested_url)
        self.assertIn("accept-language=en", requested_url)

    @patch("temple_search._translate_texts")
    @patch("temple_search.urlopen")
    def test_translates_every_dynamic_display_field(self, mocked_open, mocked_translate):
        payload = [{
            "osm_type": "node", "osm_id": 99, "lat": "26.79", "lon": "82.19",
            "display_name": "Random Ram Temple, Example Village, Uttar Pradesh, India",
            "namedetails": {"name": "Random Ram Temple"},
            "address": {"village": "Example Village", "state": "Uttar Pradesh", "country": "India"},
            "extratags": {"deity": "Rama"},
        }]
        mocked_open.return_value.__enter__.return_value = io.BytesIO(json.dumps(payload).encode())
        mocked_translate.return_value = {
            "Random Ram Temple": "ଅଜଣା ରାମ ମନ୍ଦିର",
            "Rama": "ଶ୍ରୀରାମ",
            "Example Village": "ଉଦାହରଣ ଗାଁ",
            "Uttar Pradesh": "ଉତ୍ତର ପ୍ରଦେଶ",
            "India": "ଭାରତ",
            "OpenStreetMap place": "OpenStreetMap ସ୍ଥାନ",
            "Verify current hours before travel": "ଯାତ୍ରା ପୂର୍ବରୁ ସାମ୍ପ୍ରତିକ ସମୟ ଯାଞ୍ଚ କରନ୍ତୁ",
            "Random Ram Temple, Example Village, Uttar Pradesh, India": "ଅଜଣା ରାମ ମନ୍ଦିର, ଉଦାହରଣ ଗାଁ, ଉତ୍ତର ପ୍ରଦେଶ, ଭାରତ",
        }
        temple_search._CACHE.clear()

        result = temple_search.search_temples("random ram temple", language="or")

        self.assertEqual(result[0]["name"], "ଅଜଣା ରାମ ମନ୍ଦିର")
        self.assertEqual(result[0]["city"], "ଉଦାହରଣ ଗାଁ")
        self.assertEqual(result[0]["summary"], "ଅଜଣା ରାମ ମନ୍ଦିର, ଉଦାହରଣ ଗାଁ, ଉତ୍ତର ପ୍ରଦେଶ, ଭାରତ")
        self.assertEqual(result[0]["imageQuery"], "Random Ram Temple India")

    @patch("temple_search.urlopen")
    def test_maps_nearby_overpass_result(self, mocked_open):
        payload = {
            "elements": [
                {
                    "type": "node",
                    "id": 7,
                    "lat": 20.85,
                    "lon": 86.34,
                    "tags": {
                        "name": "Village Hanuman Temple",
                        "addr:village": "Jajpur",
                        "website": "javascript:alert(1)",
                    },
                }
            ]
        }
        mocked_open.return_value.__enter__.return_value = io.BytesIO(json.dumps(payload).encode())
        temple_search._CACHE.clear()

        result = temple_search.nearby_temples(20.85, 86.34)

        self.assertEqual(result[0]["city"], "Jajpur")
        self.assertIn("Nearby", result[0]["type"])
        self.assertEqual(result[0]["tourismUrl"], "")


if __name__ == "__main__":
    unittest.main()
