/**
 * Syncs scripts/locale-pack-data.json from the canonical app bundle.
 * Source of truth: node scripts/write-locale-packs.mjs → src/lib/locale-packs.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const canonical = path.join(root, "src/lib/locale-packs.json");
const out = path.join(__dirname, "locale-pack-data.json");

fs.copyFileSync(canonical, out);
const packs = JSON.parse(fs.readFileSync(out, "utf8"));
for (const locale of Object.keys(packs)) {
  console.log(`${locale}: ${Object.keys(packs[locale]).length} keys`);
}
console.log(`Synced ${out} from ${canonical}`);
