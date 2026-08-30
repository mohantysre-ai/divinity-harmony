/**
 * Creates full-base186-packs.json from Odia (fullest regional source) + locale overrides.
 * Run: node scripts/packs/generate-base186.mjs && node scripts/packs/write-complete-packs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { orSupplement } from "./or-supplement.mjs";
import { hiEn } from "./hi-kn-en.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../..");

const UI_KEYS = JSON.parse(
  fs.readFileSync(path.join(root, "src/lib/ui-keys-export.json"), "utf8"),
);
const KEY186 = Object.keys(UI_KEYS).slice(0, 186);

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

function englishToSemantic(englishDict) {
  const pack = {};
  for (const [key, english] of Object.entries(UI_KEYS)) {
    if (englishDict[english]) pack[key] = englishDict[english];
  }
  return pack;
}

/** Odia base — most complete regional source (orDict + orSupplement). */
const orBase = {
  ...englishToSemantic(loadRegionalDict("or")),
  ...orSupplement,
};

/** Locale-specific full 186-key packs (native script). */
const LOCALE186 = JSON.parse(
  fs.readFileSync(path.join(__dirname, "locale186-overrides.json"), "utf8"),
);

function build186(locale) {
  const overrides = LOCALE186[locale] ?? {};
  const pack = { ...orBase };
  for (const key of KEY186) {
    if (overrides[key]) pack[key] = overrides[key];
  }
  return pack;
}

/** Marathi: Hindi semantic map + Marathi overrides from mr-overrides + locale186 mr. */
const hiKnExtended = JSON.parse(
  fs.readFileSync(path.join(__dirname, "hi-kn-extended.json"), "utf8"),
);
const hi186 = { ...englishToSemantic(hiEn), ...hiKnExtended.hi };

const out = {
  gu: build186("gu"),
  ta: build186("ta"),
  te: build186("te"),
  ml: build186("ml"),
  pa: build186("pa"),
  as: build186("as"),
  mr: { ...hi186, ...build186("mr") },
};

for (const locale of Object.keys(out)) {
  const missing = KEY186.filter((k) => !out[locale][k]);
  if (missing.length) {
    console.error(`${locale}: missing ${missing.length} base keys`);
    process.exit(1);
  }
  if (!out[locale].exploreMantrasTemplate?.includes("{count}")) {
    console.error(`${locale}: exploreMantrasTemplate missing {count}`);
    process.exit(1);
  }
}

fs.writeFileSync(
  path.join(__dirname, "full-base186-packs.json"),
  JSON.stringify(out, null, 2) + "\n",
);
console.log("Wrote full-base186-packs.json for", Object.keys(out).join(", "));
