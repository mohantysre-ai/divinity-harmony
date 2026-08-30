/**
 * Builds complete regional pack .mjs files (225 keys each) + validates tail-supplement.json.
 * Run: node scripts/packs/build-full-regional-packs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bnPack } from "./bn-pack.mjs";
import { mrOverrides } from "./mr-overrides.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../..");

const UI_KEYS = JSON.parse(
  fs.readFileSync(path.join(root, "src/lib/ui-keys-export.json"), "utf8"),
);
const KEY_LIST = Object.keys(UI_KEYS);
const TAIL_KEYS = KEY_LIST.slice(186);

const tailSupplement = JSON.parse(
  fs.readFileSync(path.join(__dirname, "tail-supplement.json"), "utf8"),
);

function parseDictBlock(block) {
  const dict = {};
  for (const m of block.matchAll(
    /(?:"((?:\\.|[^"\\])*)"|([A-Za-z]+))\s*:\s*"((?:\\.|[^"\\])*)",?/g,
  )) {
    dict[(m[1] || m[2]).replace(/\\"/g, '"')] = m[3].replace(/\\"/g, '"');
  }
  return dict;
}

function loadRegionalDict(locale) {
  const src = fs.readFileSync(
    path.join(root, "src/lib/regional-ui-dicts.ts"),
    "utf8",
  );
  const block = src.match(
    new RegExp(`export const ${locale}Dict: UiDict = \\{([\\s\\S]*?)\\n\\};`),
  )?.[1];
  return block ? parseDictBlock(block) : {};
}

function fromEnglishDict(englishDict) {
  const pack = {};
  for (const [key, english] of Object.entries(UI_KEYS)) {
    if (englishDict[english]) pack[key] = englishDict[english];
  }
  return pack;
}

/** Extended keys (98–186) — Odia supplement adapted per locale. */
const EXTENDED = {
  gu: {
    searchContactDetails: "વર્તમાન સંપર્ક વિગતો શોધો",
    findNearMe: "મારી નજીક શોધો",
    googleMaps: "ગૂગલ મેપ્સ",
    publicDirectory: "જાહેર નિર્દેશિકા",
    todaysPractice: "આજની સાધના",
    myTraditionProfile: "મારી પરંપરા પ્રોફાઇલ",
    currentState: "વર્તમાન રાજ્ય",
    homeStateTradition: "મૂળ રાજ્ય / સાંસ્કૃતિક પરંપરા",
    preferredLanguage: "પસંદગીની ભાષા",
    calendarTradition: "પંચાંગ પરંપરા",
    saveMyDharma: "મારો ધર્મ સાચવો",
    familyRitualReminders: "કુટુંબીય વિધિ અनुस्मારક",
    noFamilyDatesSaved:
      "હજુ સુધી કોઈ કુટુંબીય તારીખ સાચવેલ નથી. ડેટા આ બ્રાઉઝરમાં રહેશે.",
    lightTheLamp: "દીવો પ્રજ્વલિત કરો",
    ganeshaInvocation: "ગણેશ આવાહન",
    ishtaDevataMantra: "ઇષ્ટદેવતા મંત્ર",
    oneScriptureVerse: "એક શાસ્ત્ર શ્લોક",
    japaPractice: "જપ સાધના",
    aartiClosingPrayer: "આરati અને સમાપન પ્રાર્થના",
    observances: "વિધિઓ",
    livingTraditions: "જીવંત પરંપરાઓ",
    pravachanGuide: "પ્રવચન માર્ગદર્શિકા",
    dharmicReadingRoom: "ધarmic વાંચન કક્ષ",
    officialSources: "અધિકૃત સ્રોતો",
    publisherDirect: "પ્રકાશક-સીધા",
    vedicAstrologyCentre: "વૈદિક જ્યોતિષ શિક્ષણ કેન્દ્ર",
    privateBirthDetails: "ખાનગી જન્મ વિગતો",
    dateOfBirth: "જન્મ તારીખ",
    exactBirthTime: "ચોક્કસ જન્મ સમય",
    birthPlace: "જન્મ સ્થળ",
    savePrivatelyOnDevice: "આ ઉપકરણ પર ખાનગી રીતે સાચવો",
    coreCalculationVocabulary: "મૂળ ગણતરી શબ્દભંડોળ",
    navagrahaStudyMap: "નવગ્રહ અભ્યાસ નકશો",
    searchYouTube: "YouTube પર શોધો",
    playRecording: "રેકording ચલાવો",
    devotionalAudio: "ભક્તિ ઑડિયો",
    searchMantraLibrary: "મંત્ર પustakalaya શોધો",
    translationLabel: "અનુવાદ:",
    explainThisMantra: "આ મંત્ર સમજાવો",
    meaningAndContext: "અર્થ અને સંદર્ભ:",
    favoriteMantra: "મનપસંદ મંત્ર",
    newsletterEmail: "ન્યૂઝલેટર ઇમેઇલ",
    subscribe: "સબ્સ્ક્રાઇબ",
    privacyPolicy: "ગોપનીયતા નીતિ",
    termsOfUse: "ઉપયોગની શરતો",
    accessibility: "સુલભતા",
    trustAndSupport: "વિશ્વાસ અને સહાય",
    practice: "સાધના",
    discover: "શોધ",
    yourAccount: "તમારું ખાતું",
    userSettings: "વપરાશકર્તા સેટિંગ્સ",
    profile: "પ્રોફાઇલ",
    preferences: "પસંદગીઓ",
    account: "ખાતું",
    displayName: "પ્રદર્શિત નામ",
    darkTheme: "ઘાટું થીમ",
    loggedOut: "લૉગ આઉટ",
    loggedOutSuccess: "તમે સફળતાપૂર્વક લૉગ આઉટ થયા.",
    threeLivingPaths: "ત્રણ જીવંત માર્ગ. એક પવિત્ર સ્થાન.",
    yourSpiritualLibrary: "તમારું આધ્યાત્મિક પustakalaya",
    findWhatSpeaks: "તમારા હૃદય સાથે બોલે તે શોધો.",
    chooseTheMoment: "તમને જોઈતો ક્ષણ પસંદ કરો.",
    sacredRhythmEveryDay: "દરરોજ માટે પવિત્ર તાલ",
    liveTempleDarshan: "લાઇવ મંદિર દર્શન",
    welcomeBack: "પાછા સ્વાગત",
    createAccount: "ખાતું બનાવો",
    signIn: "સાઇન ઇન",
    continueAsGuest: "મહેમાન તરીકે ચાલુ રાખો",
    myAccount: "મારું ખાતું",
    signedIn: "સાઇન ઇન થયા",
    toggleTheme: "થીમ બદલો",
    devotee: "ભક્ત",
    appLanguage: "એપની ભાષા",
    appLanguageHint:
      "મેનુ અને લેબલ બદલે છે. મંત્રનો સંસ્કૃત પાઠ જેમ છે તેમ રહે.",
    saveProfile: "પ્રોફાઇલ સાચવો",
    signOut: "સાઇન આઉટ",
    signInOrCreate: "સાઇન ઇન કરો અથવા ખાતું બનાવો",
    guestPreferences: "મહેમાન પસંદગીઓ આ બ્રાઉઝરમાં રહેશે.",
    appearanceAndPlayback: "દેખાવ અને પ્લેબેક",
    autoplayMedia: "મીડિયા આપમેળે ચલાવો",
    notifications: "સૂચનાઓ",
    accountSecurity: "ખાતું સુરક્ષા",
    gotraOptional: "ગોત્ર અથવા કુટુંબ પરંપરા (વૈકલ્પિક)",
    yourNamePlaceholder: "તમારું નામ",
    enterIfKnown: "જાણ હોય તો જ દાખલ કરો",
    ishtaKulaDevata: "ઇષ્ટ અથવા કુળ દેવતા (વૈકલ્પિક)",
    chooseFamilyCalendar: "તમારું કુટુંબ પંચાંગ પસંદ કરો",
    signatureObservances: "મુખ્ય વિધિઓ",
    traditionsAndTemples: "પરંપરાઓ અને મંદિરો",
    selectStateOrUt: "રાજ્ય અથવા કેન્દ્રશાસિત પ્રદેશ પસંદ કરો",
    add: "ઉમેરો",
    deleteReminder: "અनुस્મારક કાઢી નાખો",
    personalSpiritualHome: "વ્યક્તિગત આધ્યાત્મિક ઘર",
    completedOnDevice: "આ ઉપકરણ પર પૂર્ણ.",
    returnToHome: "મુખ્ય પૃષ્ઠ પર પાછા",
    pageNotFound: "અરે! પૃષ્ઠ મળ્યું નહીં",
    backHome: "મુખ્ય પૃષ્ઠ",
    beginWithMantra: "મંત્રથી શરૂઆત",
    watchLiveDarshan: "લાઇવ દર્શન જુઓ",
    openLibrary: "પustakalaya ખોલો",
    todaysPanchang: "આજનું પંચાંગ",
    dailyCalendar: "દૈનિક પંચાંગ",
    useMyLocation: "મારું સ્થાન વાપરો",
    liveNow: "હમણાં લાઇવ",
    refreshLiveStatus: "લાઇવ સ્થિતિ તાજી કરો",
    sacredTextsHeritage: "પવિત્ર ગ્રંથ અને હિંદુ વારસો",
    readFullDetails: "સંપૂર્ણ વિગતો વાંચો",
    priestSearch: "પuroહિત શોધ",
    digitalJapaMala: "ડિજિટલ જપ માળા",
    reset: "રીસેટ",
    closeFullImage: "પૂર્ણ ચિત્ર બંધ",
    mantraScript: "મંત્ર લિપિ",
    useRegionalScript: "મારી પ્રાદેશિક લિપિ વાપરો",
    explaining: "સમજાવી રહ્યા છીએ…",
    listenWithContext: "સંદર્ભ સાથે સાંભળો",
    pravachanCulturalReading: "પ્રવચન અને સાંસ્કૃતિક વાંચન કક્ષ",
    newsletterTagline: "ક્યારેક ક્યારેક વિચારશીલ સંદેશ",
    newsletterDesc:
      "નવા મંત્ર, પવિત્ર ગ્રંથ ઉમેરો અને ઉપયોગી તહેવાર માર્ગદર્શન—દૈનિક ઘોંઘાટ વિના.",
    emailAddressPlaceholder: "ઇમેઇલ સરનામું",
    subscribeAgreement:
      "હું ઇમેઇલ અપડેટ્સ મેળવવા સહમત છું. કોઈ પણ સંદેશમાંથી સબ્સ્ક્રિપ્શન રદ કરી શકું.",
    footerTagline:
      "મંત્ર સાધના, મંદિર દર્શન, હિંદુ પવિત્ર સાહિત્ય અને રોજિંદી ભક્તિ શિક્ષણ માટે શાંત ડિજિટલ સ્થાન.",
    supportTheProject: "પ્રોજેક્ટને સમર્થન",
    footerDisclaimer:
      "શૈક્ષણિક ભક્તિ સામગ્રી · મુહૂર્ત અને औपचारિક સંસ્કાર યોગ્ય પ્રાદેશિક સ્રોતથી ચકાસો.",
    heroSubtitle: "તમારી દૈનિક પવિત્ર યાત્રા માટે શાંત સ્થાન.",
    heroDescription:
      "કાલજયી મંત્ર સાંભળો, લાઇવ મંદિર દર્શન અનુભવો, અને હિંદુ શાસ્ત્રોનો અભ્યાસ એક સુંદર જોડાયેલ આશ્રયમાં કરો.",
    sacredWisdomLiving: "પવિત્ર જ્ઞાન · જીવંત પરંપરા",
    resources700: "700+ પવિત્ર સંસાધનો",
    liveTempleDiscovery: "લાઇવ મંદિર શોધ",
    todaysIntention: "આજનો સંકલ્પ",
    peaceInEveryBreath: "દર શ્વાસમાં શાંતિ",
    readWisdom: "જ્ઞાન વાંચો",
    chooseSoundDarshan:
      "ધ્વનિ, દર્શન અથવા શાસ્ત્ર પસંદ કરો—દરેક અનુભવ પ્રતિસાદ આપે, અપડેટ થાય અને તમારી સાથે ચાલે.",
    startListening: "સાંભળવાનું શરૂ કરો",
    watchDarshan: "દર્શન જુઓ",
    readReflect: "વાંચો અને ચિંતન",
    sacredTexts: "પવિત્ર ગ્રંથ",
    designedAroundYou: "તમારા માટે ડિઝાઇન",
    listenReadReflect: "સાંભળો · વાંચો · ચિંતન",
    fastDiscovery: "ઝડપી શોધ",
    sanskritAndEnglish: "સંસ્કૃત અને અંગ્રેજી",
    morningPractice: "સવારની સાધના",
    beginWithGayatri: "Gayatri થી શરૂઆત",
    enterTheTemple: "મંદિરમાં પ્રવેશ",
    exploreTheGita: "Gita શોધો",
    backToDivinityHarmony: "Divinity Harmony પર પાછા",
    practiceRemembered: "તમારી સાધના, સુરક્ષિત રીતે યાદ રાખવામાં આવે.",
    profileAcrossDevices:
      "તમારી પ્રોફાઇલ, અવતાર અને આધ્યાત્મિક પસંદગીઓ ઉપકરણોમાં જોડાયેલી રાખો.",
    authPoweredBy: "પ્રમાણીકરણ અને ફાઇલ સંગ્રહ Supabase દ્વારા",
    authConfiguring: "ખાતું સેવા કન્ફિગર થઈ રહી છે",
    guestAccessAvailable:
      "મહેમાન પ્રવેશ ઉપલબ્ધ. લૉગિન સક્રિય કરવા Supabase ડિપ્લોયમેન્ટ ચલ ઉમેરો.",
    signInWithEmail: "તમારા ખાતા માટે વપરાયેલ ઇમેઇલથી સાઇન ઇન કરો.",
    email: "ઇમેઇલ",
    password: "પાસવર્ડ",
    forgotPassword: "પાસવર્ડ ભૂલી ગયા?",
    createYourAccount: "તમારું ખાતું બનાવો",
    profileFollowsDevices: "તમારી પ્રોફાઇલ બધા ઉપકરણોમાં તમારી સાથે રહેશે.",
    minEightChars: "ઓછામાં ઓછા 8 અક્ષરો.",
    emailConfirmationNote:
      "તમારા Supabase પ્રોજેક્ટ દ્વારા ઇમેઇલ પુષ્ટિ જરૂરી હોઈ શકે.",
  },
};

