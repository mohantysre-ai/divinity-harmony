import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
const locales = ["hi", "bn", "gu", "mr", "ta", "te", "ml", "kn", "or", "pa", "as"];
const cultureStrings = read("scripts/packs/section-strings-en.json").culture;
const base = read("src/lib/content-packs.json");
const supplement = read("src/lib/content-supplement-packs.json");
const release = read("src/lib/content-release-supplement-packs.json");
const virtualPuja = read("src/lib/virtual-puja-translation-packs.json");
const output = {};

for (const locale of locales) {
  const translated = read(`scripts/packs/content-translations-${locale}.json`);
  const existing = { ...base[locale], ...supplement[locale], ...release[locale], ...virtualPuja[locale] };
  output[locale] = Object.fromEntries(
    cultureStrings
      .filter((english) => !Object.hasOwn(existing, english))
      .map((english) => [english, translated[english]])
      .filter(([, value]) => Boolean(value)),
  );
}

const outPath = path.join(root, "src/lib/culture-experience-packs.json");
fs.writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(Object.fromEntries(locales.map((locale) => [locale, Object.keys(output[locale]).length])));
