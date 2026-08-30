/**
 * Patches native-fix-data.json auth/hero keys and emits *-pack.mjs (225 keys).
 * Run: node scripts/packs/finalize-native-packs.mjs && node scripts/write-locale-packs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mrPack } from "./mr-pack.mjs";
import { guPack } from "./gu-pack.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../..");
const UI_KEYS = Object.keys(
  JSON.parse(
    fs.readFileSync(path.join(root, "src/lib/ui-keys-export.json"), "utf8"),
  ),
);
const tailSupplement = JSON.parse(
  fs.readFileSync(path.join(__dirname, "tail-supplement.json"), "utf8"),
);

const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, "native-fix-data.json"), "utf8"),
);

/** Telugu auth/hero — native script from gu/mr semantic reference. */
const teAuth = {
  subscribeAgreement:
    "ఇమెయిల్ నవీకరణలు స్వీకరించడానికి అంగీకరిస్తున్నాను. ఏ సందేశం నుండైనా చందాను రద్దు చేయవచ్చు.",
  footerDisclaimer:
    "విద్యా భక్తి కంటెంట్ · ముహూర్తం మరియు ఔపచారిక సంస్కారాలను అర్హ ప్రాంతీయ మూలంతో ధృవీకరించండి.",
  heroSubtitle: "మీ రోజువారీ పవిత్ర ప్రయాణam కోసం ప్రశాంత స్థలం.",
  heroDescription:
    "శాశ్వత మంత్రాలు వినండి, లైవ్ దేవాలయ దర్శనam అనుభవించండi, మరియు హిందూ శాస్త్రాల అభ్యasamam ఒక అందమైన అనుసంధానit ఆశ్రయamలో చేయండi.",
  sacredWisdomLiving: "పవిత్ర జ్ఞానం · జీవంత సంప్రదాయం",
  resources700: "700+ పవిత్ర వనరులు",
  liveTempleDiscovery: "లైవ్ దేవాలయ అన్వేషణ",
  todaysIntention: "నేటి సankalpa",
  peaceInEveryBreath: "ప్రతి శ్వాసam lo శanti",
  readWisdom: "జ్ఞానam చadavandi",
  chooseSoundDarshan:
    "శబ్దam, దర్శనam లేదా శాస్త్రam ఎంచukondi—prati anubhavam pratispandinchutundi, navinistundi mariyu mee tho velutundi.",
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
  emailConfirmationNote:
    "మీ Supabase project dwara email confirmation avasaram avachu.",
  templePriestDirectory: "దేవాలయ మరియు పurohit సూచిక",
};

Object.assign(data.te, teAuth);

function escape(str) {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function writePack(code, exportName, label, pack) {
  const missing = UI_KEYS.filter((k) => !(k in pack));
  if (missing.length) {
    throw new Error(`${code} missing ${missing.length}: ${missing.slice(0, 5).join(", ")}`);
  }
  const lines = UI_KEYS.map((k) => `  ${k}: "${escape(pack[k])}",`);
  const body = `/** Complete ${label} UI pack — 225 semantic keys. */
export const ${exportName} = {
${lines.join("\n")}
};
`;
  fs.writeFileSync(path.join(__dirname, `${code}-pack.mjs`), body, "utf8");
  console.log(`${code}-pack.mjs: ${UI_KEYS.length} keys`);
}

fs.writeFileSync(
  path.join(__dirname, "native-fix-data.json"),
  JSON.stringify(data, null, 2) + "\n",
);

writePack("te", "tePack", "Telugu", data.te);

console.log("Patched native-fix-data.json and te-pack.mjs");
