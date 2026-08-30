/**
 * Build content-translations-or.json and content-translations-hi.json
 * from extracted English strings using Google Translate + Sanskrit term fixes.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import translate from "google-translate-api-x";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const stringsPath = path.join(__dirname, "content-strings-en.json");
const englishStrings = JSON.parse(fs.readFileSync(stringsPath, "utf8"));

/** Preserve placeholders during translation */
function shieldPlaceholders(text) {
  const map = new Map();
  let i = 0;
  const shielded = text.replace(/\$\{[^}]+\}/g, (m) => {
    const key = `__PH${i++}__`;
    map.set(key, m);
    return key;
  });
  return { shielded, map };
}

function restorePlaceholders(text, map) {
  let out = text;
  for (const [key, val] of map) {
    out = out.split(key).join(val);
  }
  return out;
}

/** Sanskrit / proper-name terms to keep in Devanagari (Hindi) or Odia script */
const sanskritHi = {
  Shruti: "श्रुति",
  dharma: "धर्म",
  yajna: "यज्ञ",
  bhakti: "भक्ति",
  moksha: "मोक्ष",
  atman: "आत्मा",
  Brahman: "ब्रह्म",
  Om: "ॐ",
  guru: "गुरु",
  puja: "पूजा",
  mantra: "मंत्र",
  Vedas: "वेद",
  Upanishad: "उपनिषद",
  Purana: "पुराण",
  Gita: "गीता",
  yoga: "योग",
  samadhi: "समाधि",
  prana: "प्राण",
  Shiva: "शिव",
  Vishnu: "विष्णु",
  Krishna: "कृष्ण",
  Rama: "राम",
  Ganesha: "गणेश",
  Durga: "दुर्गा",
  Lakshmi: "लक्ष्मी",
  Saraswati: "सरस्वती",
  Hanuman: "हनुमान",
  Devi: "देवी",
  Shakti: "शक्ति",
  Agni: "अग्नि",
  Surya: "सूर्य",
  Rudra: "रुद्र",
  Narayana: "नारायण",
  Jagannath: "जगन्नाथ",
  muhurta: "मुहूर्त",
  prasada: "प्रसाद",
  aarti: "आरती",
  homa: "होम",
  sankalpa: "संकल्प",
  naivedya: "नैवेद्य",
  tarpana: "तर्पण",
  shraddha: "श्राद्ध",
  samskara: "संस्कार",
  gotra: "गोत्र",
  pitru: "पितृ",
  pitrs: "पितृ",
  rishi: "ऋषि",
  Vedanta: "वेदांत",
  Advaita: "अद्वैत",
  Vaishnava: "वैष्णव",
  Shaiva: "शैव",
  Shakta: "शाक्त",
  Mahapurana: "महापुराण",
};

const sanskritOr = {
  Shruti: "ଶ୍ରୁତି",
  dharma: "ଧର୍ମ",
  yajna: "ଯଜ୍ଞ",
  bhakti: "ଭକ୍ତି",
  moksha: "ମୋକ୍ଷ",
  atman: "ଆତ୍ମା",
  Brahman: "ବ୍ରହ୍ମ",
  Om: "ଓଁ",
  guru: "ଗୁରୁ",
  puja: "ପୂଜା",
  mantra: "ମନ୍ତ୍ର",
  Vedas: "ବେଦ",
  Upanishad: "ଉପନିଷଦ",
  Purana: "ପୁରାଣ",
  Gita: "ଗୀତା",
  yoga: "ଯୋଗ",
  samadhi: "ସମାଧି",
  prana: "ପ୍ରାଣ",
  Shiva: "ଶିବ",
  Vishnu: "ବିଷ୍ଣୁ",
  Krishna: "କୃଷ୍ଣ",
  Rama: "ରାମ",
  Ganesha: "ଗଣେଶ",
  Durga: "ଦୁର୍ଗା",
  Lakshmi: "ଲକ୍ଷ୍ମୀ",
  Saraswati: "ସରସ୍ୱତୀ",
  Hanuman: "ହନୁମାନ",
  Devi: "ଦେବୀ",
  Shakti: "ଶକ୍ତି",
  Agni: "ଅଗ୍ନି",
  Surya: "ସୂର୍ଯ୍ୟ",
  Rudra: "ରୁଦ୍ର",
  Narayana: "ନାରାୟଣ",
  Jagannath: "ଜଗନ୍ନାଥ",
  muhurta: "ମୁହୂର୍ତ",
  prasada: "ପ୍ରସାଦ",
  aarti: "ଆରତି",
  homa: "ହୋମ",
  sankalpa: "ସଙ୍କଳ୍ପ",
  naivedya: "ନୈବେଦ୍ୟ",
  tarpana: "ତର୍ପଣ",
  shraddha: "ଶ୍ରାଦ୍ଧ",
  samskara: "ସଂସ୍କାର",
  gotra: "ଗୋତ୍ର",
  pitru: "ପିତୃ",
  pitrs: "ପିତୃ",
  rishi: "ଋଷି",
  Vedanta: "ବେଦାନ୍ତ",
  Advaita: "ଅଦ୍ୱੈତ",
  Vaishnava: "ବୈଷ୍ଣବ",
  Shaiva: "ଶୈବ",
  Shakta: "ଶାକ୍ତ",
  Mahapurana: "ମହାପୁରାଣ",
};

