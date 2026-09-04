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
