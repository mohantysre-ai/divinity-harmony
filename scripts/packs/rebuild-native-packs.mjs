/**
 * Rebuilds te/ml/pa/ta (225 keys) + minor bn/mr/as fixes from quality references.
 * Run: node scripts/packs/rebuild-native-packs.mjs
 */
import fs from "node:fs";
import path from "node:node:path";
import { fileURLToPath } from "node:url";
import { guPack } from "./gu-pack.mjs";
import { mrPack } from "./mr-pack.mjs";
import { tePack as teBase } from "./te-pack.mjs";
import { mlPack as mlBase } from "./ml-pack.mjs";
import { paPack as paBase } from "./pa-pack.mjs";
import { taPack as taBase } from "./ta-pack.mjs";
import { bnPack as bnBase } from "./bn-pack.mjs";
import { asPack as asBase } from "./as-pack.mjs";

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

/** Auth + hero tail (keys 147–188) — native script from gu/mr semantic reference. */
const teTail = {
  subscribeAgreement:
    "ఇమెయిల్ నవీకరణలు స్వీకరించడానికి అంగీకరిస్తున్నాను. ఏ సందేశం నుండైనా చందాను రద్దు చేయవచ్చు.",
  heroSubtitle: "మీ రోజువారీ పవిత్ర ప్రయాణam కోసం ప్రశాంత స్థలం.",
  heroDescription:
    "శాశ్వత మంత్రాలు వినండి, లైవ్ దేవాలయ దర్శనam అనుభవించండi, మరియు హిందూ శాస్త్రాల అభ్యasamam ఒక అందమైన అనుసంధానit ఆశ్రయamలో చేయండi.",
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
};
