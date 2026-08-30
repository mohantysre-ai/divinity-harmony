/**
 * One-shot generator for scripts/locale-pack-data.json
 * Run: node scripts/gen-locale-data.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const keysSrc = fs.readFileSync(path.join(root, "src/lib/ui-keys.ts"), "utf8");
/** @type {Record<string, string>} */
const UI_KEYS = {};
for (const m of keysSrc.matchAll(/^\s+(\w+):\s*"((?:\\.|[^"\\])*)"/gm)) {
  UI_KEYS[m[1]] = m[2].replace(/\\"/g, '"');
}
const KEY_LIST = Object.keys(UI_KEYS);

function parseDictBlock(block) {
  const dict = {};
  for (const m of block.matchAll(
    /(?:"((?:\\.|[^"\\])*)"|([A-Za-z]+))\s*:\s*"((?:\\.|[^"\\])*)",?/g,
  )) {
    dict[(m[1] || m[2]).replace(/\\"/g, '"')] = m[3].replace(/\\"/g, '"');
  }
  return dict;
}

function loadEnglishDict(locale) {
  if (locale === "hi" || locale === "kn") {
    const src = fs.readFileSync(path.join(root, "src/lib/ui-translations.ts"), "utf8");
    const next = locale === "hi" ? "kn" : "\\.\\.\\.";
    const block = src.match(new RegExp(`${locale}:\\s*\\{([\\s\\S]*?)\\n  \\},\\n  ${next}`))?.[1];
    return block ? parseDictBlock(block) : {};
  }
  const src = fs.readFileSync(path.join(root, "src/lib/regional-ui-dicts.ts"), "utf8");
  const block = src.match(new RegExp(`export const ${locale}Dict: UiDict = \\{([\\s\\S]*?)\\n\\};`))?.[1];
  return block ? parseDictBlock(block) : {};
}

function fromEnglishDict(locale) {
  const ed = loadEnglishDict(locale);
  const pack = {};
  for (const [k, en] of Object.entries(UI_KEYS)) {
    if (ed[en]) pack[k] = ed[en];
  }
  return pack;
}

/** Full UI packs — supplemental keys merged over extracted existing. */
const FULL = {
  hi: {
    myAccount: "मेरा खाता",
    signedIn: "साइन इन किया",
    toggleTheme: "थीम बदलें",
    devotee: "भक्त",
    appLanguage: "ऐप की भाषा",
    appLanguageHint: "मेनू और लेबल बदलते हैं। मंत्र का संस्कृत पाठ जैसा है वैसा रहेगा।",
    saveProfile: "प्रोफ़ाइल सहेजें",
    signOut: "साइन आउट",
    signInOrCreate: "साइन इन करें या खाता बनाएँ",
    guestPreferences: "अतिथि प्राथमिकताएँ इस ब्राउज़र में रहेंगी।",
    appearanceAndPlayback: "दिखावट और प्लेबैक",
    autoplayMedia: "मीडिया स्वतः चलाएँ",
    notifications: "सूचनाएँ",
    accountSecurity: "खाता सुरक्षा",
    gotraOptional: "गोत्र या पारिवारिक परंपरा (वैकल्पिक)",
    yourNamePlaceholder: "आपका नाम",
    enterIfKnown: "केवल ज्ञात हो तो भरें",
    ishtaKulaDevata: "इष्ट या कुल देवता (वैकल्पिक)",
    chooseFamilyCalendar: "अपना पारिवारिक पंचांग चुनें",
    signatureObservances: "प्रमुख अनुष्ठान",
    traditionsAndTemples: "परंपराएँ और मंदिर",
    selectStateOrUt: "राज्य या केंद्रशासित प्रदेश चुनें",
    add: "जोड़ें",
    deleteReminder: "अनुस्मारक हटाएँ",
    personalSpiritualHome: "व्यक्तिगत आध्यात्मिक घर",
    completedOnDevice: "इस उपकरण पर पूर्ण।",
    returnToHome: "मुखपृष्ठ पर लौटें",
    pageNotFound: "ओह! पृष्ठ नहीं मिला",
    backHome: "मुखपृष्ठ पर जाएँ",
    beginWithMantra: "मंत्र से शुरू करें",
    watchLiveDarshan: "लाइव दर्शन देखें",
    openLibrary: "पुस्तकालय खोलें",
    todaysPanchang: "आज का पंचांग",
    dailyCalendar: "दैनिक पंचांग",
    useMyLocation: "मेरा स्थान उपयोग करें",
    liveNow: "अभी लाइव",
    refreshLiveStatus: "लाइव स्थिति ताज़ा करें",
    sacredTextsHeritage: "पवित्र ग्रंथ और हिंदू विरासत",
    readFullDetails: "पूरी जानकारी पढ़ें",
    priestSearch: "पुजारी खोज",
    digitalJapaMala: "डिजिटल जप माला",
    reset: "रीसेट",
    closeFullImage: "पूर्ण चित्र बंद करें",
    mantraScript: "मंत्र लिपि",
    useRegionalScript: "मेरी क्षेत्रीय लिपि उपयोग करें",
    explaining: "समझा रहे हैं…",
    listenWithContext: "संदर्भ के साथ सुनें",
    pravachanCulturalReading: "प्रवचन और सांस्कृतिक पठन कक्ष",
    newsletterTagline: "कभी-कभार एक विचारशील संदेश",
    newsletterDesc: "नए मंत्र, पवित्र ग्रंथ और उपयोगी त्योहार मार्गदर्शन—बिना दैनिक शोर के।",
    emailAddressPlaceholder: "ईमेल पता",
    subscribeAgreement: "मैं ईमेल अपडेट प्राप्त करने से सहमत हूँ। किसी भी संदेश से सदस्यता रद्द कर सकता/सकती हूँ।",
    footerTagline: "मंत्र साधना, मंदिर दर्शन, हिंदू पवित्र साहित्य और रोज़मर्रा की भक्ति शिक्षा के लिए एक शांत डिजिटल स्थान।",
    supportTheProject: "परियोजना का समर्थन करें",
    footerDisclaimer: "शैक्षिक भक्ति सामग्री · मुहूर्त और औपचारिक संस्कार किसी योग्य क्षेत्रीय स्रोत से सत्यापित करें।",
    heroSubtitle: "आपकी दैनिक पवित्र यात्रा के लिए एक शांत स्थान।",
    heroDescription: "कालजयी मंत्र सुनें, लाइव मंदिर दर्शन अनुभव करें, और हिंदू शास्त्रों का अध्ययन एक सुंदर जुड़े हुए आश्रय में करें।",
    sacredWisdomLiving: "पवित्र ज्ञान · जीवित परंपरा",
    resources700: "700+ पवित्र संसाधन",
    liveTempleDiscovery: "लाइव मंदिर खोज",
    todaysIntention: "आज का संकल्प",
    peaceInEveryBreath: "हर श्वास में शांति",
    readWisdom: "ज्ञान पढ़ें",
    chooseSoundDarshan: "ध्वनि, दर्शन या शास्त्र चुनें—हर अनुभव प्रतिक्रिया देता है, अपडेट होता है और आपके साथ चलता है।",
    startListening: "सुनना शुरू करें",
    watchDarshan: "दर्शन देखें",
    readReflect: "पढ़ें और चिंतन करें",
    sacredTexts: "पवित्र ग्रंथ",
    designedAroundYou: "आपके लिए बनाया गया",
    listenReadReflect: "सुनें · पढ़ें · चिंतन करें",
    fastDiscovery: "त्वरित खोज",
    sanskritAndEnglish: "संस्कृत और अंग्रेज़ी",
    morningPractice: "प्रातः साधना",
    beginWithGayatri: "Gayatri से शुरू करें",
    enterTheTemple: "मंदिर में प्रवेश करें",
    exploreTheGita: "Gita का अन्वेषण करें",
    backToDivinityHarmony: "Divinity Harmony पर वापस",
    practiceRemembered: "आपकी साधना, सुरक्षित रूप से याद रखी जाती है।",
    profileAcrossDevices: "अपनी प्रोफ़ाइल, अवतार और आध्यात्मिक प्राथमिकताएँ उपकरणों में जुड़ी रखें।",
    authPoweredBy: "प्रमाणीकरण और फ़ाइल संग्रहण Supabase द्वारा संचालित",
    authConfiguring: "खाता सेवा कॉन्फ़िगर की जा रही है",
    guestAccessAvailable: "अतिथि पहुँच उपलब्ध रहेगी। लॉगिन सक्षम करने के लिए Supabase परिनियोजन चर जोड़ें।",
    signInWithEmail: "अपने खाते के लिए उपयोग किए गए ईमेल से साइन इन करें।",
    email: "ईमेल",
    password: "पासवर्ड",
    forgotPassword: "पासवर्ड भूल गए?",
    createYourAccount: "अपना खाता बनाएँ",
    profileFollowsDevices: "आपकी प्रोफ़ाइल सभी उपकरणों में आपके साथ रहेगी।",
    minEightChars: "न्यूनतम 8 अक्षर।",
    emailConfirmationNote: "आपके Supabase प्रोजेक्ट द्वारा ईमेल पुष्टि आवश्यक हो सकती है।",
  },
  kn: {
    myAccount: "ನನ್ನ ಖಾತೆ",
    signedIn: "ಸೈನ್ ಇನ್ ಆಗಿದೆ",
    toggleTheme: "ಥೀಮ್ ಬದಲಿಸಿ",
    devotee: "ಭಕ್ತ",
    appLanguage: "ಅಪ್ಲಿಕೇಶನ್ ಭಾಷೆ",
    appLanguageHint: "ಮೆನು ಮತ್ತು ಲೇಬಲ್‌ಗಳನ್ನು ಬದಲಾಯಿಸುತ್ತದೆ. ಮಂತ್ರದ ಸಂಸ್ಕೃತ ಪಠ್ಯವು ಬರೆದಿರುವಂತೆಯೇ ಉಳಿಯುತ್ತದೆ.",
    saveProfile: "ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ",
    signOut: "ಸೈನ್ ಔಟ್",
    signInOrCreate: "ಸೈನ್ ಇನ್ ಮಾಡಿ ಅಥವಾ ಖಾತೆ ರಚಿಸಿ",
    guestPreferences: "ಅತಿಥಿ ಆದ್ಯತೆಗಳು ಈ ಬ್ರೌಸರ್‌ನಲ್ಲೇ ಉಳಿಯುತ್ತವೆ.",
    appearanceAndPlayback: "ದೃಶ್ಯ ಮತ್ತು ಪ್ಲೇಬ್ಯಾಕ್",
    autoplayMedia: "ಮಾಧ್ಯಮವನ್ನು ಸ್ವಯಂ ಚಾಲನೆ ಮಾಡಿ",
    notifications: "ಅಧಿಸೂಚನೆಗಳು",
    accountSecurity: "ಖಾತೆ ಭದ್ರತೆ",
    gotraOptional: "ಗೋತ್ರ ಅಥವಾ ಕುಟುಂಬ ಸಂಪ್ರದಾಯ (ಐಚ್ಛಿಕ)",
    yourNamePlaceholder: "ನಿಮ್ಮ ಹೆಸರು",
    enterIfKnown: "ತಿಳಿದಿದ್ದರೆ ಮಾತ್ರ ನಮೂದಿಸಿ",
    ishtaKulaDevata: "ಇಷ್ಟ ಅಥವಾ ಕುಲ ದೇವತೆ (ಐಚ್ಛಿಕ)",
    chooseFamilyCalendar: "ನಿಮ್ಮ ಕುಟುಂಬ ಪಂಚಾಂಗ ಆಯ್ಕೆಮಾಡಿ",
    signatureObservances: "ಪ್ರಮುಖ ಆಚರಣೆಗಳು",
    traditionsAndTemples: "ಸಂಪ್ರದಾಯಗಳು ಮತ್ತು ದೇವಾಲಯಗಳು",
    selectStateOrUt: "ರಾಜ್ಯ ಅಥವಾ ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶ ಆಯ್ಕೆಮಾಡಿ",
    add: "ಸೇರಿಸಿ",
    deleteReminder: "ನೆನಪು ಅಳಿಸಿ",
    personalSpiritualHome: "ವೈಯಕ್ತಿಕ ಆಧ್ಯಾತ್ಮಿಕ ಮನೆ",
    completedOnDevice: "ಈ ಸಾಧನದಲ್ಲಿ ಪೂರ್ಣಗೊಂಡಿದೆ.",
    returnToHome: "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",
    pageNotFound: "ಓಹ್! ಪುಟ ಕಂಡುಬಂದಿಲ್ಲ",
    backHome: "ಮುಖಪುಟಕ್ಕೆ",
    beginWithMantra: "ಮಂತ್ರದಿಂದ ಪ್ರಾರಂಭಿಸಿ",
    watchLiveDarshan: "ಲೈವ್ ದರ್ಶನ ನೋಡಿ",
    openLibrary: "ಗ್ರಂಥಾಲಯ ತೆರೆಯಿರಿ",
    todaysPanchang: "ಇಂದಿನ ಪಂಚಾಂಗ",
    dailyCalendar: "ದೈನಂದಿನ ಪಂಚಾಂಗ",
    useMyLocation: "ನನ್ನ ಸ್ಥಳ ಬಳಸಿ",
    liveNow: "ಈಗ ಲೈವ್",
    refreshLiveStatus: "ಲೈವ್ ಸ್ಥಿತಿ ನವೀಕರಿಸಿ",
    sacredTextsHeritage: "ಪವಿತ್ರ ಗ್ರಂಥಗಳು ಮತ್ತು ಹಿಂದೂ ಪರಂಪರೆ",
    readFullDetails: "ಪೂರ್ಣ ವಿವರಗಳನ್ನು ಓದಿ",
    priestSearch: "ಪುರೋಹಿತ ಹುಡುಕಾಟ",
    digitalJapaMala: "ಡಿಜಿಟಲ್ ಜಪ ಮಾಲ",
    reset: "ಮರುಹೊಂದಿಸಿ",
    closeFullImage: "ಪೂರ್ಣ ಚಿತ್ರ ಮುಚ್ಚಿ",
    mantraScript: "ಮಂತ್ರ ಲಿಪಿ",
    useRegionalScript: "ನನ್ನ ಪ್ರಾದೇಶಿಕ ಲಿಪಿ ಬಳಸಿ",
    explaining: "ವಿವರಿಸಲಾಗುತ್ತಿದೆ…",
    listenWithContext: "ಸಂದರ್ಭದೊಂದಿಗೆ ಕೇಳಿ",
    pravachanCulturalReading: "ಪ್ರವಚನ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ವಾಚನಾಲಯ",
    newsletterTagline: "ಅಪ್ಪಾಗಪ್ಪ ಸೂಕ್ತ ಸಂದೇಶ",
    newsletterDesc: "ಹೊಸ ಮಂತ್ರಗಳು, ಪವಿತ್ರ ಗ್ರಂಥ ಸೇರ್ಪಡೆಗಳು ಮತ್ತು ಉಪಯುಕ್ತ ಹಬ್ಬ ಮಾರ್ಗದರ್ಶನ—ದೈನಂದಿನ ಶಬ್ದವಿಲ್ಲದೆ.",
    emailAddressPlaceholder: "ಇಮೇಲ್ ವಿಳಾಸ",
    subscribeAgreement: "ಇಮೇಲ್ ನವೀಕರಣಗಳನ್ನು ಸ್ವೀಕರಿಸಲು ಒಪ್ಪುತ್ತೇನೆ. ಯಾವುದೇ ಸಂದೇಶದಿಂದ ಸದಸ್ಯತೆ ರದ್ದು ಮಾಡಬಹುದು.",
    footerTagline: "ಮಂತ್ರ ಸಾಧನೆ, ದೇವಾಲಯ ದರ್ಶನ, ಹಿಂದೂ ಪವಿತ್ರ ಸಾಹಿತ್ಯ ಮತ್ತು ದೈನಂದಿನ ಭಕ್ತಿ ಕಲಿಕೆಗೆ ಶಾಂತ ಡಿಜಿಟಲ್ ಸ್ಥಳ.",
    supportTheProject: "ಯೋಜನೆಗೆ ಬೆಂಬಲ",
    footerDisclaimer: "ಶೈಕ್ಷಣಿಕ ಭಕ್ತಿ ವಿಷಯ · ಮುಹೂರ್ತ ಮತ್ತು ಔಪಚಾರಿಕ ಸಂಸ್ಕಾರಗಳನ್ನು ಅರ್ಹ ಪ್ರಾದೇಶಿಕ ಮೂಲದಿಂದ ಪರಿಶೀಲಿಸಿ.",
    heroSubtitle: "ನಿಮ್ಮ ದೈನಂದಿನ ಪವಿತ್ರ ಪ್ರಯಾಣಕ್ಕೆ ಶಾಂತ ಸ್ಥಳ.",
    heroDescription: "ಕಾಲಾತೀತ ಮಂತ್ರಗಳನ್ನು ಕೇಳಿ, ಲೈವ್ ದೇವಾಲಯ ದರ್ಶನ ಅನುಭವಿಸಿ, ಹಿಂದೂ ಶಾಸ್ತ್ರಗಳನ್ನು ಒಂದು ಸುಂದರವಾಗಿ ಜೋಡಿಸಿದ ಆಶ್ರಯದಲ್ಲಿ ಅಧ್ಯಯನ ಮಾಡಿ.",
    sacredWisdomLiving: "ಪವಿತ್ರ ಜ್ಞಾನ · ಜೀವಂತ ಸಂಪ್ರದಾಯ",
    resources700: "700+ ಪವಿತ್ರ ಸಂಪನ್ಮೂಲಗಳು",
    liveTempleDiscovery: "ಲೈವ್ ದೇವಾಲಯ ಅನ್ವೇಷಣೆ",
    todaysIntention: "ಇಂದಿನ ಸಂಕಲ್ಪ",
    peaceInEveryBreath: "ಪ್ರತಿ ಉಸಿರಿನಲ್ಲೂ ಶಾಂತಿ",
    readWisdom: "ಜ್ಞಾನ ಓದಿ",
    chooseSoundDarshan: "ಧ್ವನಿ, ದರ್ಶನ ಅಥವಾ ಶಾಸ್ತ್ರ ಆಯ್ಕೆಮಾಡಿ—ಪ್ರತಿ ಅನುಭವ ಪ್ರತಿಕ್ರಿಯಿಸುತ್ತದೆ, ನವೀಕರಿಸುತ್ತದೆ ಮತ್ತು ನಿಮ್ಮೊಂದಿಗೆ ಚಲಿಸುತ್ತದೆ.",
    startListening: "ಕೇಳಲು ಪ್ರಾರಂಭಿಸಿ",
    watchDarshan: "ದರ್ಶನ ನೋಡಿ",
    readReflect: "ಓದಿ ಮತ್ತು ಚಿಂತನೆ ಮಾಡಿ",
    sacredTexts: "ಪವಿತ್ರ ಗ್ರಂಥಗಳು",
    designedAroundYou: "ನಿಮಗಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ",
    listenReadReflect: "ಕೇಳಿ · ಓದಿ · ಚಿಂತನೆ",
    fastDiscovery: "ವೇಗದ ಅನ್ವೇಷಣೆ",
    sanskritAndEnglish: "ಸಂಸ್ಕೃತ ಮತ್ತು ಇಂಗ್ಲಿಷ್",
    morningPractice: "ಬೆಳಿಗ್ಗಿನ ಸಾಧನೆ",
    beginWithGayatri: "Gayatri ಯಿಂದ ಪ್ರಾರಂಭಿಸಿ",
    enterTheTemple: "ದೇವಾಲಯಕ್ಕೆ ಪ್ರವೇಶಿಸಿ",
    exploreTheGita: "Gita ಅನ್ವೇಷಿಸಿ",
    backToDivinityHarmony: "Divinity Harmony ಗೆ ಹಿಂತಿರುಗಿ",
    practiceRemembered: "ನಿಮ್ಮ ಸಾಧನೆ, ಸುರಕ್ಷಿತವಾಗಿ ನೆನಪಿಡಲಾಗುತ್ತದೆ.",
    profileAcrossDevices: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್, ಅವತಾರ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಆದ್ಯತೆಗಳನ್ನು ಸಾಧನಗಳಲ್ಲಿ ಜೋಡಿಸಿ.",
    authPoweredBy: "ಪ್ರಮಾಣೀಕರಣ ಮತ್ತು ಫೈಲ್ ಸಂಗ್ರಹಣೆ Supabase ನಿಂದ",
    authConfiguring: "ಖಾತೆ ಸೇವೆ ಕಾನ್ಫಿಗರ್ ಆಗುತ್ತಿದೆ",
    guestAccessAvailable: "ಅತಿಥಿ ಪ್ರವೇಶ ಲಭ್ಯ. ಲಾಗಿನ್ ಸಕ್ರಿಯಗೊಳಿಸಲು Supabase ನಿಯೋಜನೆ ಚರಗಳನ್ನು ಸೇರಿಸಿ.",
    signInWithEmail: "ನಿಮ್ಮ ಖಾತೆಗೆ ಬಳಸಿದ ಇಮೇಲ್‌ನಿಂದ ಸೈನ್ ಇನ್ ಮಾಡಿ.",
    email: "ಇಮೇಲ್",
    password: "ಪಾಸ್‌ವರ್ಡ್",
    forgotPassword: "ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?",
    createYourAccount: "ನಿಮ್ಮ ಖಾತೆ ರಚಿಸಿ",
    profileFollowsDevices: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಎಲ್ಲಾ ಸಾಧನಗಳಲ್ಲಿ ನಿಮ್ಮೊಂದಿಗೆ ಉಳಿಯುತ್ತದೆ.",
    minEightChars: "ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳು.",
    emailConfirmationNote: "ನಿಮ್ಮ Supabase ಪ್ರಾಜೆಕ್ಟ್‌ನಿಂದ ಇಮೇಲ್ ದೃಢೀಕರಣ ಅಗತ್ಯವಿರಬಹುದು.",
  },
};

import { orSupplement } from "./packs/or-supplement.mjs";
import { regionalFullPacks } from "./packs/regional-full.mjs";

const locales = ["hi", "kn", "bn", "gu", "mr", "ta", "te", "ml", "or", "pa", "as"];
const packs = {};

for (const locale of locales) {
  const base = fromEnglishDict(locale);
  const merged = {
    ...base,
    ...(regionalFullPacks[locale] ?? {}),
    ...(FULL[locale] ?? {}),
    ...(locale === "or" ? orSupplement : {}),
  };
  packs[locale] = merged;
}

// Marathi: derive from Hindi with specific overrides
if (packs.hi && packs.mr) {
  for (const [k, v] of Object.entries(packs.hi)) {
    if (!packs.mr[k]) packs.mr[k] = v;
  }
}

for (const locale of locales) {
  const missing = KEY_LIST.filter((k) => !packs[locale][k]);
  if (missing.length) {
    console.error(`${locale}: missing ${missing.length}:`, missing.join(", "));
    process.exit(1);
  }
}

const out = path.join(__dirname, "locale-pack-data.json");
fs.writeFileSync(out, JSON.stringify(packs, null, 2) + "\n");

for (const locale of locales) {
  console.log(`${locale}: ${Object.keys(packs[locale]).length} keys`);
}
console.log(`Wrote ${out}`);
