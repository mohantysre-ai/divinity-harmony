import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = fs.readFileSync(path.join(root, "src/lib/ui-keys.ts"), "utf8");
const block = src.match(/export const UI_KEYS = \{([\s\S]*?)\n\} as const;/)?.[1] ?? "";
const out = {};
for (const m of block.matchAll(
  /(\w+):\s*\n?\s*"((?:\\.|[^"\\])*)"|(\w+):\s*"((?:\\.|[^"\\])*)"/g,
)) {
  const key = m[1] || m[3];
  const value = (m[2] || m[4] || "").replace(/\\"/g, '"');
  out[key] = value;
}
fs.writeFileSync(
  path.join(root, "src/lib/ui-keys-export.json"),
  JSON.stringify(out, null, 2) + "\n",
);
console.log(Object.keys(out).length, "keys exported");
