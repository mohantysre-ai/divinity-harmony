/**
 * Emits te/ml/pa/ta pack.mjs files with full native-script translations.
 * Run: node scripts/packs/emit-native-packs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { guPack } from "./gu-pack.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KEYS = Object.keys(guPack);

/** @type {Record<string, Record<string, string>>} */
const NATIVE = JSON.parse(
  fs.readFileSync(path.join(__dirname, "native-fix-data.json"), "utf8"),
);

const LOCALES = [
  { code: "te", export: "tePack", label: "Telugu" },
  { code: "ml", export: "mlPack", label: "Malayalam" },
  { code: "pa", export: "paPack", label: "Punjabi" },
  { code: "ta", export: "taPack", label: "Tamil" },
];

function escape(str) {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

for (const { code, export: exportName, label } of LOCALES) {
  const dict = NATIVE[code];
  if (!dict) throw new Error(`Missing native-fix-data for ${code}`);
  const missing = KEYS.filter((k) => !(k in dict));
  if (missing.length) {
    throw new Error(`${code} missing keys: ${missing.join(", ")}`);
  }
  const lines = KEYS.map((k) => `  ${k}: "${escape(dict[k])}",`);
  const body = `/** Complete ${label} UI pack — 225 semantic keys. */
export const ${exportName} = {
${lines.join("\n")}
};
`;
  fs.writeFileSync(path.join(__dirname, `${code}-pack.mjs`), body, "utf8");
  console.log(`Wrote ${code}-pack.mjs (${KEYS.length} keys)`);
}