function applySanskritFixes(text, glossary) {
  let out = text;
  // Sort by length descending to match longer terms first
  const entries = Object.entries(glossary).sort((a, b) => b[0].length - a[0].length);
  for (const [en, native] of entries) {
    const re = new RegExp(`\\b${en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    out = out.replace(re, native);
  }
  return out;
}

/** Remove stray Latin letters from translated text (keep Devanagari/Odia digits and punctuation) */
function stripLatin(text, script) {
  // Allow ${placeholders}, numbers, punctuation, and target script
  const odiaRange = /[\u0B00-\u0B7F]/;
  const devaRange = /[\u0900-\u097F]/;
  const isTarget = script === "or" ? odiaRange : devaRange;

  // Replace common untranslated English words that slipped through
  const commonFixes = {
    or: {
      " and ": " ଏବଂ ",
      " or ": " କିମ୍ବା ",
      " the ": " ",
      " of ": " ର ",
      " for ": " ପାଇଁ ",
      " with ": " ସହ ",
      " in ": " ରେ ",
      " to ": " କୁ ",
      " a ": " ",
      " an ": " ",
      " is ": " ",
      " are ": " ",
      " was ": " ",
      " were ": " ",
    },
    hi: {
      " and ": " और ",
      " or ": " या ",
      " the ": " ",
      " of ": " का ",
      " for ": " के लिए ",
      " with ": " के साथ ",
      " in ": " में ",
      " to ": " को ",
      " a ": " ",
      " an ": " ",
      " is ": " है ",
      " are ": " हैं ",
    },
  };

  let out = text;
  for (const [from, to] of Object.entries(commonFixes[script] || {})) {
    out = out.split(from).join(to);
  }
  return out;
}

async function translateBatch(texts, to) {
  const maps = [];
  const shielded = texts.map((t) => {
    const { shielded: s, map } = shieldPlaceholders(t);
    maps.push(map);
    return s;
  });
  try {
    const results = await translate(shielded, { from: "en", to, client: "gtx" });
    const arr = Array.isArray(results) ? results : [results];
    return arr.map((r, i) => restorePlaceholders(r?.text ?? texts[i], maps[i]));
  } catch (err) {
    console.error(`Batch translate error (${to}):`, err.message);
    const out = [];
    for (let i = 0; i < shielded.length; i++) {
      try {
        const r = await translate(shielded[i], { from: "en", to, client: "gtx" });
        out.push(restorePlaceholders(r.text, maps[i]));
      } catch {
        out.push(texts[i]);
      }
      await sleep(150);
    }
    return out;
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function buildLocale(locale, glossary, outFile) {
  const result = {};
  const batchSize = 40;
  let done = 0;

  for (let i = 0; i < englishStrings.length; i += batchSize) {
    const batch = englishStrings.slice(i, i + batchSize);
    const translated = await translateBatch(batch, locale);
    for (let j = 0; j < batch.length; j++) {
      const en = batch[j];
      let val = translated[j];
      val = applySanskritFixes(val, glossary);
      val = stripLatin(val, locale === "or" ? "or" : "hi");
      result[en] = val;
    }
    done += batch.length;
    process.stdout.write(`\r${locale}: ${done}/${englishStrings.length}`);
    await sleep(300);
  }
  console.log();

  const outPath = path.join(__dirname, outFile);
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), "utf8");
  return { path: outPath, count: Object.keys(result).length };
}

console.log(`Translating ${englishStrings.length} strings...`);
const orResult = await buildLocale("or", sanskritOr, "content-translations-or.json");
const hiResult = await buildLocale("hi", sanskritHi, "content-translations-hi.json");

console.log(JSON.stringify({ or: orResult, hi: hiResult }, null, 2));
