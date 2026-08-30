/**
 * Generates scripts/packs/locales/*186.mjs with complete native-script base packs.
 * Run: node scripts/packs/locales/generate-all186.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bnPack } from "../bn-pack.mjs";
import { orSupplement } from "../or-supplement.mjs";
import { hiEn } from "../hi-kn-en.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../../..");

const UI_KEYS = JSON.parse(
  fs.readFileSync(path.join(root, "src/lib/ui-keys-export.json"), "utf8"),
);
const KEY186 = Object.keys(UI_KEYS).slice(0, 186);

const hiKnExtended = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../hi-kn-extended.json"), "utf8"),
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

function fromEnglishDict(englishDict) {
  const pack = {};
  for (const [key, english] of Object.entries(UI_KEYS)) {
    if (englishDict[english]) pack[key] = englishDict[english];
  }
  return pack;
}

/** Complete 186-key native packs per locale. */
const PACKS186 = JSON.parse(
  fs.readFileSync(path.join(__dirname, "packs186.json"), "utf8"),
);

const hi186 = { ...fromEnglishDict(hiEn), ...hiKnExtended.hi };
PACKS186.mr = { ...hi186, ...PACKS186.mr };

for (const locale of ["gu", "ta", "te", "ml", "pa", "as", "mr"]) {
  const data = PACKS186[locale];
  const missing = KEY186.filter((k) => !data[k]);
  if (missing.length) {
    console.error(`${locale}: packs186.json missing ${missing.length}:`, missing.slice(0, 10).join(", "));
    process.exit(1);
  }
  if (!data.exploreMantrasTemplate.includes("{count}")) {
    console.error(`${locale}: exploreMantrasTemplate missing {count}`);
    process.exit(1);
  }
  const exportName = `${locale}186`;
  const lines = [`/** ${locale.toUpperCase()} base UI pack — 186 semantic keys (187–225 in tail-supplement.json). */`];
  lines.push(`export const ${exportName} = {`);
  for (const key of KEY186) {
    lines.push(`  ${key}: ${JSON.stringify(data[key])},`);
  }
  lines.push("};");
  lines.push("");
  fs.writeFileSync(path.join(__dirname, `${locale}186.mjs`), lines.join("\n"));
  console.log(`${locale}186.mjs: ${KEY186.length} keys`);
}
