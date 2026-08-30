/**
 * Finds Latin-mixed values in locale packs.
 * Allowed Latin: Shiva, Krishna, Gayatri, Gita, YouTube, Supabase, Divinity Harmony,
 * Nakshatra, Tithi, Yoga, Karana, Vedas, Gitas, Puranas, UT, {count}, {n}
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ALLOWED =
  /(?:Shiva|Krishna|Gayatri|Gita|YouTube|Supabase|Divinity Harmony|Nakshatra|Tithi|Yoga|Karana|Vedas|Gitas|Puranas|\{count\}|\{n\}|UT)/g;

function stripAllowed(s) {
  return s.replace(ALLOWED, "");
}

function latinHits(value) {
  const stripped = stripAllowed(value);
  const hits = stripped.match(/[A-Za-z]{2,}/g);
  return hits ? [...new Set(hits)] : [];
}

const locales = ["te", "ml", "pa", "ta", "bn", "mr", "as"];

for (const code of locales) {
  const mod = await import(
    pathToFileURL(path.join(__dirname, "packs", `${code}-pack.mjs`)).href
  );
  const pack = mod[`${code}Pack`];
  const keys = Object.keys(pack);
  const bad = [];
  for (const k of keys) {
    const hits = latinHits(pack[k]);
    if (hits.length) bad.push({ k, hits, v: pack[k] });
  }
  console.log(`\n${code}: ${keys.length} keys, ${bad.length} with unexpected Latin`);
  for (const b of bad.slice(0, 40)) {
    console.log(`  ${b.k}: [${b.hits.join(", ")}]`);
  }
  if (bad.length > 40) console.log(`  ... +${bad.length - 40} more`);
}
