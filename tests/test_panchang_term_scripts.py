import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class PanchangTermScriptTests(unittest.TestCase):
    def test_every_regional_pack_uses_its_own_script(self):
        packs = json.loads(
            (ROOT / "src/lib/panchang-terms.json").read_text(encoding="utf-8")
        )
        ranges = {
            "hi": ((0x0900, 0x097F),),
            "mr": ((0x0900, 0x097F),),
            "bn": ((0x0980, 0x09FF),),
            "as": ((0x0980, 0x09FF),),
            "gu": ((0x0A80, 0x0AFF),),
            "pa": ((0x0A00, 0x0A7F),),
            "or": ((0x0B00, 0x0B7F),),
            "ta": ((0x0B80, 0x0BFF),),
            "te": ((0x0C00, 0x0C7F),),
            "kn": ((0x0C80, 0x0CFF),),
            "ml": ((0x0D00, 0x0D7F),),
        }

        def values(value):
            if isinstance(value, str):
                yield value
            elif isinstance(value, list):
                for item in value:
                    yield from values(item)
            elif isinstance(value, dict):
                for item in value.values():
                    yield from values(item)

        for locale, allowed_ranges in ranges.items():
            for text in values(packs[locale]):
                for character in text:
                    if not character.isalpha():
                        continue
                    codepoint = ord(character)
                    self.assertTrue(
                        any(start <= codepoint <= end for start, end in allowed_ranges),
                        f"{locale} contains wrong-script letter {character!r} in {text!r}",
                    )


if __name__ == "__main__":
    unittest.main()
