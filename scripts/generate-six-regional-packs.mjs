/**
 * Generates complete gu/ta/te/ml/pa/as pack modules.
 * Run: node scripts/generate-six-regional-packs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bnPack } from "./packs/bn-pack.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const keys = Object.keys(bnPack);

/** @type {Record<string, Record<string, string>>} */
const PACKS = JSON.parse(
  fs.readFileSync(path.join(__dirname, "packs", "six-regional-translations.json"), "utf8"),
);

const NAMES = {
  gu: "Gujarati",
  ta: "Tamil",
  te: "Telugu",
  ml: "Malayalam",
  pa: "Punjabi",
  as: "Assamese",
};

for (const locale of Object.keys(PACKS)) {
  const data = PACKS[locale];
  const missing = keys.filter((k) => !data[k]);
  if (missing.length) {
    console.error(`${locale} missing ${missing.length}: ${missing.join(", ")}`);
    process.exit(1);
  }
  if (!data.exploreMantrasTemplate.includes("{count}")) {
    console.error(`${locale}: exploreMantrasTemplate missing {count}`);
    process.exit(1);
  }
  const lines = [
    `/** Complete ${NAMES[locale]} UI pack — 186 semantic keys. */`,
    `export const ${locale}Pack = {`,
  ];
  for (const key of keys) {
    const val = data[key].replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    lines.push(`  ${key}: "${val}",`);
  }
  lines.push("};", "");
  const out = path.join(__dirname, "packs", `${locale}-pack.mjs`);
  fs.writeFileSync(out, lines.join("\n"));
  console.log(`Wrote ${out} (${keys.length} keys)`);
}
