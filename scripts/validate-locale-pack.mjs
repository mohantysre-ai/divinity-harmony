import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const keys = JSON.parse(
  fs.readFileSync(path.join(root, "src/lib/ui-keys-export.json"), "utf8"),
);
const packs = JSON.parse(
  fs.readFileSync(path.join(root, "src/lib/locale-packs.json"), "utf8"),
);

const allowedProperNouns =
  /Shiva|Krishna|Gayatri|Gita|YouTube|Supabase|Divinity Harmony|Ganesha|Nakshatra|Tithi|Yoga|Karana|Vedas|Gitas|Puranas|OpenStreetMap|Email|LIVE NOW|Reset|Krishna Paksha|Waning|Moon|Sunrise|Sunset|Punarvasu/i;
const latin = /[A-Za-z]{4,}/;

let failed = false;

for (const [locale, pack] of Object.entries(packs)) {
  const missing = Object.keys(keys).filter((k) => !pack[k]);
  if (missing.length) {
    console.error(`${locale}: missing ${missing.length} keys`, missing.slice(0, 5));
    failed = true;
  }
  if (!pack.exploreMantrasTemplate?.includes("{count}")) {
    console.error(`${locale}: exploreMantrasTemplate missing {count}`);
    failed = true;
  }
  if (!pack.starOf27?.includes("{n}")) {
    console.error(`${locale}: starOf27 missing {n}`);
    failed = true;
  }

  const issues = [];
  for (const [k, v] of Object.entries(pack)) {
    const stripped = v
      .replace(/\{count\}/g, "")
      .replace(/\{n\}/g, "")
      .replace(allowedProperNouns, "");
    if (latin.test(stripped)) issues.push(`${k}: ${v.slice(0, 60)}`);
  }
  if (issues.length) {
    console.log(`\n${locale} (${issues.length} possible latin mixes):`);
    console.log(issues.slice(0, 5).join("\n"));
  } else {
    console.log(`${locale}: ${Object.keys(pack).length} keys OK`);
  }
}

if (failed) process.exit(1);
