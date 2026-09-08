/**
 * Rejects untranslated Latin words and accidental mixed-script characters in
 * every UI locale pack. Only immutable brands, technical acronyms, domains,
 * and interpolation placeholders may remain in Latin script.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const generatedPacks = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../src/lib/locale-packs.json"), "utf8"),
);
const reviewedOverrides = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../src/lib/locale-pack-reviewed-overrides.json"),
    "utf8",
  ),
);
const packs = Object.fromEntries(
  Object.entries(generatedPacks).map(([locale, values]) => [
    locale,
    { ...values, ...reviewedOverrides[locale] },
  ]),
);

const LOCALES = ["hi", "bn", "gu", "mr", "ta", "te", "ml", "kn", "or", "pa", "as"];
const IMMUTABLE_LATIN =
  /\{[^}]+\}|YouTube|LiveDarshanHub|Supabase|OpenStreetMap|Google Maps|Sulekha|Swiss Ephemeris|Chrome|Edge|JPG|JPEG|PNG|WebP|MB|README|Auth|ISBN|IGNCA|ISKCON|UNESCO|BAPS|MRT|KTM|TTD|PDF|GPS|UTC|IST|ID|API|URL|HTTP|HTTPS|OTP|JSON|SQL|AI|mantra\.sigq\.in|sigq\.in/gi;

const SCRIPT_RANGES = {
  devanagari: "\\u0900-\\u097F",
  bengali: "\\u0980-\\u09FF",
  gurmukhi: "\\u0A00-\\u0A7F",
  gujarati: "\\u0A80-\\u0AFF",
  odia: "\\u0B00-\\u0B7F",
  tamil: "\\u0B80-\\u0BFF",
  telugu: "\\u0C00-\\u0C7F",
  kannada: "\\u0C80-\\u0CFF",
  malayalam: "\\u0D00-\\u0D7F",
};

const EXPECTED_SCRIPT = {
  hi: "devanagari",
  mr: "devanagari",
  bn: "bengali",
  as: "bengali",
  gu: "gujarati",
  pa: "gurmukhi",
  or: "odia",
  ta: "tamil",
  te: "telugu",
  kn: "kannada",
  ml: "malayalam",
};

let failed = false;

for (const locale of LOCALES) {
  const pack = packs[locale];
  if (!pack) {
    console.error(`${locale}: missing locale pack`);
    failed = true;
    continue;
  }

  const latinFailures = [];
  const scriptFailures = [];
  const expected = EXPECTED_SCRIPT[locale];
  const foreignRanges = Object.entries(SCRIPT_RANGES)
    .filter(([name]) => name !== expected)
    .map(([, range]) => range)
    .join("");
  const foreignScript = new RegExp(`[${foreignRanges}]`, "u");

  for (const [key, value] of Object.entries(pack)) {
    // This key is rendered through the reviewed native brand spellings in
    // src/lib/brand.ts, so its canonical storage value is intentionally Latin.
    if (key === "divinityHarmony") continue;

    const remaining = value.replace(IMMUTABLE_LATIN, "");
    const latin = remaining.match(/[A-Za-z]{2,}/g);
    if (latin) latinFailures.push({ key, words: [...new Set(latin)] });
    // Danda punctuation is shared by several Indian writing systems even
    // though Unicode assigns it to the Devanagari block.
    if (foreignScript.test(value.replace(/[।॥]/g, ""))) scriptFailures.push(key);
  }

  console.log(
    `${locale}: ${Object.keys(pack).length} keys, ${latinFailures.length} unexpected Latin, ${scriptFailures.length} mixed-script`,
  );
  for (const item of latinFailures) {
    console.error(`  ${item.key}: ${item.words.join(", ")}`);
  }
  for (const key of scriptFailures) console.error(`  ${key}: foreign script character`);
  failed ||= latinFailures.length > 0 || scriptFailures.length > 0;
}

if (failed) process.exitCode = 1;
