import io, json, os, sys, unittest
from unittest.mock import patch

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "server"))
import region

class Response:
    def __enter__(self): return self
    def __exit__(self, *_): return False
    def read(self): return json.dumps({"address":{"state":"Odisha","country_code":"in"}}).encode()

class RegionTests(unittest.TestCase):
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
