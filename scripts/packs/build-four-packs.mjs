/**
 * Builds ta, te, ml, pa packs (186 keys) from locale sources + native overrides.
 * Run: node scripts/packs/build-four-packs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bnPack } from "./bn-pack.mjs";
import { ta186 } from "./locales/ta186.mjs";
import { te186 } from "./locales/te186.mjs";
import { hiEn } from "./hi-kn-en.mjs";
import { knEn } from "./hi-kn-en.mjs";
import { hiExtra } from "./hi-kn-extra.mjs";
import { knExtra } from "./hi-kn-extra.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../..");
const KEYS = Object.keys(bnPack);
const UI_KEYS = JSON.parse(
  fs.readFileSync(path.join(root, "src/lib/ui-keys-export.json"), "utf8"),
);

function fromEnglishDict(enDict) {
  const pack = {};
  for (const [key, english] of Object.entries(UI_KEYS)) {
    if (enDict[english]) pack[key] = enDict[english];
  }
  return pack;
}

/** @param {string} locale @param {Record<string,string>} data @param {string} label */
function emit(locale, data, label) {
  const missing = KEYS.filter((k) => !data[k]);
  if (missing.length) throw new Error(`${locale} missing: ${missing.join(", ")}`);
  if (!data.exploreMantrasTemplate.includes("{count}")) {
    throw new Error(`${locale} exploreMantrasTemplate missing {count}`);
  }
  const lines = [
    `/** Complete ${label} UI pack — 186 semantic keys. */`,
    `export const ${locale}Pack = {`,
  ];
  for (const key of KEYS) {
    lines.push(`  ${key}: ${JSON.stringify(data[key])},`);
  }
  lines.push("};", "");
  fs.writeFileSync(path.join(__dirname, `${locale}-pack.mjs`), lines.join("\n"));
  console.log(`${locale}-pack.mjs: ${KEYS.length} keys`);
}

const taOverrides = {
  pravachanReading: "பிரவசனமும் வாசிப்பும்",
  ganeshaInvocation: "விநாயகர் அழைப்பு",
  dharmicReadingRoom: "தarmic வாசிப்பு அறை",
  digitalJapaMala: "டிஜிட்டல் ஜap மala",
  newsletterTagline: "அவ்வப்போது ஒரு சிந்தனையுள்ள செய்தி",
  footerDisclaimer:
    "கல்வி பக்தி உள்ளடக்கம் · முகூர்த்தம் மற்றும் அதிகாரப்பூர்வ saṃskāram-களை தகுதியான பிராந்திய ஆதாரத்துடன் சரிபார்க்கவும்.",
  heroDescription:
    "காலatita மந்திரங்களைக் கேளுங்கள், நேரடி கோயில் தர்சனத்தை அனுபவியுங்கள், இந்தu saasthraangalai oru alagaaga inaikkappatta adaikkalathil padiyungal.",
  resources700: "700+ புனித ஆresources",
  chooseSoundDarshan:
    "ஒலி, தarsan அல்லது saasthiram therndhedungal—ovvoru anubhavamum padhiladikkirathu, puthuppikkirathu, ungaludan nagarkirathu.",
  watchDarshan: "தarsan paarkungal",
  profileAcrossDevices:
    "ungal siyavivaram, chinnam matrum aanmeega viruppangalai saadhanangalil inaikkavum.",
};

emit("ta", { ...ta186, ...taOverrides }, "Tamil");
