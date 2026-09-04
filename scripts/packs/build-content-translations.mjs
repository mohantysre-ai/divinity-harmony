/**
 * Build content-translations-or.json and content-translations-hi.json
 * from extracted English strings using Google Translate + Sanskrit term fixes.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Sanscript from "@indic-transliteration/sanscript";
import translate from "google-translate-api-x";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const stringsPath = path.join(__dirname, "content-strings-en.json");
const englishStrings = JSON.parse(fs.readFileSync(stringsPath, "utf8"));

const scriptSchemes = {
  hi: "devanagari",
  bn: "bengali",
  gu: "gujarati",
  mr: "devanagari",
  ta: "tamil",
  te: "telugu",
  ml: "malayalam",
  kn: "kannada",
  or: "oriya",
  pa: "gurmukhi",
  as: "bengali",
};

function nativeScriptFallback(text, locale) {
  const scheme = scriptSchemes[locale];
  if (!scheme) return text;
  return text
    .split(/(\$\{[^}]+\})/g)
    .map((part) =>
      part.startsWith("${")
        ? part
        : part.replace(/[A-Za-z]+(?:[’'-][A-Za-z]+)*/g, (word) =>
            Sanscript.t(word.toLowerCase(), "itrans", scheme),
          ),
    )
    .join("");
}

function normalizeTargetScript(text, locale) {
  let out = nativeScriptFallback(text, locale);
  // Earlier Gujarati/Punjabi generation reused a Sanskrit glossary written in
  // Devanagari. Convert those inherited terms into the selected local script.
  if (locale === "gu" || locale === "pa") {
    out = out.replace(/[\u0900-\u097F]+/g, (part) =>
      Sanscript.t(part, "devanagari", scriptSchemes[locale]),
    );
  }
  return out;
}

function normalizeResultScripts(result, locale) {
  let changed = false;
  for (const [key, value] of Object.entries(result)) {
    const next = normalizeTargetScript(value, locale);
    if (next !== value) {
      result[key] = next;
      changed = true;
    }
  }
  return changed;
}

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
function stripLatin(text, locale) {
  if (!["hi", "or", "mr", "gu", "pa"].includes(locale)) return text;
  // Allow ${placeholders}, numbers, punctuation, and target script
  const odiaRange = /[\u0B00-\u0B7F]/;
  const devaRange = /[\u0900-\u097F]/;
  const isTarget = locale === "or" ? odiaRange : devaRange;
  void isTarget;

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
  for (const [from, to] of Object.entries(commonFixes[locale === "or" ? "or" : "hi"] || {})) {
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
  const outPath = path.join(__dirname, outFile);
  let result = {};
  if (fs.existsSync(outPath) && process.env.FORCE_CONTENT !== "1") {
    try {
      result = JSON.parse(fs.readFileSync(outPath, "utf8"));
    } catch {
      result = {};
    }
  }
  const missing = englishStrings.filter(
    (text) =>
      !Object.hasOwn(result, text) ||
      (result[text] === text && /[A-Za-z]{4}/.test(text)),
  );
  if (!missing.length) {
    const normalized = normalizeResultScripts(result, locale);
    if (normalized) {
      fs.writeFileSync(outPath, JSON.stringify(result, null, 2), "utf8");
    }
    return {
      path: outPath,
      count: Object.keys(result).length,
      skipped: true,
      normalized,
    };
  }
  const batchSize = 40;
  let done = 0;

  for (let i = 0; i < missing.length; i += batchSize) {
    const batch = missing.slice(i, i + batchSize);
    const translated = await translateBatch(batch, locale);
    for (let j = 0; j < batch.length; j++) {
      const en = batch[j];
      let val = translated[j];
      val = applySanskritFixes(val, glossary);
      val = stripLatin(val, locale);
      // Translation services commonly preserve proper nouns and Sanskrit terms
      // in Latin script. Regional mode must still render those in local script.
      if (val === en && /[A-Za-z]/.test(en)) val = nativeScriptFallback(en, locale);
      result[en] = val;
    }
    done += batch.length;
    process.stdout.write(`\r${locale}: ${done}/${missing.length} missing strings`);
    await sleep(300);
  }
  console.log();

  normalizeResultScripts(result, locale);
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), "utf8");
  return { path: outPath, count: Object.keys(result).length };
}

const LOCALE_CONFIG = {
  hi: { glossary: sanskritHi, file: "content-translations-hi.json" },
  or: { glossary: sanskritOr, file: "content-translations-or.json" },
  bn: { glossary: {}, file: "content-translations-bn.json" },
  gu: { glossary: sanskritHi, file: "content-translations-gu.json" },
  mr: { glossary: sanskritHi, file: "content-translations-mr.json" },
  ta: { glossary: {}, file: "content-translations-ta.json" },
  te: { glossary: {}, file: "content-translations-te.json" },
  ml: { glossary: {}, file: "content-translations-ml.json" },
  kn: { glossary: {}, file: "content-translations-kn.json" },
  pa: { glossary: sanskritHi, file: "content-translations-pa.json" },
  as: { glossary: {}, file: "content-translations-as.json" },
};

const argLocales = process.argv.slice(2).filter((x) => x in LOCALE_CONFIG);
const toBuild =
  argLocales.length > 0
    ? argLocales
    : Object.keys(LOCALE_CONFIG);

console.log(`Translating ${englishStrings.length} strings for: ${toBuild.join(", ")}`);
const results = {};

for (const locale of toBuild) {
  const cfg = LOCALE_CONFIG[locale];
  const outPath = path.join(__dirname, cfg.file);
  results[locale] = await buildLocale(locale, cfg.glossary, cfg.file);
}

console.log(JSON.stringify(results, null, 2));
