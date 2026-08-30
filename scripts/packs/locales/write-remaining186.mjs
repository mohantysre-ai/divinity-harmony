/**
 * Writes ta186, te186, ml186, pa186, as186, mr186 from packs186.json
 * Run: node scripts/packs/locales/write-remaining186.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packs = JSON.parse(fs.readFileSync(path.join(__dirname, "packs186.json"), "utf8"));

for (const locale of ["ta", "te", "ml", "pa", "as", "mr"]) {
  const data = packs[locale];
  const lines = [
    `/** ${locale.toUpperCase()} base UI pack — 186 semantic keys (187–225 in tail-supplement.json). */`,
    `export const ${locale}186 = {`,
  ];
  for (const [key, val] of Object.entries(data)) {
    lines.push(`  ${key}: ${JSON.stringify(val)},`);
  }
  lines.push("};");
  lines.push("");
  fs.writeFileSync(path.join(__dirname, `${locale}186.mjs`), lines.join("\n"));
  console.log(`${locale}186.mjs: ${Object.keys(data).length} keys`);
}
