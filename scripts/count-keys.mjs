import fs from "node:fs";

const src = fs.readFileSync("src/lib/ui-keys.ts", "utf8");
const block = src.match(/export const UI_KEYS = \{([\s\S]*?)\} as const;/)?.[1] ?? "";
const keys = [...block.matchAll(/^\s+(\w+):/gm)].map((m) => m[1]);
console.log("ui-keys count:", keys.length);
console.log("last keys:", keys.slice(-5));

const gen = fs.readFileSync("scripts/generate-locale-packs.mjs", "utf8");
const genKeys = [...gen.matchAll(/^\s+"(\w+)",/gm)].map((m) => m[1]);
console.log("generate script count:", genKeys.length);

const inUiNotGen = keys.filter((k) => !genKeys.includes(k));
const inGenNotUi = genKeys.filter((k) => !keys.includes(k));
console.log("in ui-keys not in generate:", inUiNotGen.length, inUiNotGen);
console.log("in generate not in ui-keys:", inGenNotUi.length);
