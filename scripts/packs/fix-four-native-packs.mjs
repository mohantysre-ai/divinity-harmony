/**
 * Fix mixed-Latin strings in te, ml, pa, ta packs (186 keys each).
 * Run: node scripts/packs/fix-four-native-packs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..", "..");
const genSrc = fs.readFileSync(path.join(__dirname, "..", "generate-locale-packs.mjs"), "utf8");
const KEYS = [...genSrc.matchAll(/^\s+"(\w+)",/gm)].map((m) => m[1]);
const localePacks = JSON.parse(
  fs.readFileSync(path.join(root, "src/lib/locale-packs.json"), "utf8"),
);

/** @type {Record<string, Record<string, string>>} */
const FIXES = {
  te: {
    heroDescription:
      "శాశ్వత మంత్రాలు వినండి, లైవ్ దేవాలయ దర్శనం అనుభవించండి, హిందూ శాస్త్రాలను ఒక అందమైన అనుసంధానిత ఆశ్రయంలో అభ్యసించండి.",
    todaysIntention: "నేటి సంకల్పం",
    peaceInEveryBreath: "ప్రతి శ్వాసలో శాంతి",
    readWisdom: "జ్ఞానం చదవండి",
    chooseSoundDarshan:
      "ధ్వని, దర్శనం లేదా శాస్త్రం ఎంచుకోండి—ప్రతి అనుభవం ప్రతిస్పందిస్తుంది, నవీకరిస్తుంది మరియు మీతో కలిసి ముందుకు సాగుతుంది.",
    readReflect: "చదవండి మరియు ఆలోచించండి",
    designedAroundYou: "మీ కోసం రూపొందించబడింది",
    listenReadReflect: "వినండి · చదవండి · ఆలోచించండి",
    fastDiscovery: "వేగవంతమైన అన్వేషణ",
    sanskritAndEnglish: "సంస్కృతం మరియు ఇంగ్లీష్",
    morningPractice: "ఉదయం సాధన",
    beginWithGayatri: "Gayatri తో ప్రారంభించండి",
    enterTheTemple: "దేవాలయంలో ప్రవేశించండి",
    exploreTheGita: "Gita అన్వేషించండి",
    backToDivinityHarmony: "Divinity Harmony కు తిరిగి",
    practiceRemembered: "మీ సాధన, సురక్షితంగా గుర్తుంచబడుతుంది.",
    profileAcrossDevices:
      "మీ ప్రొఫైల్, అవతార్ మరియు ఆధ్యాత్మిక అభిరుచులను పరికరాలలో అనుసంధానించి ఉంచండి.",
    authPoweredBy: "ప్రామాణీకరణ మరియు ఫైల్ నిల్వ Supabase ద్వారా",
    authConfiguring: "ఖాతా సేవ కాన్ఫిగర్ అవుతోంది",
    guestAccessAvailable:
      "అతిథి ప్రవేశం అందుబాటులో ఉంది. లాగిన్ ప్రారంభించడానికి Supabase డిప్లాయ్‌మెంట్ చਰలను జోడించండి.",
    signInWithEmail: "మీ ఖాతాకు ఉపయోగించిన ఇమెయిల్‌తో సైన్ ఇన్ చేయండి.",
    forgotPassword: "పాస్‌వర్డ్ మర్చిపోయారా?",
    createYourAccount: "మీ ఖాతా సృష్టించండి",
    profileFollowsDevices: "మీ ప్రొఫైల్ అన్ని పరికరాలలో మీతో ఉంటుంది.",
    minEightChars: "కనీసం 8 అక్షరాలు.",
    emailConfirmationNote:
      "మీ Supabase ప్రాజెక్ట్ ద్వారా ఇమెయిల్ నిర్ధారణ అవసరం కావచ్చు.",
  },
  ml: {
    priests: "പുരോഹിതർ",
    pravachanReading: "പ്രവചനവും വായനയും",
    pravachanGuide: "പ്രവചന ഗൈഡ്",
    dharmicReadingRoom: "ധാർമിക വായനാ മുറി",
    personalSpiritualHome: "വ്യക്തിഗത ആത്മീയ ആവാസം",
    priestSearch: "പുരോഹിത തിരയൽ",
    pravachanCulturalReading: "പ്രവചന & സാംസ്കാരിക വായനാ മുറി",
    newsletterDesc:
      "പുതിയ മന്ത്രങ്ങൾ, പവിത്ര ഗ്രന്ഥ സേർപ്പുകൾ, ഉപയോഗപ്രദമായ ഉത്സവ മാർഗദർശനം—ദൈനംദിന ശബ്ദമില്ലാതെ.",
    subscribeAgreement:
      "ഇമെയിൽ അപ്‌ഡേറ്റുകൾ സ്വീകരിക്കാൻ ഞാൻ സമ്മതിക്കുന്നു. ഏത് സന്ദേശത്തിലും നിന്ന് സബ്സ്ക്രിപ്ഷൻ റദ്ദാക്കാം.",
    footerTagline:
      "മന്ത്ര പരിശീലനം, ക്ഷേത്ര ദർശനം, ഹിന്ദു പവിത്ര സാഹിത്യം, ദൈനംദിന ഭക്തി പഠനം എന്നിവയ്ക്കുള്ള ശാന്തമായ ഡിജിറ്റൽ ഇടം.",
    footerDisclaimer:
      "വിദ്യാഭ്യാസ ഭക്തി ഉള്ളടക്കം · മുഹൂർത്തവും ഔപചാരിക സംസ്കാരം യോഗ്യമായ പ്രാദേശിക ഉറവിടം ഉപയോഗിച്ച് പരിശോധിക്കുക.",
    heroSubtitle: "നിങ്ങളുടെ ദൈനംദിന പവിത്ര യാത്രയ്ക്ക് ഒരു ശാന്തമായ ഇടം.",
    heroDescription:
      "കാലാതീത മന്ത്രങ്ങൾ കേൾക്കുക, ലൈവ് ക്ഷേത്ര ദർശനം അനുഭവിക്കുക, ഹിന്ദു ശാസ്ത്രങ്ങൾ ഒരു മനോഹരമായി ബന്ധിപ്പിച്ച ആശ്രയത്തിൽ അധ്യയനം ചെയ്യുക.",
    resources700: "700+ പവിത്ര ഉപാധികൾ",
    liveTempleDiscovery: "ലൈവ് ക്ഷേത്ര കണ്ടെത്തൽ",
    todaysIntention: "ഇന്നത്തെ സങ്കൽപ്പം",
    peaceInEveryBreath: "ഓരോ ശ്വാസത്തിലും ശാന്തി",
    chooseSoundDarshan:
      "ശബ്ദം, ദർശനം അല്ലെങ്കിൽ ശാസ്ത്രം തിരഞ്ഞെടുക്കുക—ഓരോ അനുഭവവും പ്രതികരിക്കുന്നു, പുതുക്കുന്നു, നിങ്ങളോടൊപ്പം നീങ്ങുന്നു.",
    designedAroundYou: "നിങ്ങൾക്കായി രൂപകൽപ്പന",
    fastDiscovery: "വേഗത്തിലുള്ള കണ്ടെത്തൽ",
    morningPractice: "രാവിലെ പരിശീലനം",
    exploreTheGita: "Gita പര്യവേക്ഷണം ചെയ്യുക",
    practiceRemembered: "നിങ്ങളുടെ പരിശീലനം, സുരക്ഷിതമായി ഓർമ്മിച്ചിരിക്കുന്നു.",
    profileAcrossDevices:
      "നിങ്ങളുടെ പ്രൊഫൈൽ, അവതാർ, ആത്മീയ മുൻഗണനകൾ ഉപകരണങ്ങളിൽ ബന്ധിപ്പിച്ച് സൂക്ഷിക്കുക.",
    authPoweredBy: "പ്രാമാണീകരണവും ഫയൽ സംഭരണവും Supabase-ൽ നിന്ന്",
    authConfiguring: "അക്കൗണ്ട് സേവ കോൺഫിഗർ ചെയ്യുന്നു",
    guestAccessAvailable:
      "അതിഥി പ്രവേശനം ലഭ്യമാണ്. ലോഗിൻ പ്രവർത്തനക്ഷമമാക്കാൻ Supabase ഡിപ്ലോയ്‌മെന്റ് ചരങ്ങൾ ചേർക്കുക.",
    signInWithEmail: "അക്കൗണ്ടിൽ ഉപയോഗിച്ച ഇമെയിൽ ഉപയോഗിച്ച് സൈൻ ഇൻ ചെയ്യുക.",
    password: "പാസ്‌വേഡ്",
    forgotPassword: "പാസ്‌വേഡ് മറന്നോ?",
    createYourAccount: "നിങ്ങളുടെ അക്കൗണ്ട് സൃഷ്ടിക്കുക",
    profileFollowsDevices: "നിങ്ങളുടെ പ്രൊഫൈൽ എല്ലാ ഉപകരണങ്ങളിലും നിങ്ങളോടൊപ്പം ഉണ്ടാകും.",
    minEightChars: "കുറഞ്ഞത് 8 അക്ഷരങ്ങൾ.",
    emailConfirmationNote: "Supabase പ്രോജക്റ്റ് ഇമെയിൽ സ്ഥിരീകരണം ആവശ്യമാകാം.",
  },
  pa: {
    divinityHarmony: localePacks.pa.divinityHarmony,
    cultureOfIndia: "ਭਾਰਤ ਦੀ ਸੰਸਕ੍ਰਿਤੀ",
    pravachanReading: "ਪ੍ਰਵਚਨ ਅਤੇ ਪੜ੍ਹਨਾ",
    vedicAstrology: "ਵੇਦ ਜ੍ਯੋਤਿਸ਼",
    myTraditionProfile: "ਮੇਰੀ ਪਰੰਪਰਾ ਪ੍ਰੋਫਾਈਲ",
    homeStateTradition: "ਮੂਲ ਰਾਜ / ਸੱਭਿਆਚਾਰਕ ਪਰੰਪਰਾ",
    calendarTradition: "ਪੰਚਾਂਗ ਪਰੰਪਰਾ",
    oneScriptureVerse: "ਇੱਕ ਸ਼ਾਸਤਰ ਸ਼ਲੋਕ",
    livingTraditions: "ਜੀਵੰਤ ਪਰੰਪਰਾਵਾਂ",
    pravachanGuide: "ਪ੍ਰਵਚਨ ਗਾਈਡ",
    dharmicReadingRoom: "ਧਾਰਮਿਕ ਪੜ੍ਹਾਈ ਕਮਰਾ",
    vedicAstrologyCentre: "ਵੇਦ ਜ੍ਯੋਤਿਸ਼ ਸਿੱਖਿਆ ਕੇਂਦਰ",
    yourSpiritualLibrary: "ਤੁਹਾਡੀ \u0A06\u0A07\u0A27\u0A3F\u0A06\u0A24\u0A2E\u0A3F\u0A15 \u0A32\u0A3E\u0A07\u0A2C\u0A30\u0A40",
    searchMantraPlaceholder: "ਸ਼ਿਵ, Krishna, ਸ਼ਾਂਤੀ…",
    gotraOptional: "ਗੋਤਰ ਜਾਂ ਪਰਿਵਾਰਕ ਪਰੰਪਰਾ (ਵਿਕਲਪਿਕ)",
    traditionsAndTemples: "ਪਰੰਪਰਾਵਾਂ ਅਤੇ ਮੰਦਰ",
    personalSpiritualHome: "ਨਿੱਜੀ \u0A06\u0A07\u0A27\u0A3F\u0A06\u0A24\u0A2E\u0A3F\u0A15 \u0A18\u0A30",
    returnToHome: "ਮੁੱਖ ਪੰਨੇ ਤੇ ਵਾਪਸ",
    pravachanCulturalReading: "ਪ੍ਰਵਚਨ ਅਤੇ ਸੱਭਿਆਚਾਰਕ ਪੜ੍ਹਾਈ ਕਮਰਾ",
    newsletterDesc:
      "ਨਵੇਂ ਮੰਤਰ, ਪਵਿੱਤਰ ਗ੍ਰੰਥ ਜੋੜ ਅਤੇ ਉਪਯੋਗੀ ਤਿਉਹਾਰ ਮਾਰਗਦਰਸ਼ਨ—ਰੋਜ਼ਾਨਾ ਸ਼ੋਰ ਬਿਨਾਂ।",
    subscribeAgreement:
      "ਮੈਂ ਈਮੇਲ ਅਪਡੇਟ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਸਹਿਮਤ ਹਾਂ। ਕਿਸੇ ਵੀ ਸੁਨੇਹੇ ਤੋਂ ਸਬਸਕ੍ਰਿਪਸ਼ਨ ਰੱਦ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ।",
    footerDisclaimer:
      "ਵਿਦਿਅਕ ਭਕਤੀ ਸਮੱਗਰੀ · ਮੁਹੂਰਤ ਅਤੇ ਔਪਚਾਰਿਕ ਸੰਸਕਾਰ ਯੋਗ ਖੇਤਰੀ ਸਰੋਤ ਨਾਲ ਪੁਸ਼ਟੀ ਕਰੋ।",
    heroDescription:
      "ਕਾਲਜੇਈ ਮੰਤਰ ਸੁਣੋ, ਲਾਈਵ ਮੰਦਰ ਦਰਸ਼ਨ ਅਨੁਭਵ ਕਰੋ, ਅਤੇ ਹਿੰਦੂ ਸ਼ਾਸਤਰਾਂ ਦਾ ਅਧਿਐਨ ਇੱਕ ਸੁੰਦਰ ਜੁੜੇ ਹੋਏ ਆਸ਼ਰੇ ਵਿੱਚ ਕਰੋ।",
    sacredWisdomLiving: "ਪਵਿੱਤਰ ਗਿਆਨ · ਜੀਵੰਤ ਪਰੰਪਰਾ",
    resources700: "700+ ਪਵਿੱਤਰ ਸਰੋਤ",
    liveTempleDiscovery: "ਲਾਈਵ ਮੰਦਰ ਖੋਜ",
    todaysIntention: "ਅੱਜ ਦਾ ਸੰਕਲਪ",
    peaceInEveryBreath: "ਹਰ ਸਾਹ ਵਿੱਚ ਸ਼ਾਂਤੀ",
    readWisdom: "ਗਿਆਨ ਪੜ੍ਹੋ",
    chooseSoundDarshan:
      "ਧੁਨੀ, ਦਰਸ਼ਨ ਜਾਂ ਸ਼ਾਸਤਰ ਚੁਣੋ—ਹਰ ਅਨੁਭਵ ਜਵਾਬ ਦਿੰਦਾ ਹੈ, ਨਵੀਨੀਕਰਨ ਹੁੰਦਾ ਹੈ ਅਤੇ ਤੁਹਾਡੇ ਨਾਲ ਚਲਦਾ ਹੈ।",
    designedAroundYou: "ਤੁਹਾਡੇ ਲਈ ਡਿਜ਼ਾਈਨ",
    fastDiscovery: "ਤੇਜ਼ ਖੋਜ",
    exploreTheGita: "Gita ਖੋਜੋ",
    backToDivinityHarmony: "Divinity Harmony ਤੇ ਵਾਪਸ",
    profileAcrossDevices:
      "ਤੁਹਾਡੀ ਪ੍ਰੋਫਾਈਲ, ਅਵਤਾਰ ਅਤੇ \u0A06\u0A07\u0A27\u0A3F\u0A06\u0A24\u0A2E\u0A3F\u0A15 ਪਸੰਦਗੀਆਂ ਡਿਵਾਈਸਾਂ ਵਿੱਚ ਜੁੜੀਆਂ ਰੱਖੋ।",
    authPoweredBy: "ਪ੍ਰਮਾਣੀਕਰਨ ਅਤੇ ਫਾਈਲ ਸਟੋਰੇਜ Supabase ਦੁਆਰਾ",
    authConfiguring: "ਖਾਤਾ ਸੇਵਾ ਕੌਂਫਿਗਰ ਹੋ ਰਹੀ ਹੈ",
    guestAccessAvailable:
      "ਮਹਿਮਾਨ ਪਹੁੰਚ ਉਪਲਬਧ। ਲੌਗਇਨ ਸਕ੍ਰਿਯ ਕਰਨ ਲਈ Supabase ਡਿਪਲਾਇਮੈਂਟ ਚਰ ਜੋੜੋ।",
    signInWithEmail: "ਆਪਣੇ ਖਾਤੇ ਲਈ ਵਰਤੇ ਈਮੇਲ ਨਾਲ ਸਾਈਨ ਇਨ ਕਰੋ।",
    password: "ਪਾਸਵਰਡ",
    forgotPassword: "ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?",
    createYourAccount: "ਆਪਣਾ ਖਾਤਾ ਬਣਾਓ",
    profileFollowsDevices: "ਤੁਹਾਡੀ ਪ੍ਰੋਫਾਈਲ ਸਾਰੇ ਡਿਵਾਈਸਾਂ ਵਿੱਚ ਤੁਹਾਡੇ ਨਾਲ ਰਹੇਗੀ।",
    emailConfirmationNote:
      "ਤੁਹਾਡੇ Supabase ਪ੍ਰੋਜੈਕਟ ਦੁਆਰਾ ਈਮੇਲ ਪੁਸ਼ਟੀ ਜ਼ਰੂਰੀ ਹੋ ਸਕਦੀ ਹੈ।",
  },
  ta: {
    dharmicReadingRoom: "\u0BA4\u0BBE\u0BB0\u0BCD\u0BAE\u0BBF\u0B95 \u0BB5\u0BBE\u0B9A\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1 \u0B85\u0BB1\u0BC8",
    heroDescription:
      "\u0BA8\u0BBF\u0BB2\u0BC8\u0BAF\u0BBE\u0BA9 \u0BAE\u0BAF\u0BCD\u0BA4\u0BBF\u0BB0\u0B99\u0BCD\u0B95\u0BB3\u0BC8\u0B95\u0BCD \u0B95\u0BC7\u0BB3\u0BCD\u0B95\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD, \u0BA8\u0BC7\u0BB0\u0B9F\u0BBF \u0B95\u0BCB\u0BAF\u0BBF\u0BB2\u0BCD \u0BA4\u0BB0\u0BCD\u0B9A\u0BA9\u0BA4\u0BCD\u0BA4\u0BC8 \u0B85\u0BA8\u0BC1\u0BAA\u0BB5\u0BBF\u0B95\u0BCD\u0B95\u0BB5\u0BC1\u0BAE\u0BCD, \u0B87\u0BA8\u0BCD\u0BA4\u0BC1 \u0BB6\u0BBE\u0BB8\u0BCD\u0BA4\u0BBF\u0BB0\u0B99\u0BCD\u0B95\u0BB3\u0BC8 \u0B92\u0BB0\u0BC1 \u0B85\u0BB4\u0B95\u0BBE\u0B95 \u0B87\u0BA3\u0BC8\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F \u0B85\u0B9F\u0BC8\u0B95\u0BCD\u0B95\u0BB2\u0BA4\u0BCD\u0BA4\u0BBF\u0BB2\u0BCD \u0BAA\u0B9F\u0BBF\u0BAF\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD.",
    resources700: "700+ \u0BAA\u0BC1\u0BA9\u0BBF\u0BA4 \u0BB5\u0BB3\u0B99\u0BCD\u0B95\u0BB3\u0BCD",
    chooseSoundDarshan:
      "\u0B92\u0BB2\u0BBF, \u0BA4\u0BB0\u0BCD\u0B9A\u0BA9\u0BAE\u0BCD \u0B85\u0BB2\u0BCD\u0BB2\u0BA4\u0BC1 \u0BB6\u0BBE\u0BB8\u0BCD\u0BA4\u0BBF\u0BB0\u0BAE\u0BCD \u0BA4\u0BC7\u0BB0\u0BCD\u0BA8\u0BCD\u0BA4\u0BC6\u0B9F\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD\u2014\u0B92\u0BB5\u0BCD\u0BB5\u0BCA\u0BB0\u0BC1 \u0B85\u0BA8\u0BC1\u0CAD\u0BB5\u0BAE\u0BC1\u0BAE\u0BCD \u0BAA\u0BA4\u0BBF\u0BB2\u0BB3\u0BBF\u0B95\u0BCD\u0B95\u0BBF\u0BB1\u0BA4\u0BC1, \u0BAA\u0BC1\u0BA4\u0BC1\u0BAA\u0BCD\u0BAA\u0BBF\u0B95\u0BCD\u0B95\u0BBF\u0BB1\u0BA4\u0BC1, \u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BC1\u0B9F\u0BA9\u0BCD \u0BA8\u0B95\u0BB0\u0BCD\u0B95\u0BBF\u0BB1\u0BA4\u0BC1.",
    watchDarshan: "\u0BA4\u0BB0\u0BCD\u0B9A\u0BA9\u0BA4\u0BCD\u0BA4\u0BC8 \u0BAA\u0BBE\u0BB0\u0BCD\u0B99\u0BCD\u0B95\u0BB3\u0BCD",
    profileAcrossDevices:
      "\u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0B9A\u0BC1\u0BAF\u0BB5\u0BBF\u0BB5\u0BB0\u0BAE\u0BCD, \u0B85\u0BB5\u0BA4\u0BBE\u0BB0\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BA6\u0BBE\u0BA4\u0BCD\u0BA4\u0BC0\u0B95 \u0BB5\u0BBF\u0BB0\u0BC1\u0BAA\u0BCD\u0BAA\u0B99\u0BCD\u0B95\u0BB3\u0BC8 \u0B9A\u0BBE\u0BA4\u0BA9\u0B99\u0BCD\u0B95\u0BB3\u0BBF\u0BB2\u0BCD \u0B87\u0BA3\u0BC8\u0B95\u0BCD\u0B95\u0BB5\u0BC1\u0BAE\u0BCD.",
    guestAccessAvailable:
      "\u0BB5\u0BBF\u0BB0\u0BC1\u0BA8\u0BCD\u0BA4\u0BBF\u0BA9\u0BB0\u0BCD \u0B85\u0BA3\u0BC1\u0B95\u0BB2\u0BCD \u0B95\u0BBF\u0B9F\u0BC8\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD. \u0B89\u0BB3\u0BCD\u0BA8\u0BC1\u0BB4\u0BC8\u0BB5\u0BC8 \u0B87\u0BAF\u0B95\u0BCD\u0B95 Supabase \u0BA8\u0BBF\u0BB1\u0BC1\u0BB5\u0BB2\u0BCD \u0BAE\u0BBE\u0B95\u0BB0\u0BBF\u0B95\u0BB3\u0BC8\u0B9A\u0BCD \u0B9A\u0BC7\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BB5\u0BC1\u0BAE\u0BCD.",
    emailConfirmationNote:
      "\u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD Supabase \u0BA4\u0BBF\u0B9F\u0BCD\u0B9F\u0BA4\u0BCD\u0BA4\u0BBF\u0BA9\u0BCD \u0BAE\u0BC2\u0BB2\u0BAE\u0BCD \u0BAE\u0BBF\u0BA9\u0BCD\u0BA9\u0B9E\u0BCD\u0B9A\u0BB2\u0BCD \u0B89\u0BB1\u0BC1\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BB2\u0BCD \u0BA4\u0BC7\u0BB5\u0BC8\u0BAA\u0BCD\u0BAA\u0B9F\u0BB2\u0BBE\u0BAE\u0BCD.",
  },
};

function escape(str) {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

const LABELS = { te: "Telugu", ml: "Malayalam", pa: "Punjabi", ta: "Tamil" };

for (const code of ["te", "ml", "pa", "ta"]) {
  const exportName = `${code}Pack`;
  const filePath = path.join(__dirname, `${code}-pack.mjs`);
  const mod = await import(`${pathToFileURL(filePath).href}?v=${Date.now()}`);
  const merged = { ...mod[exportName], ...FIXES[code] };
  const pack = {};
  for (const k of KEYS) {
    if (!merged[k]) throw new Error(`${code}: missing key ${k}`);
    pack[k] = merged[k];
  }
  if (!pack.exploreMantrasTemplate.includes("{count}")) {
    throw new Error(`${code}: exploreMantrasTemplate missing {count}`);
  }
  const lines = KEYS.map((k) => `  ${k}: "${escape(pack[k])}",`);
  const body = `/** Complete ${LABELS[code]} UI pack — 186 semantic keys. */
export const ${exportName} = {
${lines.join("\n")}
};
`;
  fs.writeFileSync(filePath, body, "utf8");
  console.log(`Wrote ${code}-pack.mjs (${KEYS.length} keys, ${Object.keys(FIXES[code]).length} fixes)`);
}

console.log("Done.");
