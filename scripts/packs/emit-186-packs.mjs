/**
 * Emits 186-key gu, ta, te, ml, pa, as pack modules.
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
import { taPack as taPackFull } from "./ta-pack.mjs";
import { tePack as tePackFull } from "./te-pack.mjs";
import { mlPack as mlPackFull } from "./ml-pack.mjs";
import { paPack as paPackFull } from "./pa-pack.mjs";
import { asPack as asPackFull } from "./as-pack.mjs";
import { taFixes, mlFixes, paFixes } from "./tail-native.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KEYS = Object.keys(bnPack);

/** @param {Record<string, string>} ...layers */
function merge(...layers) {
  return Object.assign({}, ...layers);
}

/** @param {Record<string, string>} full @param {Record<string, string>} fallback */
function pick186(full, fallback) {
  /** @type {Record<string, string>} */
  const out = {};
  for (const key of KEYS) {
    out[key] = full[key] ?? fallback[key];
  }
  return out;
}

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

emit("gu", gu186, "Gujarati");
emit("ta", merge(ta186, pick186(taPackFull, ta186), taFixes), "Tamil");
emit("te", merge(te186, pick186(tePackFull, te186)), "Telugu");
emit("ml", merge(ml186, pick186(mlPackFull, ml186), mlFixes), "Malayalam");
emit("pa", merge(pa186, pick186(paPackFull, pa186), paFixes), "Punjabi");
const asData = merge(as186, pick186(asPackFull, as186));
asData.footerDisclaimer = asData.footerDisclaimer.replace(
  "औपचारिक संस्कार",
  "ঔপচারিক সংস্কাৰ",
);
emit("as", asData, "Assamese");