// Import full locale data from JSON files (generated alongside this script)
const localeDataDir = path.join(__dirname, "locale-data");
const PACK_LOCALES = ["gu", "ta", "te", "ml", "pa", "as", "mr"];

function loadLocaleJson(locale) {
  const file = path.join(localeDataDir, `${locale}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function buildPack(locale, extra = {}) {
  const fromDict = fromEnglishDict(loadRegionalDict(locale));
  const jsonData = loadLocaleJson(locale);
  const tail = tailSupplement[locale] ?? {};
  const pack = {
    ...fromDict,
    ...(EXTENDED[locale] ?? {}),
    ...(jsonData ?? {}),
    ...extra,
    ...tail,
  };
  return pack;
}

function emitPackMjs(locale, pack, exportName) {
  const lines = [`/** Complete ${locale.toUpperCase()} UI pack — 225 semantic keys. */`];
  lines.push(`export const ${exportName} = {`);
  for (const key of KEY_LIST) {
    const val = pack[key];
    if (!val) continue;
    lines.push(`  ${key}: ${JSON.stringify(val)},`);
  }
  lines.push("};");
  lines.push("");
  const out = path.join(__dirname, `${locale}-pack.mjs`);
  fs.writeFileSync(out, lines.join("\n"));
  return out;
}

// Validate tail supplement
for (const locale of ["hi", "kn", "bn", "gu", "mr", "ta", "te", "ml", "or", "pa", "as"]) {
  const missing = TAIL_KEYS.filter((k) => !tailSupplement[locale]?.[k]);
  if (missing.length) {
    console.error(`tail-supplement ${locale}: missing ${missing.length}:`, missing.join(", "));
    process.exit(1);
  }
  if (!tailSupplement[locale].exploreMantrasTemplate?.includes?.("{count}") &&
      tailSupplement[locale].exploreMantrasTemplate) {
    // exploreMantrasTemplate not in tail
  }
  if (!tailSupplement[locale].starOf27.includes("{n}")) {
    console.error(`${locale}: starOf27 missing {n}`);
    process.exit(1);
  }
}
console.log(`tail-supplement.json: ${Object.keys(tailSupplement).length} locales × ${TAIL_KEYS.length} keys OK`);

// Build mr from overrides + hi fill pattern
const hiEnglish = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../sources/old-ui-translations-hi-kn.json"), "utf8"),
).hi;
const hiKnExtended = JSON.parse(
  fs.readFileSync(path.join(__dirname, "hi-kn-extended.json"), "utf8"),
);
const hiPack = {
  ...fromEnglishDict(hiEnglish),
  ...hiKnExtended.hi,
  ...tailSupplement.hi,
};

let mrPack = buildPack("mr", { ...mrOverrides });
for (const [k, v] of Object.entries(hiPack)) {
  if (!mrPack[k]) mrPack[k] = v;
}
const mrJson = loadLocaleJson("mr");
if (mrJson) mrPack = { ...mrPack, ...mrJson };

const results = [];
for (const locale of PACK_LOCALES) {
  let pack;
  if (locale === "mr") {
    pack = mrPack;
  } else {
    pack = buildPack(locale);
  }
  const missing = KEY_LIST.filter((k) => !pack[k]);
  if (missing.length) {
    console.error(`${locale}-pack: missing ${missing.length}:`, missing.slice(0, 10).join(", "), "...");
    process.exit(1);
  }
  if (!pack.exploreMantrasTemplate.includes("{count}")) {
    console.error(`${locale}: exploreMantrasTemplate missing {count}`);
    process.exit(1);
  }
  if (!pack.starOf27.includes("{n}")) {
    console.error(`${locale}: starOf27 missing {n}`);
    process.exit(1);
  }
  const out = emitPackMjs(locale, pack, `${locale}Pack`);
  results.push({ locale, keys: Object.keys(pack).length, file: out });
}

for (const r of results) {
  console.log(`${r.locale}-pack.mjs: ${r.keys} keys → ${path.basename(r.file)}`);
}
