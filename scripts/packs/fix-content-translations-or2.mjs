/**
 * Final Odia cleanup: use Hindi translations as bridge, transliterate titles, fix fragments.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import translate from "google-translate-api-x";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const orPath = path.join(__dirname, "content-translations-or.json");
const hiPath = path.join(__dirname, "content-translations-hi.json");
const or = JSON.parse(fs.readFileSync(orPath, "utf8"));
const hi = JSON.parse(fs.readFileSync(hiPath, "utf8"));

function hasLatin(s) {
  return /[A-Za-z]{2,}/.test(s.replace(/\$\{[^}]+\}/g, ""));
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function hiToOr(hiText) {
  const phMap = new Map();
  let pi = 0;
  const shielded = hiText.replace(/\$\{[^}]+\}/g, (m) => {
    const k = `__PH${pi++}__`;
    phMap.set(k, m);
    return k;
  });
  const r = await translate(shielded, { from: "hi", to: "or", client: "gtx" });
  let val = r.text;
  for (const [k, v] of phMap) val = val.split(k).join(v);
  return val.replace(/\s+/g, " ").trim();
}

const needsFix = Object.keys(or).filter((k) => hasLatin(or[k]));
console.log(`Bridging ${needsFix.length} entries via Hindi...`);

let done = 0;
for (const k of needsFix) {
  const hiVal = hi[k];
  if (hiVal && !hasLatin(hiVal.replace(/\$\{[^}]+\}/g, ""))) {
    try {
      or[k] = await hiToOr(hiVal);
    } catch {
      /* keep */
    }
  } else {
    try {
      const r = await translate(k, { from: "en", to: "or", client: "gtx" });
      or[k] = r.text;
    } catch {
      /* keep */
    }
  }
  done++;
  if (done % 25 === 0) process.stdout.write(`\r${done}/${needsFix.length}`);
  await sleep(150);
}

// Fix common broken token patterns from prior passes
const cleanup = [
  [/__T\d+__/g, ""],
  [/\bwar\b/gi, "ବାମ"],
  [/\bmel\b/gi, ""],
  [/\bish\b/gi, ""],
  [/\bed\b/gi, ""],
  [/\bics\b/gi, ""],
  [/\bDiv\b/g, "ଦିବ୍ୟ"],
  [/\bIg\b/g, "ଋଗ୍"],
  [/\bVeg\b/g, "ଋଗ୍"],
  [/\bAge\b/g, "ଋଷି"],
  [/\bush\b/gi, ""],
  [/\bait\b/gi, ""],
  [/\bframework\b/gi, "ଢାଞ୍ଚା"],
  [/\bhistorical\b/gi, "ଐତିହାସିକ"],
  [/\bgratitude\b/gi, "କୃତଜ୍ଞତା"],
  [/\bglory\b/gi, "ମହିମା"],
  [/\btheistic\b/gi, "ଈଶ୍ୱରବାଦୀ"],
  [/\bCosmology\b/gi, "ବ୍ରହ୍ମାଣ୍ଡ"],
  [/\bcosmology\b/gi, "ବ୍ରହ୍ମାଣ୍ଡ"],
  [/\bgeography\b/gi, "ଭୂଗୋଳ"],
  [/\bgraphy\b/gi, "ଗୋଳ"],
  [/\bregional\b/gi, "ଅଞ୍ଚଳୀୟ"],
  [/\bancestral\b/gi, "ପୂର୍ବପୁରୁଷ"],
  [/\bofferings\b/gi, "ନivededya"],
  [/\bofferings\b/gi, "ନivededya"],
  [/\bofferings\b/gi, "ଅର୍ପଣ"],
  [/\boffering\b/gi, "ଅର୍ପଣ"],
  [/\bpoured\b/gi, "ଢାଳି"],
  [/\bmiddle\b/gi, "ମଧ୍ୟ"],
  [/\btips\b/gi, "ଶୀର୍ଷ"],
  [/\bVaruna\b/g, "ବରୁଣ"],
  [/\bJain\b/g, "ଜ Jain"],
  [/\bsynthesis\b/gi, "ସଂଯୋଗ"],
  [/\bBrihat\b/g, "ବୃହତ୍"],
  [/\bSamhita\b/g, "ସଂହିତା"],
  [/\bBaidyanath\b/g, "ବaidyanath"],
  [/\bDham\b/g, "ଧାମ"],
  [/\bMahalakshmi\b/gi, "ମହାଲକ୍ଷ୍ମୀ"],
  [/\bBija\b/gi, "ବୀଜ"],
  [/\bCore\b/g, "ମୂଳ"],
  [/\bVegveda\b/g, "ଋଗ୍ୱେଦ"],
  [/\bMahamrityunjaya\b/gi, "ମହାମୃତ୍ୟ�unjaya"],
  [/\bNarayana\b/g, "ନାରାୟଣ"],
  [/\bUpanishad\b/g, "ଉପନିଷଦ"],
  [/\bRadha\b/g, "ରାଧା"],
  [/\bShyama\b/g, "ଶ୍ୟାମ"],
  [/\bSita\b/g, "ସୀତା"],
  [/\bRadha-Shyama\b/g, "ରାଧା-ଶ୍ୟାମ"],
  [/\bRama-Sita\b/g, "ରାମ-ସୀତା"],
  [/\bnama\b/gi, "ନାମ"],
  [/\bRadha-ayma\b/g, "ରାଧା-ଶ୍ୟାମ"],
  [/\bRadha-Shyama\b/g, "ରାଧା-ଶ୍ୟାମ"],
  [/\bRadha\b/g, "ରାଧା"],
  [/\bRadha\b/g, "ରାଧା"],
  [/\s+\|/g, "।"],
  [/\s{2,}/g, " "],
];

for (const [k, v] of Object.entries(or)) {
  let fixed = v;
  for (const [re, rep] of cleanup) fixed = fixed.replace(re, rep);
  or[k] = fixed.trim();
}

// Title-like keys: if value still has Latin and key looks like a title, use Hindi->Or again
const stillLatin = Object.keys(or).filter((k) => hasLatin(or[k]));
console.log(`\nRemaining after bridge: ${stillLatin.length}`);

for (const k of stillLatin.slice(0, 100)) {
  if (hi[k]) {
    try {
      or[k] = await hiToOr(hi[k]);
    } catch {
      /* keep */
    }
    await sleep(120);
  }
}

console.log(`Final Latin count: ${Object.values(or).filter(hasLatin).length}`);
fs.writeFileSync(orPath, JSON.stringify(or, null, 2), "utf8");
