import json
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class VirtualPujaGuidanceTests(unittest.TestCase):
    def test_every_ritual_step_has_complete_beginner_guidance(self):
        component = (ROOT / "src/components/puja/VirtualPuja.tsx").read_text(encoding="utf-8")
        guidance = (ROOT / "src/components/puja/ritual-guidance.ts").read_text(encoding="utf-8")
        step_ids = re.findall(r'\{ id: "([a-z]+)"', component)
        guide_blocks = dict(
            re.findall(
                r"^  ([a-z]+): \{\n(.*?)(?=^  [a-z]+: \{|^\};)",
                guidance,
                flags=re.MULTILINE | re.DOTALL,
            )
        )

        self.assertEqual(set(step_ids), set(guide_blocks))
        for step_id, block in guide_blocks.items():
            with self.subTest(step=step_id):
                for field in ("meaning", "purpose", "materials", "actions", "say", "duration", "completeWhen"):
                    self.assertRegex(block, rf"\b{field}:")
                self.assertGreaterEqual(len(re.findall(r'^      "', block, flags=re.MULTILINE)), 3)

    def test_preserves_six_flowers_and_two_aarti_circles(self):
        component = (ROOT / "src/components/puja/VirtualPuja.tsx").read_text(encoding="utf-8")

        flowers = re.search(r"const FLOWERS = \[(.*?)\];", component).group(1)
        self.assertEqual(flowers.count('"'), 12)
        self.assertIn("const AARTI_ROTATION_NEEDED = 720", component)

    def test_beginner_sections_are_rendered(self):
        component = (ROOT / "src/components/puja/VirtualPuja.tsx").read_text(encoding="utf-8")

        for label in (
            "What this means",
            "Why you do it",
            "What you need",
            "Do this now",
            "Say this in Sanskrit or your own language",
            "How long",
            "You are done when",
        ):
            self.assertIn(f'lc("{label}")', component)

    def test_all_step_meanings_have_reviewed_odia_copy(self):
        guidance = (ROOT / "src/components/puja/ritual-guidance.ts").read_text(encoding="utf-8")
        reviewed = json.loads(
            (ROOT / "scripts/packs/odia-virtual-puja-reviewed.json").read_text(encoding="utf-8")
        )
        meanings = re.findall(r'^    meaning: "([^"]+)",$', guidance, flags=re.MULTILINE)

        self.assertEqual(len(meanings), 16)
        self.assertEqual(set(meanings), set(reviewed))
        for translation in reviewed.values():
            self.assertNotRegex(translation, r"[A-Za-z]")

if __name__ == "__main__":
    unittest.main()
