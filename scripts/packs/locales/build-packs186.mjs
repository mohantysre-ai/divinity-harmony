/**
 * Builds packs186.json for ta, te, ml, pa, as, mr and writes locale186.mjs files.
 * Run: node scripts/packs/locales/build-packs186.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { hiEn } from "../hi-kn-en.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../../..");

const UI_KEYS = JSON.parse(
  fs.readFileSync(path.join(root, "src/lib/ui-keys-export.json"), "utf8"),
);
const KEY186 = Object.keys(UI_KEYS).slice(0, 186);
const hiKnExtended = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../hi-kn-extended.json"), "utf8"),
);

function fromEnglishDict(englishDict) {
  const pack = {};
  for (const [key, english] of Object.entries(UI_KEYS)) {
    if (englishDict[english]) pack[key] = englishDict[english];
  }
  return pack;
}

const hi186 = { ...fromEnglishDict(hiEn), ...hiKnExtended.hi };

/** Marathi base derived from Hindi with Devanagari Marathi forms. */
const mr186 = {
  ...hi186,
  home: "मुख्यपृष्ठ",
  explore: "शोध",
  login: "लॉग इन",
  settings: "सेटिंग्ज",
  english: "इंग्रजी",
  applicationLanguage: "अॅपची भाषा",
  elderMode: "ज्येष्ठ मोड",
  myDharma: "माझा धर्म",
  cultureOfIndia: "भारताची संस्कृती",
  pravachanReading: "प्रवचन आणि वाचन",
  vedicAstrology: "वैदिक ज्योतिष",
  mantraLibrary: "मंत्र वाचनालय",
  livingDevotionalLibrary: "जिवंत भक्ती वाचनालय",
  noMantraFound: "मंत्र सापडला नाही. दुसरे नाव किंवा देवता वापरून पहा.",
  loggedOutSuccess: "तुम्ही यशस्वीरित्या लॉग आउट झाला.",
  welcomeBack: "पुन्हा स्वागत",
  createAccount: "खाते तयार करा",
  signIn: "साइन इन",
  continueAsGuest: "अतिथी म्हणून सुरू ठेवा",
  matchingPrayers: "जुळणारी प्रार्थना",
  searchMantraPlaceholder: "शिव, Krishna, शांती शोधा…",
  exploreMantrasTemplate:
    "{count}+ प्रार्थना, वैदिक स्तोत्रे आणि मंत्र शोधा. देवता, मजकूर किंवा हेतूनुसार शोधा.",
  logout: "लॉग आउट",
  myAccount: "माझे खाते",
  signedIn: "साइन इन केले",
  toggleTheme: "थीम बदला",
  appLanguage: "अॅपची भाषा",
  appLanguageHint: "मेनू आणि लेबल बदलते. मंत्राचा संस्कृत मजकूर जसा आहे तसाच राहतो.",
  saveProfile: "प्रोफाइल जतन करा",
  signOut: "साइन आउट",
  signInOrCreate: "साइन इन करा किंवा खाते तयार करा",
  guestPreferences: "अतिथी प्राधान्ये या ब्राउझरमध्ये राहतील.",
  yourNamePlaceholder: "तुमचे नाव",
  returnToHome: "मुख्यपृष्ठावर परत",
  pageNotFound: "अरेरे! पान सापडले नाही",
  backHome: "मुख्यपृष्ठावर",
  footerDisclaimer:
    "शैक्षणिक भक्ती सामग्री · मुहूर्त आणि औपचारिक संस्कार पात्र प्रादेशिक स्रोताकडून तपासा.",
  liveDarshan: "थेट दर्शन",
  temples: "मंदिरे",
  priests: "पुजारी",
};

// Import pre-built JSON for Dravidian/Eastern locales
const packs = JSON.parse(
  fs.readFileSync(path.join(__dirname, "packs186-body.json"), "utf8"),
);
packs.mr = mr186;

for (const locale of ["ta", "te", "ml", "pa", "as", "mr"]) {
  const data = packs[locale];
  const missing = KEY186.filter((k) => !data[k]);
  if (missing.length) {
    console.error(`${locale}: missing ${missing.length}:`, missing.slice(0, 8).join(", "));
    process.exit(1);
  }
  if (!data.exploreMantrasTemplate.includes("{count}")) {
    console.error(`${locale}: exploreMantrasTemplate missing {count}`);
    process.exit(1);
  }
  const lines = [
    `/** ${locale.toUpperCase()} base UI pack — 186 semantic keys (187–225 in tail-supplement.json). */`,
    `export const ${locale}186 = {`,
  ];
  for (const key of KEY186) {
    lines.push(`  ${key}: ${JSON.stringify(data[key])},`);
  }
  lines.push("};");
  lines.push("");
  fs.writeFileSync(path.join(__dirname, `${locale}186.mjs`), lines.join("\n"));
  console.log(`${locale}186.mjs: ${KEY186.length} keys written`);
}

fs.writeFileSync(
  path.join(__dirname, "packs186.json"),
  JSON.stringify(packs, null, 2) + "\n",
);
