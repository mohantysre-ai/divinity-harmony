/** Fix UI keys where "All" was left in English. */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import translate from "google-translate-api-x";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const UI_KEYS = JSON.parse(
  fs.readFileSync(path.join(root, "src/lib/ui-keys-export.json"), "utf8"),
);

const KEYS = ["all", "allDeities", "backToCulturePacks", "tryAllCategories"];
const LOCALES = ["bn", "gu", "mr", "ta", "te", "ml", "kn", "pa", "as"];
const FILES = ["chrome-supplement.json", "pages-supplement.json"];

function shield(text) {
  const map = new Map();
  let i = 0;
  return {
    text: text.replace(/\{[^}]+\}/g, (m) => {
      const k = `__PH${i++}__`;
      map.set(k, m);
      return k;
    }),
    map,
  };
}

function restore(text, map) {
  let out = text;
  for (const [k, v] of map) out = out.split(k).join(v);
  return out;
}

for (const file of FILES) {
  const p = path.join(__dirname, file);
  const data = JSON.parse(fs.readFileSync(p, "utf8"));
  for (const locale of LOCALES) {
    if (!data[locale]) data[locale] = {};
    for (const key of KEYS) {
      if (!(key in data.or) && !(key in (data.hi || {}))) continue;
      const en = UI_KEYS[key];
      if (!en) continue;
      const { text, map } = shield(en);
      const r = await translate(text, { from: "en", to: locale, client: "gtx" });
      data[locale][key] = restore(r.text, map).trim();
    }
  }
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n");
}

console.log("Patched All-keys. Run: node scripts/write-locale-packs.mjs");
