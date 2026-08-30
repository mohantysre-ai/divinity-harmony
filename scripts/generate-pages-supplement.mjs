/**
 * Generates scripts/packs/pages-supplement.json for new page UI keys.
 * Run: node scripts/generate-pages-supplement.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const or = {
  panchangDisclaimer:
    "ତାରିଖ ଓ ଅବସ୍ଥାନ ଉପରେ ଆଧାରିତ ଦୈନିକ ଆଧ୍ୟାତ୍ମିକ ସମୀକ୍ଷା। ସଠିକ୍ ମୁହୂର୍ତ୍ତ ଓ ସୀମା ସମୟ ପାଇଁ ସ୍ଥାନୀୟ ପଞ୍ଜିକା ସହ ନିଶ୍ଚିତ କରନ୍ତୁ।",
  divineForms: "ଦିବ୍ୟ ସ୍ୱରୂପ",
  deityEncyclopediaDesc:
    "ପବିତ୍ର କାହାଣୀ, ପ୍ରତୀକ, ଉତ୍ସବ, ମନ୍ତ୍ର ଓ ସଂଲଗ୍ନ ଶାସ୍ତ୍ର ଅନ୍ୱେଷଣ କରନ୍ତୁ।",
  allDeities: "ସମସ୍ତ ଦେବତା",
  iconographyAndSymbols: "ପ୍ରତୀକ ଓ ଚିହ୍ନ",
  sacredFestivalsHeading: "ପବିତ୍ର ଉତ୍ସବ",
  relatedMantrasBtn: "ସମ୍ବନ୍ଧିତ ମନ୍ତ୍ର",
  readSacredLoreBtn: "ପବିତ୍ର କଥା ପଢ଼ନ୍ତୁ",
  sacredGeography: "ପବିତ୍ର ଭୂଗୋଳ",
  templeLocatorDesc:
    "ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ହିନ୍ଦୁ ମନ୍ଦିର ଆବିଷ୍କାର କରନ୍ତୁ ଓ ଆପଣଙ୍କ ଅବସ୍ଥାନ ଅନୁସାରେ ନିର୍ଦେଶିକା ଛାଞ୍ଟିବେ।",
  searchTemplePlaceholder: "ମନ୍ଦିର, ଦେବତା, ସହର କିମ୍ବା ରାଜ୍ୟ ଖୋଜନ୍ତୁ",
  typicalHoursLabel: "ସାଧାରଣ ସମୟ",
  mapAttribution:
    "ମାନଚିତ୍ର ତଥ୍ୟ © OpenStreetMap ଅବଦାନକାରୀ। ଉତ୍ସବରେ ସମୟ ବଦଳିପାରେ; ଯାତ୍ରା ପୂର୍ବେ ସିଧାସଳଖ ନିଶ୍ଚିତ କରନ୍ତୁ।",
  liveNowMultiSource: "ଏବେ ଲାଇଭ · ବହୁ-ଉତ୍ସ ଅନ୍ୱେଷଣ",
  liveDarshanIntro:
    "YouTube ଲାଇଭ ଓ LiveDarshanHub ମାଧ୍ୟମରେ ମନ୍ଦିର ସ୍ଟ୍ରିମ ଆବିଷ୍କାର। API କି ଲାଗେ ନାହିଁ, ନକଲ ଦୂର ହୁଏ, ପ୍ରତି ୫ ମିନିଟରେ ନବୀକରଣ।",
  searchingLiveSources: "ଲାଇଭ ମନ୍ଦିର ଉତ୍ସ ଖୋଜା ଯାଉଛି…",
  liveNowCountTemplate: "ଏବେ ଲାଇଭ ({count})",
  streamLiveNotice:
    "ଶେଷ ନବୀକରଣରେ ଏହି ସ୍ଟ୍ରିମ LIVE ଚିହ୍ନିତ। ଦାନ କିମ୍ବା ଲେନଦେନ ପୂର୍ବେ ବିଚାର କରନ୍ତୁ।",
  sanatanaKnowledgeLibrary: "ସନାତନ ଜ୍ଞାନ ଭଣ୍ଡାର",
  sacredTextsLibraryDesc:
    "ବେଦ, ଉପନିଷଦ, ପୁରାଣ, ଗୀତା, କାହାଣୀ, ଦର୍ଶନ, ଦେବତା, ବେଦିକ ସ୍ତୋତ୍ର, ମନ୍ଦିର, ଗୁରୁ, ପାରିବାରିକ ଧର୍ମ ଓ ପୂର୍ବପୁରୁଷଙ୍କ ପରମ୍ପରା।",
  knowledgePathsTemplate: "{count} ଜ୍ଞାନ ପଥ",
  resourcesCountTemplate: "{count} ସମ୍ବଳ",
  showingResourcesTemplate: "{shown} / {total} ସମ୍ବଳ ଦେଖାଯାଉଛି",
  manyCalendarsTagline: "ଅନେକ ପଞ୍ଜିକା · ଅନେକ ଜୀବନ୍ତ ପରମ୍ପରା",
  cultureIndiaIntro:
    "ଗୋଟିଏ ଅଞ୍ଚଳିକ ଅଭ୍ୟାସ ସବୁ ପରିବାର ଉପରେ ଥୋପିବା ବିନା ରାଜ୍ୟ ଓ କେନ୍ଦ୍ରଶାସିତ ଅଞ୍ଚଳର ସଂସ୍କୃତି ଅନ୍ୱେଷଣ କରନ୍ତୁ।",
  searchCulturePlaceholder: "କର୍ଣାଟକ, ଜଗନ୍ନାଥ, ଦୁର୍ଗା ପୂଜା, ତାମିଲ… ଖୋଜନ୍ତୁ",
  culturePacksNoticeTemplate:
    "{count} ଆଞ୍ଚଳିକ ସଂସ୍କୃତି ପ୍ୟାକ। ସମ୍ପାଦନା ବିବରଣୀ ପରମ୍ପରା ଚିହ୍ନଟ କରେ, ଗୋଟିଏ ବହୁବଳୀ କ୍ରମ ଘୋଷଣା କରେ ନାହିଁ।",
  templesLabelPrefix: "ମନ୍ଦିର",
  tapToCount: "ଗଣନା ପାଇଁ ଟାପ୍",
  thisMalaTemplate: "ଏହି ମାଳା {current}/108",
  roundsTemplate: "{count} ଚକ୍ର",
  manualScriptSelection:
    "ମାନୁଆଲ୍ ଚୟନ। ଏହା ଲିପି ବଦଳାଏ, ପବିତ୍ର ଶବ୍ଦ ନୁହେଁ।",
  spokenTextFallback: "ରେକର୍ଡିଂ ଅନୁପଲବ୍ଧ ହେଲେ କଥିତ-ପାଠ ବିକଳ୍ପ",
  audioCompactViewNote:
    "ସଂକ୍ଷିପ୍ତ ଅଡ଼ିଓ ଦୃଶ୍ୟ। Play ଚାପିବା ପରେ YouTube ପ୍ଲେୟର ଦେଖାଯିବ।",
  openScheduleLibrary: "ବର୍ତ୍ତମାନର ସୂଚୀ/ଭଣ୍ଡାର ଖୋଲନ୍ତୁ",
  publisherCopyrightNote:
    "ପ୍ରକାଶକ ଓ ଅଧିକୃତ ସଂସ୍ଥାକୁ ଲିଙ୍କ କରାଯାଏ। ସ୍ୱତ୍ୱ ସମ୍ପୂର୍ଣ୍ଣ ସଂସ୍କରଣ ଅନୁମତି କିମ୍ବା ଅଧିକୃତ ଫିଡ୍ ମାଧ୍ୟମରେ ମାତ୍ର।",
  regionalRitualGuidance: "ଆଞ୍ଚଳିକ ବିଧି ମାର୍ଗଦର୍ଶନ",
  priestHeroTitle: "ପୂଜାରୀ ଖୋଜନ୍ତୁ ଓ ବକିଂ ପୂର୍ବେ ପୂଜା ବୁଝନ୍ତୁ",
  priestHeroDesc:
    "ସକ୍ରିୟ ସ୍ଥାନୀୟ ନିର୍ଦେଶିକାରେ ଫୋନ, ସମୀକ୍ଷା ଓ ଉପଲବ୍ଧତା ଖୋଜନ୍ତୁ। ଅଯାଞ୍ଚିତ ବ୍ୟକ୍ତିଗତ ନମ୍ବର କପି କରାଯାଏ ନାହିଁ।",
  searchPujaPlaceholder: "ସହର, ଭାଷା କିମ୍ବା ପୂଜା ଖୋଜନ୍ତୁ",
  verifyDirectoryLinks:
    "ଲିଙ୍କ Google Maps କିମ୍ବା Sulekha ଫଳାଫଳ ଖୋଲେ—ସମୀକ୍ଷା ଓ ଯୋଗାଯୋଗ ନିଜେ ଯାଞ୍ଚ କରନ୍ତୁ।",
  backToCulturePacks: "ସମସ୍ତ ସଂସ୍କୃତି ପ୍ୟାକ",
  viewCultureDetails: "ସଂସ୍କୃତି ବିବରଣୀ ଦେଖନ୍ତୁ",
  openExternalPravachan: "ବାହ୍ୟ ପ୍ରବଚନ ଖୋଲନ୍ତୁ",
};

const hi = {
  panchangDisclaimer:
    "तिथि और स्थान पर आधारित दैनिक आध्यात्मिक अवलोकन। सटीक मुहूर्त और सीमा समय के लिए क्षेत्रीय पंचांग से पुष्टि करें।",
  divineForms: "दिव्य स्वरूप",
  deityEncyclopediaDesc:
    "पवित्र कथाएँ, प्रतीक, उत्सव, मंत्र और संबंधित शास्त्र देखें।",
  allDeities: "सभी देवता",
  iconographyAndSymbols: "प्रतीक और चिह्न",
  sacredFestivalsHeading: "पवित्र उत्सव",
  relatedMantrasBtn: "संबंधित मंत्र",
  readSacredLoreBtn: "पवित्र कथा पढ़ें",
  sacredGeography: "पवित्र भूगोल",
  templeLocatorDesc:
    "महत्वपूर्ण हिंदू मंदिर खोजें और अपने स्थान के अनुसार निर्देशिका क्रमबद्ध करें।",
  searchTemplePlaceholder: "मंदिर, देवता, शहर या राज्य खोजें",
  typicalHoursLabel: "सामान्य समय",
  mapAttribution:
    "मानचित्र डेटा © OpenStreetMap योगदानकर्ता। उत्सवों में समय बदल सकता है; यात्रा से पहले पुष्टि करें।",
  liveNowMultiSource: "अभी लाइव · बहु-स्रोत खोज",
  liveDarshanIntro:
    "YouTube लाइव और LiveDarshanHub से मंदिर स्ट्रीम खोजे जाते हैं। कोई API कुंजी नहीं, डुप्लिकेट हटाए जाते हैं, हर 5 मिनट में ताज़ा।",
  searchingLiveSources: "लाइव मंदिर स्रोत खोजे जा रहे हैं…",
  liveNowCountTemplate: "अभी लाइव ({count})",
  streamLiveNotice:
    "अंतिम ताज़ाकरण पर यह स्ट्रीम LIVE चिह्नित थी। दान या लेनदेन से पहले विवेक रखें।",
  sanatanaKnowledgeLibrary: "सनातन ज्ञान पुस्तकालय",
  sacredTextsLibraryDesc:
    "वेद, उपनिषद, पुराण, गीता, कथाएँ, दर्शन, देवता, वैदिक स्तोत्र, मंदिर, गुरु, पारिवारिक धर्म और पूर्वज परंपराएँ।",
  knowledgePathsTemplate: "{count} ज्ञान पथ",
  resourcesCountTemplate: "{count} संसाधन",
  showingResourcesTemplate: "{shown} / {total} संसाधन दिखाए जा रहे",
  manyCalendarsTagline: "अनेक पंचांग · अनेक जीवंत परंपराएँ",
  cultureIndiaIntro:
    "एक क्षेत्रीय अभ्यास सभी पर थोपे बिना राज्य और केंद्रशासित क्षेत्र की संस्कृति देखें।",
  searchCulturePlaceholder: "कarnataka, जगन्नाथ, दुर्गा पूजा, तमिल… खोजें",
  culturePacksNoticeTemplate:
    "{count} क्षेत्रीय संस्कृति पैक। संपादकीय विवरण परंपरा पहचानते हैं, एक सर्व-विधि नहीं घोषित करते।",
  templesLabelPrefix: "मंदिर",
  tapToCount: "गिनने के लिए टैप",
  thisMalaTemplate: "इस माला {current}/108",
  roundsTemplate: "{count} चक्र",
  manualScriptSelection:
    "मैनुअल चयन। यह लिपि बदलता है, पवित्र शब्द नहीं।",
  spokenTextFallback: "रिकॉर्डिंग अनुपलब्ध होने पर बोला-पाठ विकल्प",
  audioCompactViewNote:
    "संक्षिप्त ऑडियो दृश्य। Play दबाने के बाद YouTube प्लेयर दिखता है।",
  openScheduleLibrary: "वर्तमान अनुसूची/पुस्तकालय खोलें",
  publisherCopyrightNote:
    "प्रकाशक और आधिकारिक संगठनों से लिंक। पूर्ण कॉपीराइट संस्करण केवल अनुमति या अधिकृत फ़ीड से।",
  regionalRitualGuidance: "क्षेत्रीय विधि मार्गदर्शन",
  priestHeroTitle: "पुजारी खोजें और बुकिंग से पहले पूजा समझें",
  priestHeroDesc:
    "सक्रिय स्थानीय निर्देशिका में फोन, समीक्षा और उपलब्धता खोजें। अप्रमाणित नंबर कॉपी नहीं किए जाते।",
  searchPujaPlaceholder: "शहर, भाषा या पूजा खोजें",
  verifyDirectoryLinks:
    "लिंक Google Maps या Sulekha परिणाम खोलते हैं—समीक्षा और संपर्क स्वयं जाँचें।",
  backToCulturePacks: "सभी संस्कृति पैक",
  viewCultureDetails: "संस्कृति विवरण देखें",
  openExternalPravachan: "बाह्य प्रवचन खोलें",
};

const packs = { or, hi };
for (const loc of ["bn", "gu", "mr", "ta", "te", "ml", "kn", "pa", "as"]) {
  // Filled by: node scripts/packs/translate-ui-supplements.mjs
  packs[loc] = packs[loc] ?? {};
}

const outPath = path.join(__dirname, "packs/pages-supplement.json");
fs.writeFileSync(outPath, JSON.stringify(packs, null, 2) + "\n");
console.log("Wrote", outPath);
