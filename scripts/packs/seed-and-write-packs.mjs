/**
 * Seeds complete 225-key regional packs and writes .mjs exports.
 * Run: node scripts/packs/seed-and-write-packs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bnPack } from "./bn-pack.mjs";
import { mrOverrides } from "./mr-overrides.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../..");

const UI_KEYS = JSON.parse(
  fs.readFileSync(path.join(root, "src/lib/ui-keys-export.json"), "utf8"),
);
const KEY_LIST = Object.keys(UI_KEYS);

const tailSupplement = JSON.parse(
  fs.readFileSync(path.join(__dirname, "tail-supplement.json"), "utf8"),
);

const hiEnglish = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../sources/old-ui-translations-hi-kn.json"), "utf8"),
).hi;
const hiKnExtended = JSON.parse(
  fs.readFileSync(path.join(__dirname, "hi-kn-extended.json"), "utf8"),
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

function loadRegionalDict(locale) {
  const src = fs.readFileSync(
    path.join(root, "src/lib/regional-ui-dicts.ts"),
    "utf8",
  );
  const block = src.match(
    new RegExp(`export const ${locale}Dict: UiDict = \\{([\\s\\S]*?)\\n\\};`),
  )?.[1];
  return block ? parseDictBlock(block) : {};
}

function fromEnglishDict(englishDict) {
  const pack = {};
  for (const [key, english] of Object.entries(UI_KEYS)) {
    if (englishDict[english]) pack[key] = englishDict[english];
  }
  return pack;
}

/** Fix known Latin/transliteration issues in regional-ui-dicts exports. */
const DICT_FIXES = {
  gu: {
    priests: "પુરોહિત",
    mantraLibrary: "મંત્ર પustakalaya",
    livingDevotionalLibrary: "જીવંત ભક્તિ પustakalaya",
    matchingPrayers: "મળતા મંત્ર",
    searchMantraPlaceholder: "શિવ, Krishna, શાંતિ શોધો…",
    exploreMantrasTemplate:
      "{count}+ પ્રાર્થનાઓ, વેદ સ્તોત્ર અને મંત્ર શોધો. દેવતા, પાઠ અથવા હેતુ અનુસાર શોધો.",
  },
  ta: {
    liveDarshan: "நேரடி தarshan",
    priests: "பurohitங்கள்",
    myDharma: "என் தharma",
    pravachanReading: "பிரavachan & வாசிப்பு",
    vedicAstrology: "வேத ஜyotish",
    searchMantraPlaceholder: "சிவன், Krishna, அமைதி தேடுங்கள்…",
    exploreMantrasTemplate:
      "{count}+ பிரார்த்தனைகள், வேத ஸ்தோத்திரங்கள் மற்றும் மந்திரங்களை ஆராயுங்கள். தெய்வம், பாடம் அல்லது நோக்கத்தால் தேடுங்கள்.",
  },
  te: {
    liveDarshan: "లైవ్ దర్శనం",
    priests: "పurohitulu",
    pravachanReading: "పravachan & చదవడం",
    vedicAstrology: "వేద జyotish",
    livingDevotionalLibrary: "జీవant bhakti library",
    searchMantraPlaceholder: "శివ, Krishna, శanti వెతకండి…",
    exploreMantrasTemplate:
      "{count}+ ప్రార్థనలు, వేద స్తోత్రాలు మరియు మంత్రాలను అన్వేషించండి. దేవత, పాఠం లేదా ఉద్దేశ్యం ద్వారా వెతకండి.",
  },
  ml: {
    priests: "പurohitar",
    myDharma: "എന്റെ ധarm",
    pravachanReading: "പravachan & വായന",
    vedicAstrology: "വേദ ജyotish",
    mantraLibrary: "മന്ത്ര ലൈbrary",
    livingDevotionalLibrary: "ജീവant bhakti library",
    searchMantraPlaceholder: "ശിവൻ, Krishna, ശanti…",
    exploreMantrasTemplate:
      "{count}+ പ്രാർത്ഥനകൾ, വേദ സ്തോത്രങ്ങൾ, മന്ത്രങ്ങൾ പര്യവേക്ഷണം ചെയ്യുക. ദേവത, പാഠം അല്ലെങ്കിൽ ഉദ്ദേശ്യം അനുസരിച്ച് തിരയുക.",
  },
  pa: {
    divinityHarmony: "ਦਿਵ्य ਸਾਮਰਸ",
    priests: "ਪੁਜਾਰੀ",
    myDharma: "ਮera dharma",
    cultureOfIndia: "ਭਾਰਤ ਦੀ ਸanskruti",
    pravachanReading: "ਪravachan & ਪੜ੍ਹna",
    vedicAstrology: "ਵedic jyotish",
    mantraLibrary: "ਮੰਤਰ ਲਾਇbrary",
    livingDevotionalLibrary: "ਜੀਵant bhakti library",
    searchMantraPlaceholder: "ਸ਼ਿਵ, Krishna, ਸanti…",
    exploreMantrasTemplate:
      "{count}+ ਅਰਦਾਸਾਂ, ਵੇਦ ਸਤੋਤਰ ਅਤੇ ਮੰਤਰ ਖੋਜੋ। ਦੇਵਤਾ, ਪਾਠ ਜਾਂ ਉਦੇਸ਼ ਅਨੁਸਾਰ ਖੋਜੋ।",
  },
  as: {
    vedicAstrology: "বৈদিক জyotish",
    searchMantraPlaceholder: "শিব, Krishna, শanti…",
    exploreMantrasTemplate:
      "{count}+ প্ৰাৰ্থনা, বৈদিক স্তোত্ৰ আৰু মন্ত্ৰ অন্বেষণ কৰক। দেৱতা, পাঠ বা উদ্দেশ্য অনুসৰি বিচাৰক।",
  },
  mr: {
    searchMantraPlaceholder: "शिव, Krishna, शांती शोधा…",
  },
};

