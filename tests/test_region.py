import io, json, os, sys, unittest
from unittest.mock import patch

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "server"))
import region

class Response:
    def __enter__(self): return self
    def __exit__(self, *_): return False
    def read(self): return json.dumps({"address":{"state":"Odisha","country_code":"in"}}).encode()

class RegionTests(unittest.TestCase):
    def test_every_indian_state_and_union_territory_has_a_regional_default(self):
        expected = {
            "andhra pradesh", "arunachal pradesh", "assam", "bihar",
            "chhattisgarh", "goa", "gujarat", "haryana", "himachal pradesh",
            "jharkhand", "karnataka", "kerala", "madhya pradesh",
            "maharashtra", "manipur", "meghalaya", "mizoram", "nagaland",
            "odisha", "punjab", "rajasthan", "sikkim", "tamil nadu",
            "telangana", "tripura", "uttar pradesh", "uttarakhand",
            "west bengal", "andaman and nicobar islands", "chandigarh",
            "dadra and nagar haveli and daman and diu", "delhi",
            "jammu and kashmir", "ladakh", "lakshadweep", "puducherry",
        }
        self.assertFalse(expected - set(region.STATE_LOCALES))
        self.assertNotIn("en", {region.STATE_LOCALES[state] for state in expected})

    @patch("region.urlopen", return_value=Response())
    def test_odisha_selects_odia_script(self, _):
        region._CACHE.clear()
        result=region.regional_preference(20.2961,85.8245)
        self.assertEqual(result["script"],"oriya")
        self.assertEqual(result["locale"],"or")
        self.assertEqual(result["state"],"Odisha")

    def test_rejects_invalid_coordinates(self):
        with self.assertRaises(ValueError): region.regional_preference(120,85)

if __name__ == "__main__": unittest.main()
