import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class HeaderNavigationTests(unittest.TestCase):
    def test_desktop_items_share_one_language_independent_width(self):
        header = (ROOT / "src/components/layout/Header.tsx").read_text(
            encoding="utf-8"
        )

        self.assertIn("const desktopNavItemClass", header)
        self.assertIn('w-[clamp(4.625rem,5.8vw,5.75rem)]', header)
        self.assertGreaterEqual(header.count("desktopNavItemClass"), 3)
        self.assertIn('truncate whitespace-nowrap', header)

    def test_explore_is_an_obvious_group_on_desktop_and_mobile(self):
        header = (ROOT / "src/components/layout/Header.tsx").read_text(
            encoding="utf-8"
        )

        self.assertIn("<DropdownMenuLabel", header)
        self.assertIn("<ChevronDown", header)
        self.assertIn('className="ml-4 border-l pl-2"', header)
        self.assertIn("isMoreNavigationActive", header)


if __name__ == "__main__":
    unittest.main()
