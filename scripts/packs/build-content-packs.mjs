/**
 * Build src/lib/content-packs.json from canonical English strings + locale packs.
 * Dedupes Odia keys (case variants) and aligns all translations to content-strings-en.json.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");

const LOCALES = ["hi", "bn", "gu", "mr", "ta", "te", "ml", "kn", "or", "pa", "as"];
const TRANSLATION_FILES = {
  hi: "content-translations-hi.json",
  or: "content-translations-or.json",
};

/** Parse JSON objects that may contain duplicate keys (last wins). */
function parseJsonObjectWithDupes(raw) {
  const out = {};
  const re = /^\s*"((?:\\.|[^"\\])*)"\s*:\s*"((?:\\.|[^"\\])*)"\s*,?\s*$/gm;
  let m;
  while ((m = re.exec(raw))) {
    out[JSON.parse(`"${m[1]}"`)] = JSON.parse(`"${m[2]}"`);
  }
  return out;
}

function loadTranslationFile(filename) {
  const filePath = path.join(__dirname, filename);
  const raw = fs.readFileSync(filePath, "utf8");
  try {
    return JSON.parse(raw);
  } catch {
    return parseJsonObjectWithDupes(raw);
  }
}

function alignPack(raw, englishStrings) {
  const caseIndex = new Map();
  for (const [key, value] of Object.entries(raw)) {
    const lower = key.toLowerCase();
    if (!caseIndex.has(lower)) caseIndex.set(lower, value);
  }

  const aligned = {};
  let matched = 0;
  for (const en of englishStrings) {
    if (Object.hasOwn(raw, en)) {
      aligned[en] = raw[en];
      matched++;
      continue;
    }
    const viaCase = caseIndex.get(en.toLowerCase());
    if (viaCase !== undefined) {
      aligned[en] = viaCase;
      matched++;
    }
  }
  return { aligned, matched };
}

const stringsPath = path.join(__dirname, "content-strings-en.json");
if (!fs.existsSync(stringsPath)) {
  console.error("Missing content-strings-en.json — run extract-content-strings.mjs first.");
  process.exit(1);
}

const englishStrings = JSON.parse(fs.readFileSync(stringsPath, "utf8"));
const packs = {};

for (const locale of LOCALES) {
  const file = TRANSLATION_FILES[locale];
  if (!file) {
    packs[locale] = {};
    continue;
  }
  const raw = loadTranslationFile(file);
  const { aligned, matched } = alignPack(raw, englishStrings);
  packs[locale] = aligned;
  console.log(`${locale}: ${matched}/${englishStrings.length} strings`);

  const cleanPath = path.join(__dirname, file);
  fs.writeFileSync(cleanPath, JSON.stringify(aligned, null, 2), "utf8");
  console.log(`  cleaned ${file}`);
}

const outPath = path.join(root, "src/lib/content-packs.json");
fs.writeFileSync(outPath, JSON.stringify(packs), "utf8");
const kb = (fs.statSync(outPath).size / 1024).toFixed(0);
console.log(`Wrote ${outPath} (${kb} KB)`);
