/**
 * Builds native-fix-data.json for te/ml/pa/ta (225 keys, pure native script).
 * Run: node scripts/packs/build-all-native-packs.mjs && node scripts/packs/emit-native-packs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { te186 } from "./locales/te186.mjs";
import { ml186 } from "./locales/ml186.mjs";
import { pa186 } from "./locales/pa186.mjs";
import { ta186 } from "./locales/ta186.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tailSupplement = JSON.parse(
  fs.readFileSync(path.join(__dirname, "tail-supplement.json"), "utf8"),
);

/** Auth + early-key fixes — gu/mr/kn semantic reference, native script only. */
const AUTH = {
  te: {
    livingDevotionalLibrary: "జీవంత భక్తి గ్రంథాలయం",
    aartiClosingPrayer: "ఆరతి మరియు ముగింపు ప్రార్థన",
    livingTraditions: "జీవంత సంప్రదాయాలు",
    dharmicReadingRoom: "ధార్మిక చదవడం గది",
    playRecording: "ధ్వనిముద్రణం నడపండి",
    publicDirectory: "ప్రజా నిర్దేశిక",
    saveMyDharma: "నా ధర్మం భద్రపరచండి",
    noFamilyDatesSaved:
      "ఇంకా కుటుంబ తేదీలు భద్రపరచలేదు. డేటా ఈ బ్రౌజర్‌లో ఉంటుంది.",
    digitalJapaMala: "డిజిటల్ జప మాల",
    ganeshaInvocation: "గణేశ ఆవాహన",
    searchMantraPlaceholder: "శివ, Krishna, శాంతి…",
    newsletterTagline: "అప్పుడప్పుడు ఆలోచనాపూర్వక సందేశం",
    newsletterDesc:
      "కొత్త మంత్రాలు, పవిత్ర గ్రంథ జోడింపులు మరియు ఉపయోగకరమైన పండుగ మార్గదర్శకత్వం—రోజువారీ గందరగోళం లేకుండా.",
    subscribeAgreement:
      "ఇమెయిల్ నవీకరణలు స్వీకరించడానికి అంగీకరిస్తున్నాను. ఏ సందేశం నుండైనా చందాను రద్దు చేయవచ్చు.",
    footerTagline:
      "మంత్ర సాధన, దేవాలయ దర్శనం, హిందూ పవిత్ర సాహిత్యం మరియు రోజువారీ భక్తి అభ్యాసానికి ప్రశాంత డిజిటల్ స్థలం.",
    footerDisclaimer:
      "విద్యా భక్తి కంటెంట్ · ముహూర్తం మరియు ఔపచారిక సంస్కారాలను అర్హ ప్రాంతీయ మూలంతో ధృవీకరించండి.",
    heroSubtitle: "మీ రోజువారీ పవిత్ర ప్రయాణam",
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
  },
};

function mergePack(base, auth, tail) {
  return { ...base, ...auth, ...tail };
}

const tailFixes = {
  te: { templePriestDirectory: "దేవాలయ మరియు పురోహిత నిర్దేశిక" },
  ml: { templePriestDirectory: "ക്ഷേത്രവും പുരോഹിത നിര്‍ദ്ദേശിക" },
  pa: {},
  ta: {
    noNoiseMenus:
      "చத்தం లేదు, సంక్లిష్ట మెనూలు లేవు—వినడం, దర్శనం మరియు శాశ్వత జ్ఞానానికి నేరుగా మార్గం.",
  },
};

const data = {
  te: mergePack(te186, AUTH.te, { ...tailSupplement.te, ...tailFixes.te }),
  ml: mergePack(ml186, {}, { ...tailSupplement.ml, ...tailFixes.ml }),
  pa: mergePack(pa186, {}, tailSupplement.pa),
  ta: mergePack(ta186, {}, { ...tailSupplement.ta, ...tailFixes.ta }),
};

fs.writeFileSync(
  path.join(__dirname, "native-fix-data.json"),
  JSON.stringify(data, null, 2) + "\n",
);

console.log("Wrote native-fix-data.json for te/ml/pa/ta");
