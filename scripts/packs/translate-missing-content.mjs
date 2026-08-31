/**
 * Translate only missing keys in content-strings-en.json into locale packs.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import translate from "google-translate-api-x";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const englishStrings = JSON.parse(
  fs.readFileSync(path.join(__dirname, "content-strings-en.json"), "utf8"),
);

const LOCALE_FILES = {
  hi: "content-translations-hi.json",
  bn: "content-translations-bn.json",
  gu: "content-translations-gu.json",
  mr: "content-translations-mr.json",
  ta: "content-translations-ta.json",
  te: "content-translations-te.json",
  ml: "content-translations-ml.json",
  kn: "content-translations-kn.json",
  or: "content-translations-or.json",
  pa: "content-translations-pa.json",
  as: "content-translations-as.json",
};

const argLocales = process.argv.slice(2).filter((x) => x in LOCALE_FILES);
const locales =
  argLocales.length > 0 ? argLocales : Object.keys(LOCALE_FILES);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function translateBatch(texts, to) {
  try {
    const results = await translate(texts, { from: "en", to, client: "gtx" });
    const arr = Array.isArray(results) ? results : [results];
    return arr.map((r, i) => r?.text ?? texts[i]);
  } catch {
    const out = [];
    for (const text of texts) {
      try {
        const r = await translate(text, { from: "en", to, client: "gtx" });
        out.push(r.text);
      } catch {
        out.push(text);
      }
      await sleep(120);
    }
    return out;
  }
}

for (const locale of locales) {
  const file = LOCALE_FILES[locale];
  const filePath = path.join(__dirname, file);
  const existing = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const missing = englishStrings.filter((en) => !Object.hasOwn(existing, en));
  if (missing.length === 0) {
    console.log(`${locale}: nothing missing`);
    continue;
  }
  console.log(`${locale}: translating ${missing.length} missing keys`);
  const batchSize = 40;
  for (let i = 0; i < missing.length; i += batchSize) {
    const batch = missing.slice(i, i + batchSize);
    const translated = await translateBatch(batch, locale);
    for (let j = 0; j < batch.length; j++) {
      existing[batch[j]] = translated[j];
    }
    process.stdout.write(`\r${locale}: ${Math.min(i + batchSize, missing.length)}/${missing.length}`);
    await sleep(250);
  }
  console.log();
  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), "utf8");
  console.log(`${locale}: wrote ${Object.keys(existing).length} keys`);
}