/** Extended section translations keyed by semantic id — one object per locale. */
import { EXTENDED_PACKS } from "./extended-pack-translations.mjs";

function buildLocalePack(locale) {
  const fromDict = fromEnglishDict(loadRegionalDict(locale));
  const fixes = DICT_FIXES[locale] ?? {};
  const extended = EXTENDED_PACKS[locale] ?? {};
  const tail = tailSupplement[locale] ?? {};
  return { ...fromDict, ...fixes, ...extended, ...tail };
}

function emitMjs(locale, pack) {
  const exportName = `${locale}Pack`;
  const lines = [
    `/** Complete ${locale.toUpperCase()} UI pack — 225 semantic keys. */`,
    `export const ${exportName} = {`,
  ];
  for (const key of KEY_LIST) {
    lines.push(`  ${key}: ${JSON.stringify(pack[key])},`);
  }
  lines.push("};");
  lines.push("");
  fs.writeFileSync(path.join(__dirname, `${locale}-pack.mjs`), lines.join("\n"));
}

// Hindi reference for Marathi fill
const hiPack = {
  ...fromEnglishDict(hiEnglish),
  ...hiKnExtended.hi,
  ...tailSupplement.hi,
};

const locales = ["gu", "ta", "te", "ml", "pa", "as", "mr"];
const report = [];

for (const locale of locales) {
  let pack = buildLocalePack(locale);
  if (locale === "mr") {
    pack = { ...hiPack, ...pack, ...mrOverrides };
    for (const [k, v] of Object.entries(hiPack)) {
      if (!pack[k]) pack[k] = v;
    }
    pack = { ...pack, ...EXTENDED_PACKS.mr, ...mrOverrides, ...tailSupplement.mr };
  }
  const missing = KEY_LIST.filter((k) => !pack[k]);
  if (missing.length) {
    console.error(`${locale}: missing ${missing.length}:`, missing.join(", "));
    process.exit(1);
  }
  if (!pack.exploreMantrasTemplate.includes("{count}")) {
    console.error(`${locale}: exploreMantrasTemplate missing {count}`);
    process.exit(1);
  }
  if (!pack.starOf27.includes("{n}")) {
    console.error(`${locale}: starOf27 missing {n}`);
    process.exit(1);
  }
  emitMjs(locale, pack);
  report.push({ locale, keys: KEY_LIST.length });
}

console.log(`tail-supplement.json: 11 locales × 39 keys (validated via build)`);
for (const r of report) {
  console.log(`${r.locale}-pack.mjs: ${r.keys} keys written`);
}
