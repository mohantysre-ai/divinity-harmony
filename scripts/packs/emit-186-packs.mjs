/**
 * Emits 186-key gu, ta, te, ml, pa, as pack modules from locale186 sources.
 * Run: node scripts/packs/emit-186-packs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bnPack } from "./bn-pack.mjs";
import { gu186 } from "./locales/gu186.mjs";
import { ta186 } from "./locales/ta186.mjs";
import { te186 } from "./locales/te186.mjs";
import { ml186 } from "./locales/ml186.mjs";
import { pa186 } from "./locales/pa186.mjs";
import { as186 } from "./locales/as186.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KEYS = Object.keys(bnPack);

/** @param {string} locale @param {Record<string,string>} data @param {string} label */
function emit(locale, data, label) {
  const missing = KEYS.filter((k) => !data[k]);
  if (missing.length) throw new Error(`${locale} missing: ${missing.join(", ")}`);
  if (!data.exploreMantrasTemplate.includes("{count}")) {
    throw new Error(`${locale} exploreMantrasTemplate missing {count}`);
  }
  const lines = [
    `/** Complete ${label} UI pack — 186 semantic keys. */`,
    `export const ${locale}Pack = {`,
  ];
  for (const key of KEYS) {
    lines.push(`  ${key}: ${JSON.stringify(data[key])},`);
  }
  lines.push("};", "");
  fs.writeFileSync(path.join(__dirname, `${locale}-pack.mjs`), lines.join("\n"));
  console.log(`${locale}-pack.mjs: ${KEYS.length} keys`);
}

const asFixes = {
  footerDisclaimer:
    "শik্ষামূলক ভak্তিমূলক বিষয় · মuhurt o औপchārik saṃskārৰ বabe যোগ্য আঞ্চলিক উৎসৰ সৈতে পৰীক্ষা কৰক।",
};

emit("gu", gu186, "Gujarati");
emit("ta", ta186, "Tamil");
emit("te", te186, "Telugu");
emit("ml", ml186, "Malayalam");
emit("pa", pa186, "Punjabi");
emit("as", { ...as186, ...asFixes }, "Assamese");
