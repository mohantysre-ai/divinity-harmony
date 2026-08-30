import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const UI_KEYS = JSON.parse(
  fs.readFileSync(path.join(root, "src/lib/ui-keys-export.json"), "utf8"),
);

function parseDictBlock(block) {
  const dict = {};
  for (const m of block.matchAll(
    /(?:"((?:\\.|[^"\\])*)"|([A-Za-z]+))\s*:\s*"((?:\\.|[^"\\])*)",?/g,
  )) {
    dict[(m[1] || m[2]).replace(/\\"/g, '"')] = m[3].replace(/\\"/g, '"');
  }
  return dict;
}

const src = fs.readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), "sources/old-ui-translations.ts"),
  "utf8",
);
const hiBlock = src.match(/hi:\s*\{([\s\S]*?)\n  \},\n  kn:/)?.[1];
const knBlock = src.match(/kn:\s*\{([\s\S]*?)\n  \},/)?.[1];

const out = {
  hi: parseDictBlock(hiBlock),
  kn: parseDictBlock(knBlock),
};

fs.writeFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), "sources/old-ui-translations-hi-kn.json"),
  JSON.stringify(out, null, 2) + "\n",
);

function mapToSemantic(ed) {
  const pack = {};
  for (const [key, english] of Object.entries(UI_KEYS)) {
    if (ed[english]) pack[key] = ed[english];
  }
  return pack;
}

for (const loc of ["hi", "kn"]) {
  const mapped = mapToSemantic(out[loc]);
  const missing = Object.keys(UI_KEYS).filter((k) => !mapped[k]);
  console.log(`${loc}: ${Object.keys(mapped).length} mapped, ${missing.length} missing`);
}
