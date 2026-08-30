/**
 * Builds scripts/locale-pack-data.json
 * Run: node scripts/build-locale-pack-data.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { hiEn, knEn } from "./packs/hi-kn-en.mjs";
import { orSupplement } from "./packs/or-supplement.mjs";
import { bnPack } from "./packs/bn-pack.mjs";
import { guPack } from "./packs/gu-pack.mjs";
import { taPack } from "./packs/ta-pack.mjs";
import { tePack } from "./packs/te-pack.mjs";
import { mlPack } from "./packs/ml-pack.mjs";
import { paPack } from "./packs/pa-pack.mjs";
import { asPack } from "./packs/as-pack.mjs";
import { mrOverrides } from "./packs/mr-overrides.mjs";
import { hiExtra, knExtra } from "./packs/hi-kn-extra.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const genSrc = fs.readFileSync(path.join(root, "scripts/generate-locale-packs.mjs"), "utf8");
const KEYS = [...genSrc.matchAll(/^\s+"(\w+)",/gm)].map((m) => m[1]);

const uiSrc = fs.readFileSync(path.join(root, "src/lib/ui-keys.ts"), "utf8");
const uiBlock = uiSrc.match(/export const UI_KEYS = \{([\s\S]*?)\} as const;/)?.[1] ?? "";
/** @type {Record<string, string>} */
const UI_KEYS = {};
for (const m of uiBlock.matchAll(/^\s+(\w+):\s*\n?\s*"((?:\\.|[^"\\])*)"/gm)) {
  UI_KEYS[m[1]] = m[2].replace(/\\"/g, '"');
}
for (const m of uiBlock.matchAll(/^\s+(\w+):\s*"((?:\\.|[^"\\])*)"/gm)) {
  if (!UI_KEYS[m[1]]) UI_KEYS[m[1]] = m[2].replace(/\\"/g, '"');
}

function parseRegionalDict(locale) {
  const src = fs.readFileSync(path.join(root, "src/lib/regional-ui-dicts.ts"), "utf8");
  const block = src.match(
    new RegExp(`export const ${locale}Dict: UiDict = \\{([\\s\\S]*?)\\n\\};`),
  )?.[1];
  if (!block) return {};
  const dict = {};
  for (const m of block.matchAll(
    /(?:"((?:\\.|[^"\\])*)"|([A-Za-z]+))\s*:\s*\n?\s*"((?:\\.|[^"\\])*)",?/g,
  )) {
    dict[(m[1] || m[2]).replace(/\\"/g, '"')] = m[3].replace(/\\"/g, '"');
  }
  return dict;
}

function fromEnglishDict(enDict) {
  /** @type {Record<string, string>} */
  const pack = {};
  for (const key of KEYS) {
    const en = UI_KEYS[key];
    if (en && enDict[en]) pack[key] = enDict[en];
  }
  return pack;
}

function merge(...layers) {
  return Object.assign({}, ...layers);
}

const hi = merge(fromEnglishDict(hiEn), hiExtra);
const kn = merge(fromEnglishDict(knEn), knExtra);
const or = merge(fromEnglishDict(parseRegionalDict("or")), orSupplement);
let mr = merge(fromEnglishDict(parseRegionalDict("mr")), mrOverrides);
mr = merge(hi, mr);

const packs = { hi, kn, bn: bnPack, gu: guPack, mr, ta: taPack, te: tePack, ml: mlPack, or, pa: paPack, as: asPack };

for (const locale of Object.keys(packs)) {
  const missing = KEYS.filter((k) => !packs[locale][k]);
  if (missing.length) {
    console.error(`${locale}: missing ${missing.length} keys`);
    console.error(missing.join(", "));
    process.exit(1);
  }
  if (!packs[locale].exploreMantrasTemplate.includes("{count}")) {
    console.error(`${locale}: exploreMantrasTemplate missing {count}`);
    process.exit(1);
  }
  console.log(`${locale}: ${KEYS.length} keys`);
}

const out = path.join(__dirname, "locale-pack-data.json");
fs.writeFileSync(out, JSON.stringify(packs, null, 2) + "\n");
console.log(`Wrote ${out}`);
