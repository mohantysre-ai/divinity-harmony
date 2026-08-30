import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const en = JSON.parse(fs.readFileSync(path.join(__dirname, "content-strings-en.json"), "utf8"));
const hi = JSON.parse(fs.readFileSync(path.join(__dirname, "content-translations-hi.json"), "utf8"));

function parseJsonWithDupes(raw) {
  const out = {};
  const re = /^\s*"((?:\\.|[^"\\])*)"\s*:\s*"((?:\\.|[^"\\])*)"\s*,?\s*$/gm;
  let m;
  let dupes = 0;
  while ((m = re.exec(raw))) {
    const key = JSON.parse(`"${m[1]}"`);
    const val = JSON.parse(`"${m[2]}"`);
    if (Object.hasOwn(out, key)) dupes++;
    out[key] = val;
  }
  return { out, dupes };
}

const orRaw = fs.readFileSync(path.join(__dirname, "content-translations-or.json"), "utf8");
const { out: or, dupes: orDupes } = parseJsonWithDupes(orRaw);

const enSet = new Set(en);
const ci = new Map(en.map((s) => [s.toLowerCase(), s]));

function coverage(pack, label) {
  let exact = 0;
  let ciMatch = 0;
  let missing = 0;
  for (const s of en) {
    if (pack[s]) exact++;
    else if (ci.has(s.toLowerCase()) && pack[ci.get(s.toLowerCase())]) ciMatch++;
    else missing++;
  }
  console.log(label, { exact, ciMatch, missing, keys: Object.keys(pack).length, dupes: label === "or" ? orDupes : 0 });
}

coverage(hi, "hi");
coverage(or, "or");
