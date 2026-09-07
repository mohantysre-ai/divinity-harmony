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

    def test_andhra_cards_open_sourced_deep_dive_stories(self):
        page = (ROOT / "src/pages/CultureIndiaPage.tsx").read_text(encoding="utf-8")
        deep_dives = (ROOT / "src/data/culture-deep-dives.ts").read_text(encoding="utf-8")

        self.assertIn("<ModuleDetailDialog", page)
        self.assertIn('role="button"', page)
        self.assertIn('"andhra-pradesh"', deep_dives)
        self.assertEqual(deep_dives.count("overview:\n"), 6)
        self.assertIn("tirumala.org/Utsavams.aspx", deep_dives)
        self.assertIn("srisailadevasthanam.org", deep_dives)
        self.assertIn("krishna.ap.gov.in/cultural-tourism", deep_dives)

    def test_every_state_gets_all_six_deep_dive_modules(self):
        deep_dives = (ROOT / "src/data/culture-deep-dives.ts").read_text(encoding="utf-8")
        page = (ROOT / "src/pages/CultureIndiaPage.tsx").read_text(encoding="utf-8")

        self.assertIn("generatedModule(stateId, moduleId)", deep_dives)
        self.assertIn("profile.arts", deep_dives)
        self.assertIn("profile.foods", deep_dives)
        self.assertIn("pack.festivals", deep_dives)
        self.assertIn("pack.traditions", deep_dives)
        self.assertIn("pack.temples", deep_dives)
        self.assertIn("Open the official state culture source", deep_dives)
        self.assertIn("catalogSummary", page)
        self.assertNotIn("generatedItemDetail", page)
        self.assertNotIn("is part of ${stateName}'s featured festival calendar", page)

    def test_regional_audio_does_not_render_raw_youtube_metadata(self):
        player = (ROOT / "src/components/player/YouTubeMantraPlayer.tsx").read_text(
            encoding="utf-8"
        )

        self.assertIn('const { locale, tk, lc } = useLocale()', player)
        self.assertIn('{lc(title)}', player)
        self.assertIn('locale === "en" ? `${current.title} · ${current.channelTitle}`', player)
        self.assertIn('locale === "en" ? item.channelTitle : tk("playRecording")', player)

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
