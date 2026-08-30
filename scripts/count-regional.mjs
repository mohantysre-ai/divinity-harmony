import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const UI_KEYS = JSON.parse(
  fs.readFileSync(path.join(root, "src/lib/ui-keys-export.json"), "utf8"),
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

function loadRegionalDict(locale) {
  const src = fs.readFileSync(
    path.join(root, "src/lib/regional-ui-dicts.ts"),
    "utf8",
  );
  const block = src.match(
    new RegExp(`export const ${locale}Dict: UiDict = \\{([\\s\\S]*?)\\n\\};`),
  )?.[1];
  return block ? parseDictBlock(block) : {};
}

function mapEnglishDict(englishDict) {
  const pack = {};
  for (const [key, english] of Object.entries(UI_KEYS)) {
    if (englishDict[english]) pack[key] = englishDict[english];
  }
  return pack;
}

for (const locale of ["gu", "ta", "te", "ml", "pa", "as", "mr", "or"]) {
  const mapped = mapEnglishDict(loadRegionalDict(locale));
  const missing = Object.keys(UI_KEYS).filter((k) => !mapped[k]);
  console.log(`${locale}: ${Object.keys(mapped).length} mapped, ${missing.length} missing`);
}
