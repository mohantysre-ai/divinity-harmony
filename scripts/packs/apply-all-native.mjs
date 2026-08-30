/**
 * Applies native-script overrides to *-pack.mjs and writes locale-packs.json.
 * Run: node scripts/packs/apply-all-native.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { guPack } from "./gu-pack.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..", "..");
const KEYS = Object.keys(guPack);

/** @type {Record<string, Record<string, string>>} */
const OVERRIDES = {
  te: {
    subscribeAgreement:
      "ఇమెయిల్ నవీకరణలు స్వీకరించడానికి అంగీకరిస్తున్నాను. ఏ సందేశam నుండైనా చందాను రద్దు చేయవచ్చు.",
    heroSubtitle: "మీ రోజువారీ పవిత్ర ప్రయాణam కోసం ప్రశాంత స్థలం.",
    heroDescription:
      "శాశ్వత మంత్రాలు వినండి, లైవ్ దేవాలయ దర్శనam అనుభవించండi, మరియు హిందూ శాస్త్రాలను ఒక అందమైన అనుసంధానit ఆశ్రయamలో అభ్యasinchandi.",
    todaysIntention: "నేటి సankalpa",
    peaceInEveryBreath: "ప్రతి శ్వాసam lo శanti",
    readWisdom: "జ్ఞానam చadavandi",
    chooseSoundDarshan:
      "ధ్వni, దర్శనam లేదా శాస్త్రam ఎంచukondi—prati anubhavam pratispandinchutundi, navinistundi mariyu mee tho velutundi.",
    readReflect: "చadivandi mariyu alochaninchandi",
    designedAroundYou: "మీ కోసam డిజైన్",
    listenReadReflect: "వinandi · చadivandi · alochaninchandi",
    fastDiscovery: "వేగవant అన్వేషణ",
    sanskritAndEnglish: "సంస్కృతam మరియు ఇంగ్లీష్",
    morningPractice: "ఉదయam సాధన",
    beginWithGayatri: "Gayatri tho ప్రarambhinchandi",
    enterTheTemple: "దేవaalayam lo ప్రaveshinchandi",
    exploreTheGita: "Gita anveshinchandi",
    backToDivinityHarmony: "Divinity Harmony ki tirigi",
    practiceRemembered: "మీ సాధన, surakshitam ga gurtunchabadutundi.",
    profileAcrossDevices:
      "మీ profile, avatar mariyu aadhyatmika preferences devices lo connect chesi unchandi.",
    authPoweredBy: "pramanikaranam mariyu file storage Supabase dwara",
    authConfiguring: "ఖata seva configure avutondi",
    guestAccessAvailable:
      "atithi access available. login enable cheyadaniki Supabase deployment variables add cheyandi.",
    signInWithEmail: "మీ khaata kosam upayoginchina email tho sign in cheyandi.",
    email: "ఇమెయిల్",
    password: "పాస్‌వర్డ్",
    forgotPassword: "పాస్‌వర్డ్ మarchipoyara?",
    createYourAccount: "మీ khaata srushtinchandi",
    profileFollowsDevices: "మీ profile anni devices lo mee tho untundi.",
    minEightChars: "minimum 8 aksharalu.",
    emailConfirmationNote: "మీ Supabase project dwara email confirmation avasaram avachu.",
    templePriestDirectory: "దేవాలయ మరియు పurohit సూచిక",
    newsletterTagline: "అప్పుడappudu oka aalochanapoorvaka sandesam",
    saveProfile: "ప్రొఫైల్ భద్రపరచండి",
  },
};

function escape(str) {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

async function writePack(code, exportName, label) {
  const mod = await import(
    pathToFileURL(path.join(__dirname, `${code}-pack.mjs`)).href
  );
  const pack = { ...mod[`${exportName}`], ...OVERRIDES[code] };
  const missing = KEYS.filter((k) => !(k in pack));
  if (missing.length) throw new Error(`${code} missing: ${missing.join(", ")}`);
  const lines = KEYS.map((k) => `  ${k}: "${escape(pack[k])}",`);
  const body = `/** Complete ${label} UI pack — 225 semantic keys. */
export const ${exportName} = {
${lines.join("\n")}
};
`;
  fs.writeFileSync(path.join(__dirname, `${code}-pack.mjs`), body, "utf8");
  console.log(`Updated ${code}-pack.mjs`);
}

for (const { code, export: exportName, label } of [
  { code: "te", export: "tePack", label: "Telugu" },
]) {
  if (OVERRIDES[code]) await writePack(code, exportName, label);
}

console.log("Done partial — extend OVERRIDES for ml/pa/ta");
