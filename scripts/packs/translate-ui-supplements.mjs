/**
 * Translate chrome-supplement.json and pages-supplement.json into native scripts
 * for bn, gu, mr, ta, te, ml, kn, pa, as (preserves or + hi).
 *
 * Run: node scripts/packs/translate-ui-supplements.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import translate from "google-translate-api-x";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");

const TARGET_LOCALES = ["bn", "gu", "mr", "ta", "te", "ml", "kn", "pa", "as"];
const SUPPLEMENT_FILES = ["chrome-supplement.json", "pages-supplement.json"];

const UI_KEYS = JSON.parse(
  fs.readFileSync(path.join(root, "src/lib/ui-keys-export.json"), "utf8"),
);

const DO_NOT_TRANSLATE =
  /(?:YouTube|Supabase|Google Maps|OpenStreetMap|Sulekha|LiveDarshanHub|mantra\.sigq\.in|Divinity Harmony|Email|Play|JPG|PNG|WebP|API|LIVE|Reset|ID)/g;

function shieldPlaceholders(text) {
  const map = new Map();
  let i = 0;
  const shielded = text.replace(/\{[^}]+\}/g, (m) => {
    const key = `__PH${i++}__`;
    map.set(key, m);
    return key;
  });
  const brandMap = new Map();
  let b = 0;
  const withBrands = shielded.replace(DO_NOT_TRANSLATE, (m) => {
    const key = `__BR${b++}__`;
    brandMap.set(key, m);
    return key;
  });
  return { shielded: withBrands, map, brandMap };
}

function restorePlaceholders(text, map, brandMap) {
  let out = text;
  for (const [key, val] of map) out = out.split(key).join(val);
  for (const [key, val] of brandMap) out = out.split(key).join(val);
  return out;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function translateBatch(texts, to) {
  const shields = texts.map((t) => shieldPlaceholders(t));
  const payload = shields.map((s) => s.shielded);
  try {
    const results = await translate(payload, { from: "en", to, client: "gtx" });
    const arr = Array.isArray(results) ? results : [results];
    return arr.map((r, i) =>
      restorePlaceholders(r?.text ?? texts[i], shields[i].map, shields[i].brandMap),
    );
  } catch (err) {
    console.error(`Batch error (${to}):`, err.message);
    const out = [];
    for (let i = 0; i < payload.length; i++) {
      try {
        const r = await translate(payload[i], { from: "en", to, client: "gtx" });
        out.push(
          restorePlaceholders(r.text, shields[i].map, shields[i].brandMap),
        );
      } catch {
        out.push(texts[i]);
      }
      await sleep(120);
    }
    return out;
  }
}

async function translateSupplementBlock(keys, locale, existing = {}) {
  const result = { ...existing };
  const translatableKeys = keys.filter((key) => typeof UI_KEYS[key] === "string");
  const english = translatableKeys.map((key) => UI_KEYS[key]);
  const batchSize = 20;

  for (let i = 0; i < translatableKeys.length; i += batchSize) {
    const keyBatch = translatableKeys.slice(i, i + batchSize);
    const textBatch = english.slice(i, i + batchSize);
    const translated = await translateBatch(textBatch, locale);
    for (let j = 0; j < keyBatch.length; j++) {
      result[keyBatch[j]] = translated[j].replace(/\s+/g, " ").trim();
    }
    process.stdout.write(`\r  ${locale}: ${Math.min(i + batchSize, translatableKeys.length)}/${translatableKeys.length}`);
    await sleep(200);
  }
  console.log();
  return result;
}

for (const file of SUPPLEMENT_FILES) {
  const filePath = path.join(__dirname, file);
  const supplement = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const keys = Object.keys(supplement.or);

  console.log(`\n=== ${file} (${keys.length} keys) ===`);

  for (const locale of TARGET_LOCALES) {
    console.log(`Translating ${locale}...`);
    supplement[locale] = await translateSupplementBlock(keys, locale, supplement[locale]);
  }

  fs.writeFileSync(filePath, JSON.stringify(supplement, null, 2) + "\n");
  console.log(`Wrote ${filePath}`);
}

console.log("\nDone. Run: node scripts/write-locale-packs.mjs");
