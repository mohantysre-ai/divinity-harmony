import fs from "node:fs";

const src = fs.readFileSync("src/lib/ui-translations.ts", "utf8");
const block = src.match(/hi:\s*\{([\s\S]*?)\n  \},\n  kn:/)?.[1] ?? "";
console.log("block length", block.length);

function parseDictBlock(block) {
  const dict = {};
  for (const m of block.matchAll(
    /(?:"((?:\\.|[^"\\])*)"|([A-Za-z]+))\s*:\s*"((?:\\.|[^"\\])*)",?/g,
  )) {
    dict[(m[1] || m[2]).replace(/\\"/g, '"')] = m[3].replace(/\\"/g, '"');
  }
  return dict;
}

const dict = parseDictBlock(block);
console.log("parsed entries", Object.keys(dict).length);
console.log("sample", dict["Divinity Harmony"]);

const keysSrc = fs.readFileSync("src/lib/ui-keys.ts", "utf8");
const UI_KEYS = {};
for (const m of keysSrc.matchAll(/^\s+(\w+):\s*"((?:\\.|[^"\\])*)"/gm)) {
  UI_KEYS[m[1]] = m[2].replace(/\\"/g, '"');
}
console.log("UI_KEYS parsed", Object.keys(UI_KEYS).length);

let mapped = 0;
for (const [k, en] of Object.entries(UI_KEYS)) {
  if (dict[en]) mapped++;
}
console.log("mapped", mapped);
