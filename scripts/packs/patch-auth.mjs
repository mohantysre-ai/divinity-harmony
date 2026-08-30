/**
 * Patches auth/early keys with pure native script for te/ml/pa/ta.
 * Run: node scripts/packs/patch-auth.mjs
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

/** Shared auth keys 147–188 — gu/mr/kn semantic, native script only. */
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
      "శాశ్వత మంత్రాలు వినండi, లైవ్ దేవాలయ దర్శనam",
    todaysIntention: "నేటి సankalpa",
  },
};
