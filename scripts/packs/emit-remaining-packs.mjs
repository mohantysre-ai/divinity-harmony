/**
 * Emits ta, te, ml, pa pack modules with 186 native-script keys each.
 * Run: node scripts/packs/emit-remaining-packs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bnPack } from "./bn-pack.mjs";
import { ta186 } from "./locales/ta186.mjs";
import { te186 } from "./locales/te186.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KEYS = Object.keys(bnPack);

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

const ta = {
  ...ta186,
  pravachanReading: "பிரவசனமும் வாசிப்பும்",
  ganeshaInvocation: "விநாயகர் அழைப்பு",
  dharmicReadingRoom: "தarmic வாசிப்பு அறை",
  digitalJapaMala: "டிஜிட்டல் ஜap மala",
  newsletterTagline: "அவ்வப்போது ஒரு சிந்தனையுள்ள செய்தி",
  footerDisclaimer:
    "கல்வி பக்தி உள்ளடக்கம் · முகூர்த்தம் மற்றும் அதிகாரப்பூர்வ சamskāram-க்கு ஏற்ற பிராந்திய ஆதாரத்துடன் சரிபார்க்கவும்.",
  heroDescription:
    "காலatita மந்திரங்களைக் கேளுங்கள், நேரடி கோயில் தர்சனத்தை அனுபவியுங்கள், இந்து scriptures ஒரு அழகாக இணைக்கப்பட்ட அடைக்கலத்தில் படியுங்கள்.",
  resources700: "700+ புனித ஆresources",
  chooseSoundDarshan:
    "ஒலி, தarshan அல்லது scripture தேர்ந்தெடுங்கள்—ஒவ்வொரு அனுபவமும் பதிலளிக்கிறது, புதுப்பிக்கிறது, உங்களுடன் நகர்கிறது.",
  watchDarshan: "தarshan பாருங்கள்",
  profileAcrossDevices:
    "உங்கள் சுயவிவரம், avatar மற்றும் ஆspiritual விருப்பங்களை சாதனங்களில் இணைக்கவும்.",
};

emit("ta", ta, "Tamil");
