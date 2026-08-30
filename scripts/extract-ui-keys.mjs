import fs from "node:fs";

const src = fs.readFileSync("src/lib/ui-translations.ts", "utf8");
const hiBlock = src.match(/hi:\s*\{([\s\S]*?)\n  \},\n  kn:/)?.[1] ?? "";
const entries = [];
const re =
  /(?:"((?:\\.|[^"\\])*)"|([A-Za-z]+))\s*:\s*"((?:\\.|[^"\\])*)"/g;
let m;
while ((m = re.exec(hiBlock))) {
  entries.push([m[1] || m[2], m[3]]);
}
console.log(JSON.stringify(entries, null, 2));
console.error("count", entries.length);
