import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class BrandIdentityTests(unittest.TestCase):
    def test_brand_uses_reviewed_native_script_spellings(self):
        brand = (ROOT / "src/lib/brand.ts").read_text(encoding="utf-8")
        fallback = (ROOT / "src/lib/regional-fallback.ts").read_text(encoding="utf-8")
        locale_packs = (ROOT / "src/lib/locale-packs.ts").read_text(encoding="utf-8")
        ui_translations = (ROOT / "src/lib/ui-translations.ts").read_text(encoding="utf-8")

        self.assertIn('BRAND_NAME = "DharmDisha"', brand)
        self.assertIn('hi: "धर्म दिशा"', brand)
        self.assertIn('or: "ଧର୍ମ ଦିଶା"', brand)
        self.assertNotIn('or: "ଧର୍ମ ଦିଗ"', brand)
        self.assertIn("word === BRAND_NAME", fallback)
        self.assertIn("localizedBrandName(locale)", fallback)
        self.assertIn('key === "divinityHarmony"', locale_packs)
        self.assertIn("isCanonicalBrandText(text)", ui_translations)
        self.assertIn("localizedBrandName(locale)", ui_translations)

    def test_visible_wordmarks_opt_out_of_dom_translation(self):
        for relative in (
            "src/components/layout/Header.tsx",
            "src/components/layout/Footer.tsx",
            "src/components/auth/SplashScreen.tsx",
        ):
            source = (ROOT / relative).read_text(encoding="utf-8")
            self.assertIn("localizedBrandName", source, relative)
            self.assertIn("data-no-regionalize", source, relative)


if __name__ == "__main__":
    unittest.main()
