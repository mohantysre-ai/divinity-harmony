import re
import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class CultureExperienceTests(unittest.TestCase):
    def test_every_state_and_union_territory_has_a_visual_profile(self):
        packs = (ROOT / "src/data/culture-packs.ts").read_text(encoding="utf-8")
        profiles = (ROOT / "src/data/state-culture-profiles.ts").read_text(encoding="utf-8")
        pack_ids = set(re.findall(r'\bid: "([^"]+)"', packs))
        profile_ids = set(
            left or right
            for left, right in re.findall(r'^  (?:"([^"]+)"|([a-z]+)):\s*\{', profiles, re.MULTILINE)
            if (left or right) != "region"
        )

        self.assertEqual(len(pack_ids), 36)
        self.assertEqual(pack_ids, profile_ids)

    def test_state_cards_open_a_rich_quick_view(self):
        page = (ROOT / "src/pages/CultureIndiaPage.tsx").read_text(encoding="utf-8")

        self.assertIn("<StateQuickView", page)
        self.assertIn("Why this place is special", page)
        self.assertIn("Signature arts", page)
        self.assertIn("Taste of the state", page)
        self.assertIn("Open official tourism source", page)

    def test_reviewed_culture_vocabulary_covers_every_regional_language(self):
        reviewed = json.loads(
            (ROOT / "scripts/packs/culture-experience-reviewed.json").read_text(
                encoding="utf-8"
            )
        )
        required = {
            "State culture statistics",
            "Featured festivals",
            "Living traditions",
            "Sacred places to explore",
            "Why this place is special",
            "Signature arts",
            "Taste of the state",
            "Cultural landscape",
            "Comfortable travel season",
            "Sacred journeys",
        }

        self.assertEqual(
            set(reviewed),
            {"hi", "bn", "gu", "mr", "ta", "te", "ml", "kn", "or", "pa", "as"},
        )
        for locale, translations in reviewed.items():
            self.assertTrue(required.issubset(translations), locale)
            for english in required:
                self.assertNotEqual(translations[english], english, f"{locale}: {english}")

    def test_regional_preview_never_uses_live_english_summary(self):
        page = (ROOT / "src/pages/CultureIndiaPage.tsx").read_text(encoding="utf-8")

        self.assertGreaterEqual(
            page.count('locale === "en" && context?.summary'),
            2,
        )


if __name__ == "__main__":
    unittest.main()
