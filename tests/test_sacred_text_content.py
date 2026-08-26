import sys
import unittest
from pathlib import Path


SERVER_DIR = Path(__file__).resolve().parents[1] / "server"
sys.path.insert(0, str(SERVER_DIR))

from sacred_text_content import _candidate_score, _clean_search_title, html_to_text  # noqa: E402


class SacredTextContentTests(unittest.TestCase):
    def test_html_to_text_removes_scripts_and_keeps_paragraphs(self):
        value = html_to_text("<p>First verse</p><script>bad()</script><p>Second verse</p>")
        self.assertIn("First verse", value)
        self.assertIn("Second verse", value)
        self.assertNotIn("bad", value)

    def test_cleans_generated_catalog_suffix(self):
        self.assertEqual(_clean_search_title("Ganesha: Sacred Stories"), "Ganesha")

    def test_exact_source_title_is_preferred(self):
        self.assertLess(_candidate_score("Ramayana", "Ramayana"), _candidate_score("Ramayana", "Ramayana characters"))


if __name__ == "__main__":
    unittest.main()
