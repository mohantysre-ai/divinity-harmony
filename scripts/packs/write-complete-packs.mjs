/**
 * Writes complete 225-key regional pack .mjs files from full locale data.
 * Run: node scripts/packs/write-complete-packs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mrOverrides } from "./mr-overrides.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../..");

const KEY_LIST = Object.keys(
  JSON.parse(fs.readFileSync(path.join(root, "src/lib/ui-keys-export.json"), "utf8")),
);
const TAIL_KEYS = KEY_LIST.slice(186);
const tailSupplement = JSON.parse(
  fs.readFileSync(path.join(__dirname, "tail-supplement.json"), "utf8"),
);

const LOCALE_NAMES = {
  gu: "Gujarati",
  ta: "Tamil",
  te: "Telugu",
  ml: "Malayalam",
  pa: "Punjabi",
  as: "Assamese",
  mr: "Marathi",
};

/** @type {Record<string, Record<string, string>>} */
const BASE186 = JSON.parse(
  fs.readFileSync(path.join(__dirname, "full-base186-packs.json"), "utf8"),
);

function emitMjs(locale, pack) {
  const exportName = `${locale}Pack`;
  const lines = [
    `/** Complete ${LOCALE_NAMES[locale]} UI pack — 225 semantic keys. */`,
    `export const ${exportName} = {`,
  ];
  for (const key of KEY_LIST) {
    lines.push(`  ${key}: ${JSON.stringify(pack[key])},`);
  }
  lines.push("};");
  lines.push("");
  fs.writeFileSync(path.join(__dirname, `${locale}-pack.mjs`), lines.join("\n"));
}

for (const locale of ["hi", "kn", "bn", "gu", "mr", "ta", "te", "ml", "or", "pa", "as"]) {
  const missingTail = TAIL_KEYS.filter((k) => !tailSupplement[locale]?.[k]);
  if (missingTail.length) {
    console.error(`tail-supplement ${locale}: missing ${missingTail.join(", ")}`);
    process.exit(1);
  }
  if (!tailSupplement[locale].starOf27.includes("{n}")) {
    console.error(`tail ${locale}: starOf27 missing {n}`);
    process.exit(1);
  }
}
console.log(`tail-supplement.json: 11 locales × ${TAIL_KEYS.length} keys OK`);

const packLocales = ["gu", "ta", "te", "ml", "pa", "as", "mr"];
for (const locale of packLocales) {
  let pack = { ...BASE186[locale], ...tailSupplement[locale] };
  if (locale === "mr") {
    pack = { ...pack, ...mrOverrides };
  }
  const missing = KEY_LIST.filter((k) => !pack[k]);
  if (missing.length) {
    console.error(`${locale}: missing ${missing.length}:`, missing.slice(0, 15).join(", "));
    process.exit(1);
  }
  if (!pack.exploreMantrasTemplate.includes("{count}")) {
    console.error(`${locale}: exploreMantrasTemplate missing {count}`);
    process.exit(1);
  }
  emitMjs(locale, pack);
  console.log(`${locale}-pack.mjs: ${KEY_LIST.length} keys written`);
}
