/**
 * Generates src/lib/locale-packs.json from all pack sources.
 * Run: node scripts/write-locale-packs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bnPack } from "./packs/bn-pack.mjs";
import { guPack } from "./packs/gu-pack.mjs";
import { taPack } from "./packs/ta-pack.mjs";
import { tePack } from "./packs/te-pack.mjs";
import { mlPack } from "./packs/ml-pack.mjs";
import { paPack } from "./packs/pa-pack.mjs";
import { asPack } from "./packs/as-pack.mjs";
import { mrPack } from "./packs/mr-pack.mjs";
import { orSupplement } from "./packs/or-supplement.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const UI_KEYS = JSON.parse(
  fs.readFileSync(path.join(root, "src/lib/ui-keys-export.json"), "utf8"),
);
const KEY_LIST = Object.keys(UI_KEYS);

const { hi: hiEnglish, kn: knEnglish } = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "sources/old-ui-translations-hi-kn.json"),
    "utf8",
  ),
);
const hiKnMid = JSON.parse(
  fs.readFileSync(path.join(__dirname, "packs/hi-kn-mid.json"), "utf8"),
);
const hiKnExtended = JSON.parse(
  fs.readFileSync(path.join(__dirname, "packs/hi-kn-extended.json"), "utf8"),
);
const tailSupplement = JSON.parse(
  fs.readFileSync(path.join(__dirname, "packs/tail-supplement.json"), "utf8"),
);

function parseDictBlock(block) {
  const dict = {};
  for (const m of block.matchAll(
    /(?:"((?:\\.|[^"\\])*)"|([A-Za-z]+))\s*:\s*"((?:\\.|[^"\\])*)",?/g,
  )) {
    dict[(m[1] || m[2]).replace(/\\"/g, '"')] = m[3].replace(/\\"/g, '"');
  }
  return dict;
}

function mapEnglishDict(englishDict) {
  const pack = {};
  for (const [key, english] of Object.entries(UI_KEYS)) {
    if (englishDict[english]) pack[key] = englishDict[english];
  }
  return pack;
}

function loadOrBase() {
  const src = fs.readFileSync(
    path.join(root, "src/lib/regional-ui-dicts.ts"),
    "utf8",
  );
  const block = src.match(
    /export const orDict: UiDict = \{([\s\S]*?)\n\};/,
  )?.[1];
  return mapEnglishDict(parseDictBlock(block ?? ""));
}

function mergePack(...layers) {
  return Object.assign({}, ...layers);
}

const packs = {
  hi: mergePack(
    mapEnglishDict(hiEnglish),
    hiKnMid.hi,
    hiKnExtended.hi,
    tailSupplement.hi,
  ),
  kn: mergePack(
    mapEnglishDict(knEnglish),
    hiKnMid.kn,
    hiKnExtended.kn,
    tailSupplement.kn,
  ),
  bn: mergePack(bnPack, tailSupplement.bn),
  gu: guPack,
  mr: mrPack,
  ta: taPack,
  te: tePack,
  ml: mlPack,
  or: mergePack(loadOrBase(), orSupplement, tailSupplement.or),
  pa: paPack,
  as: asPack,
};

for (const [locale, pack] of Object.entries(packs)) {
  const missing = KEY_LIST.filter((k) => !pack[k]);
  if (missing.length) {
    console.error(`${locale}: missing ${missing.length}:`, missing.join(", "));
    process.exit(1);
  }
  if (!pack.exploreMantrasTemplate.includes("{count}")) {
    console.error(`${locale}: exploreMantrasTemplate missing {count}`);
    process.exit(1);
  }
  if (!pack.starOf27.includes("{n}")) {
    console.error(`${locale}: starOf27 missing {n}`);
    process.exit(1);
  }
}

const outPath = path.join(root, "src/lib/locale-packs.json");
fs.writeFileSync(outPath, JSON.stringify(packs, null, 2) + "\n");

for (const locale of Object.keys(packs)) {
  console.log(`${locale}: ${Object.keys(packs[locale]).length} keys`);
}
console.log(`Wrote ${outPath}`);
