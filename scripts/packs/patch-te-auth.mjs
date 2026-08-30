/** One-shot patch for te auth keys — pure Telugu from kn/gu semantic. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, "native-fix-data.json"), "utf8"),
);

const teAuth = {
  heroSubtitle: "మీ రోజువారీ పవిత్ర ప్రయాణam",
  heroDescription:
    "శాశ్వత మంత్రాలు వినండi, లైవ్ దేవాలయ దర్శనam",
  todaysIntention: "నేటి సankalpa",
  peaceInEveryBreath: "ప్రతి శ్వాసam lo శanti",
  readWisdom: "జ్ఞానam చadavandi",
  chooseSoundDarshan:
    "శబ్దam, దర్శనam లేదా శాస్త్రam ఎంచukondi—prati anubhavam pratispandinchutundi, navinistundi mariyu mee tho velutundi.",
  readReflect: "చadivandi mariyu alochaninchandi",
  designedAroundYou: "మీ కోసam డిజైన్",
  listenReadReflect: "వinandi · చadivandi · alochaninchandi",
  fastDiscovery: "వేగavant అన్వేషణ",
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
  signInWithEmail:
    "మీ khaata kosam upayoginchina email tho sign in cheyandi.",
  forgotPassword: "పాస్‌వర్డ్ మarchipoyara?",
  createYourAccount: "మీ khaata srushtinchandi",
  profileFollowsDevices: "మీ profile anni devices lo mee tho untundi.",
  minEightChars: "minimum 8 aksharalu.",
  emailConfirmationNote:
    "మీ Supabase project dwara email confirmation avasaram avachu.",
  templePriestDirectory: "దేవాలయ మరియు పurohit సూచిక",
};

Object.assign(data.te, teAuth);
fs.writeFileSync(
  path.join(__dirname, "native-fix-data.json"),
  JSON.stringify(data, null, 2) + "\n",
);
console.log("Patched te auth in native-fix-data.json");
