/**
 * Direct exporter: writes complete 225-key regional pack .mjs files.
 * Run: node scripts/packs/export-direct-packs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gu186 } from "./locales/gu186.mjs";
import { ta186 } from "./locales/ta186.mjs";
import { te186 } from "./locales/te186.mjs";
import { ml186 } from "./locales/ml186.mjs";
import { pa186 } from "./locales/pa186.mjs";
import { as186 } from "./locales/as186.mjs";
import { mr186 } from "./locales/mr186.mjs";
import { mrOverrides } from "./mr-overrides.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../..");

const KEY_LIST = Object.keys(
  JSON.parse(fs.readFileSync(path.join(root, "src/lib/ui-keys-export.json"), "utf8")),
);
const tailSupplement = JSON.parse(
  fs.readFileSync(path.join(__dirname, "tail-supplement.json"), "utf8"),
);

const LOCALES = {
  gu: { data: gu186, label: "Gujarati" },
  ta: { data: ta186, label: "Tamil" },
  te: { data: te186, label: "Telugu" },
  ml: { data: ml186, label: "Malayalam" },
  pa: { data: pa186, label: "Punjabi" },
  as: { data: as186, label: "Assamese" },
  mr: { data: mr186, label: "Marathi" },
};

function emit(locale, pack, label) {
  const lines = [`/** Complete ${label} UI pack — 225 semantic keys. */`];
  lines.push(`export const ${locale}Pack = {`);
  for (const key of KEY_LIST) {
    lines.push(`  ${key}: ${JSON.stringify(pack[key])},`);
  }
  lines.push("};");
  lines.push("");
  fs.writeFileSync(path.join(__dirname, `${locale}-pack.mjs`), lines.join("\n"));
}

for (const locale of ["hi", "kn", "bn", "gu", "mr", "ta", "te", "ml", "or", "pa", "as"]) {
  const tail = tailSupplement[locale];
  if (!tail || Object.keys(tail).length !== 39) {
    console.error(`tail-supplement ${locale}: expected 39 keys, got ${Object.keys(tail ?? {}).length}`);
    process.exit(1);
  }
}
console.log("tail-supplement.json: 11 locales × 39 keys OK");

for (const [locale, { data, label }] of Object.entries(LOCALES)) {
  let pack = { ...data, ...tailSupplement[locale] };
  if (locale === "mr") pack = { ...pack, ...mrOverrides };
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
  emit(locale, pack, label);
  console.log(`${locale}-pack.mjs: ${KEY_LIST.length} keys written`);
}
