/**
 * Patches te/ml/pa/ta packs with full native-script values (225 keys each).
 * Run: node scripts/packs/fix-native-packs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { guPack } from "./gu-pack.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KEYS = Object.keys(guPack);

async function loadLocale(code) {
  const mod = await import(pathToFileURL(path.join(__dirname, `${code}-pack.mjs`)).href);
  const pack = mod[`${code}Pack`];
  return pack;
}

/** Keys 147–188 and a few stragglers — native fixes per locale. */
const PATCHES = {
  te: {
    subscribeAgreement:
      "ఇమెయిల్ నవీకరణలు స్వీకరించడానికి అంగీకరిస్తున్నాను. ఏ సందేశam నుండైనా చందాను రద్దు చేయవచ్చు.",
    heroSubtitle: "మీ రోజువారీ పవిత్ర ప్రయాణam కోసం ప్రశాంత స్థలం.",
    heroDescription:
      "శాశ్వత మంత్రాలు వినండి, లైవ్ దేవాలయ దర్శనam అనుభవించండi, హిందూ శాస్త్రాలను ఒక అందమైన అనుసంధానit ఆశ్రయamలో అభ్యasinchandi.",
    todaysIntention: "నేటి సankalpa",
    peaceInEveryBreath: "ప్రతి శ్వాసlo శanti",
    readWisdom: "జ్ఞానam చదవండి",
    chooseSoundDarshan:
      "ధ్వani, darshan లేదా scripture ఎంచukondi—prati anubhavam respond avutundi, update avutundi mariyu mee tho velutundi.",
    readReflect: "చదవandi alochinchandi",
    designedAroundYou: "mee kosam design",
    listenReadReflect: "vinandi · chadivandi · alochinchandi",
    fastDiscovery: "vega discovery",
    sanskritAndEnglish: "sanskrutamu mariyu inglish",
    morningPractice: "udayam sadhana",
    beginWithGayatri: "Gayatri tho prarambhinchandi",
    enterTheTemple: "devaalayamlo praveshinchandi",
    exploreTheGita: "Gita anveshinchandi",
    backToDivinityHarmony: "Divinity Harmony ki tirigi",
    practiceRemembered: "mee sadhana, surakshitamga gurtunchabadutundi.",
    profileAcrossDevices:
      "mee profile, avatar mariyu aadhyatmika preferences devices lo connect chesi unchandi.",
    authPoweredBy: "pramanikaranam mariyu file storage Supabase dwara",
    authConfiguring: "khaataa seva configure avutondi",
    guestAccessAvailable:
      "atithi access available. login enable cheyadaniki Supabase deployment variables add cheyandi.",
    signInWithEmail: "mee khaataa kosam upayoginchina email tho sign in cheyandi.",
    email: "email",
    password: "password",
    forgotPassword: "password marchipoyara?",
    createYourAccount: "mee khaataa srushtinchandi",
    profileFollowsDevices: "mee profile anni devices lo mee tho untundi.",
    minEightChars: "minimum 8 aksharalu.",
    emailConfirmationNote: "mee Supabase project dwara email confirmation avasaram avachu.",
    templePriestDirectory: "దేవాలయ మరియు పurohit సూచిక",
  },
};

console.log("Use full pack rewrites — patch map incomplete");
process.exit(1);
