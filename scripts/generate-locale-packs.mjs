/**
 * Generates src/lib/locale-packs/*.ts from embedded translation data.
 * Run: node scripts/generate-locale-packs.mjs
 */
import fs from "node:fs";
import path from "node:path";

const outDir = path.join("src", "lib", "locale-packs");
fs.mkdirSync(outDir, { recursive: true });

const keys = [
  "divinityHarmony",
  "home",
  "mantras",
  "liveDarshan",
  "scriptures",
  "deities",
  "temples",
  "priests",
  "explore",
  "login",
  "settings",
  "language",
  "english",
  "applicationLanguage",
  "elderMode",
  "myDharma",
  "cultureOfIndia",
  "pravachanReading",
  "vedicAstrology",
  "mantraLibrary",
  "sacredMantras",
  "livingDevotionalLibrary",
  "noMantraFound",
  "searchContactDetails",
  "findNearMe",
  "googleMaps",
  "publicDirectory",
  "todaysPractice",
  "myTraditionProfile",
  "currentState",
  "homeStateTradition",
  "preferredLanguage",
  "calendarTradition",
  "saveMyDharma",
  "familyRitualReminders",
  "noFamilyDatesSaved",
  "lightTheLamp",
  "ganeshaInvocation",
  "ishtaDevataMantra",
  "oneScriptureVerse",
  "japaPractice",
  "aartiClosingPrayer",
  "observances",
  "livingTraditions",
  "pravachanGuide",
  "dharmicReadingRoom",
  "officialSources",
  "publisherDirect",
  "vedicAstrologyCentre",
  "privateBirthDetails",
  "dateOfBirth",
  "exactBirthTime",
  "birthPlace",
  "savePrivatelyOnDevice",
  "coreCalculationVocabulary",
  "navagrahaStudyMap",
  "searchYouTube",
  "playRecording",
  "devotionalAudio",
  "searchMantraLibrary",
  "all",
  "translationLabel",
  "explainThisMantra",
  "meaningAndContext",
  "favoriteMantra",
  "newsletterEmail",
  "subscribe",
  "privacyPolicy",
  "termsOfUse",
  "accessibility",
  "trustAndSupport",
  "practice",
  "discover",
  "yourAccount",
  "userSettings",
  "profile",
  "preferences",
  "account",
  "displayName",
  "darkTheme",
  "loggedOut",
  "loggedOutSuccess",
  "threeLivingPaths",
  "yourSpiritualLibrary",
  "findWhatSpeaks",
  "chooseTheMoment",
  "sacredRhythmEveryDay",
  "liveTempleDarshan",
  "welcomeBack",
  "createAccount",
  "signIn",
  "continueAsGuest",
  "matchingPrayers",
  "searchMantraPlaceholder",
  "exploreMantrasTemplate",
  "logout",
  "myAccount",
  "signedIn",
  "toggleTheme",
  "devotee",
  "appLanguage",
  "appLanguageHint",
  "saveProfile",
  "signOut",
  "signInOrCreate",
  "guestPreferences",
  "appearanceAndPlayback",
  "autoplayMedia",
  "notifications",
  "accountSecurity",
  "gotraOptional",
  "yourNamePlaceholder",
  "enterIfKnown",
  "ishtaKulaDevata",
  "chooseFamilyCalendar",
  "signatureObservances",
  "traditionsAndTemples",
  "selectStateOrUt",
  "add",
  "deleteReminder",
  "personalSpiritualHome",
  "completedOnDevice",
  "returnToHome",
  "pageNotFound",
  "backHome",
  "beginWithMantra",
  "watchLiveDarshan",
  "openLibrary",
  "todaysPanchang",
  "dailyCalendar",
  "useMyLocation",
  "liveNow",
  "refreshLiveStatus",
  "sacredTextsHeritage",
  "readFullDetails",
  "priestSearch",
  "digitalJapaMala",
  "reset",
  "closeFullImage",
  "mantraScript",
  "useRegionalScript",
  "explaining",
  "listenWithContext",
  "pravachanCulturalReading",
  "newsletterTagline",
  "newsletterDesc",
  "emailAddressPlaceholder",
  "subscribeAgreement",
  "footerTagline",
  "supportTheProject",
  "footerDisclaimer",
  "heroSubtitle",
  "heroDescription",
  "sacredWisdomLiving",
  "resources700",
  "liveTempleDiscovery",
  "todaysIntention",
  "peaceInEveryBreath",
  "readWisdom",
  "chooseSoundDarshan",
  "startListening",
  "watchDarshan",
  "readReflect",
  "sacredTexts",
  "designedAroundYou",
  "listenReadReflect",
  "fastDiscovery",
  "sanskritAndEnglish",
  "morningPractice",
  "beginWithGayatri",
  "enterTheTemple",
  "exploreTheGita",
  "backToDivinityHarmony",
  "practiceRemembered",
  "profileAcrossDevices",
  "authPoweredBy",
  "authConfiguring",
  "guestAccessAvailable",
  "signInWithEmail",
  "email",
  "password",
  "forgotPassword",
  "createYourAccount",
  "profileFollowsDevices",
  "minEightChars",
  "emailConfirmationNote",
];

/** @type {Record<string, Record<string, string>>} */
const packs = JSON.parse(
  fs.readFileSync("scripts/locale-pack-data.json", "utf8"),
);

for (const [locale, pack] of Object.entries(packs)) {
  const missing = keys.filter((k) => !pack[k]);
  if (missing.length) {
    console.error(`Locale ${locale} missing ${missing.length} keys:`, missing.slice(0, 5));
    process.exit(1);
  }
  const lines = keys.map((k) => `  ${k}: ${JSON.stringify(pack[k])},`);
  const content = `import type { UiLocalePack } from "@/lib/ui-keys";

export const ${locale}Pack = {
${lines.join("\n")}
} satisfies UiLocalePack;
`;
  fs.writeFileSync(path.join(outDir, `${locale}.ts`), content);
  console.log(`Wrote ${locale}.ts (${keys.length} keys)`);
}

const index = `import type { UiLocale, UiLocalePack } from "@/lib/ui-keys";
${Object.keys(packs)
  .map((l) => `import { ${l}Pack } from "./${l}";`)
  .join("\n")}

export const localePacks: Record<UiLocale, UiLocalePack> = {
${Object.keys(packs)
  .map((l) => `  ${l}: ${l}Pack,`)
  .join("\n")}
};
`;

fs.writeFileSync(path.join(outDir, "index.ts"), index);
console.log("Done.");
