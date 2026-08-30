/**
 * Post-process Odia content translations: manual overrides + re-translate Latin remnants.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import translate from "google-translate-api-x";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const orPath = path.join(__dirname, "content-translations-or.json");
const or = JSON.parse(fs.readFileSync(orPath, "utf8"));

const manualOr = {
  "1–3 hours": "୧–୩ ଘଣ୍ଟା",
  "2–3 hours": "୨–୩ ଘଣ୍ଟା",
  "2–4 hours": "୨–୪ ଘଣ୍ଟା",
  "3–5 hours": "୩–୫ ଘଣ୍ଟା",
  "3–6 hours": "୩–୬ ଘଣ୍ଟା",
  "45–90 minutes": "୪୫–୯୦ ମିନିଟ",
  "Rigveda Samhita": "ଋଗ୍ୱେଦ ସଂହିତା",
  "Samaveda Samhita": "ସାମବେଦ ସଂହିତା",
  "Shukla Yajurveda": "ଶୁକ୍ଲ ଯଜୁର୍ବେଦ",
  "Krishna Yajurveda": "କୃଷ୍ଣ ଯଜୁର୍ବେଦ",
  "Atharvaveda Samhita": "ଅଥର୍ବବେଦ ସଂହିତା",
  "Bhagavad Gita": "ଶ୍ରୀମଦ୍ଭଗବଦ୍ ଗୀତା",
  "Gayatri Mantra": "ଗାୟତ୍ରୀ ମନ୍ତ୍ର",
  "Griha Pravesh & Vastu Shanti": "ଗୃହ ପ୍ରବେଶ ଓ ବାସ୍ତୁ ଶାନ୍ତି",
  "Satyanarayan Puja": "ସତ୍ୟନାରାୟଣ ପୂଜା",
  "Navagraha Homa": "ନବଗ୍ରହ ହୋମ",
  "Shraddha & Pitru Tarpana": "ଶ୍ରାଦ୍ଧ ଓ ପିତୃ ତର୍ପଣ",
  "Ganapati Puja": "ଗଣପati ପୂଜା",
  "Wedding Rituals": "ବିବାହ ସଂସ୍କାର",
  "Purification and auspicious entry into a new home.": "ନୂଆ ଘରରେ ଶୁଦ୍ଧିକରଣ ଓ ଶୁଭ ପ୍ରବେଶ।",
  "A Vishnu observance commonly offered for gratitude and family welfare.": "କୃତଜ୍ଞତା ଓ ପରିବାର କଲ୍ୟାଣ ପାଇଁ ସାଧାରଣତଃ ଅର୍ପita ଏକ ବିଷ୍ଣୁ ଅନୁଷ୍ଠାନ।",
  "Traditional worship of the nine grahas through mantra and fire offerings.": "ମନ୍ତ୍ର ଓ ଅଗ୍ନି ବଳି ମାଧ୍ୟମରେ ନବଗ୍ରହଙ୍କ ପାରମ୍ପାରିକ ଉପାସନା।",
  "Ancestral remembrance according to family and regional custom.": "ପାରିବାରିକ ଓ ଅଞ୍ଚଳୀୟ ରୀତି ଅନୁଯାୟୀ ପୂର୍ବପୁରୁଷ ସ୍ମରଣ।",
  "Invocation of Shri Ganesha before new beginnings and ceremonies.": "ନୂଆ ଆରମ୍ଭ ଓ ଅନୁଷ୍ଠାନ ପୂର୍ବରୁ ଶ୍ରୀ ଗଣେଶଙ୍କ ଆବାହନ।",
  "Vivaha samskara joining the couple through sacred vows and tradition.": "ପବିତ୍ର ଶପଥ ଓ ପରମ୍ପରା ମାଧ୍ୟମରେ ଦମ୍ପତିଙ୍କୁ ଯୋଡ଼ିବା ବିବାହ ସଂସ୍କାର।",
  "${title} belongs to the wider Upanishadic heritage and is indexed here for its contemplative, devotional, yogic or renunciant teachings.":
    "${title} ବିସ୍ତୃତ ଉପନିଷଦିକ ଐତିହ୍ୟର ଅଂଶ ଏବଂ ଏହାର ଧ୍ୟାନ, ଭକ୍ତି, ଯୋଗ କିମ୍ବା ତ୍ୟାଗ ଶିକ୍ଷା ପାଇଁ ଏଠାରେ ସୂଚୀବଦ୍ଧ।",
  "A guide to the principal sacred narratives, relationships and theological roles associated with ${name}.":
    "${name} ସହ ଜଡିତ ମୁଖ୍ୟ ପବିତ୍ର କାହାଣୀ, ସମ୍ପର୍କ ଓ ତାତ୍ତ୍ୱିକ ଭୂମିକା ପାଇଁ ଏକ ମାର୍ଗଦର୍ଶିକା।",
  "A guide to the worship traditions, annual celebrations, local customs and cultural heritage associated with ${place}.":
    "${place} ସହ ଜଡିତ ପୂଜା ପରମ୍ପରା, ବାର୍ଷିକ ଉତ୍ସବ, ସ୍ଥାନୀୟ ରୀତିନୀତି ଓ ସାଂସ୍କୃତିକ ଐତିହ୍ୟ ପାଇଁ ଏକ ମାର୍ଗଦର୍ଶିକା।",
};

manualOr["Ganapati Puja"] = "ଗଣପati ପୂଜା".replace("Ganapati", "ଗଣେଶ");
manualOr["Ganapati Puja"] = "ଗଣେଶ ପୂଜା";

const termShield = {
  Shruti: "ଶ୍ରୁତି", Vedic: "ବୈଦିକ", Vedas: "ବେଦ", Upanishad: "ଉପନିଷଦ", Upanishads: "ଉପନିଷଦ",
  Upanishadic: "ଉପନିଷଦିକ", Purana: "ପୁରାଣ", Puranas: "ପୁରାଣ", Vaishnava: "ବୈଷ୍ଣବ", Shaiva: "ଶୈବ",
  Shakta: "ଶାକ୍ତ", Mahapurana: "ମହାପୁରାଣ", dharma: "ଧର୍ମ", bhakti: "ଭକ୍ତି", yoga: "ଯୋଗ", mantra: "ମନ୍ତ୍ର",
  Shiva: "ଶିବ", Vishnu: "ବିଷ୍ଣୁ", Krishna: "କୃଷ୍ଣ", Rama: "ରାମ", Ganesha: "ଗଣେଶ", Hanuman: "ହନୁମାନ",
  Durga: "ଦୁର୍ଗା", Lakshmi: "ଲକ୍ଷ୍ମୀ", Saraswati: "ସରସ୍ୱତୀ", Devi: "ଦେବୀ", Rudra: "ରୁଦ୍ର", Agni: "ଅଗ୍ନି",
  Surya: "ସୂର୍ଯ୍ୟ", Brahman: "ବ୍ରହ୍ମ", atman: "ଆତ୍ମା", moksha: "ମୋକ୍ଷ", guru: "ଗୁରୁ", yajna: "ଯଜ୍ଞ",
  samadhi: "ସମାଧି", prana: "ପ୍ରାଣ", Om: "ଓଁ", heritage: "ଐତିହ୍ୟ", divine: "ଦିବ୍ୟ", Divine: "ଦିବ୍ୟ",
  Lord: "ଭଗବାନ", Goddess: "ଦେବୀ", Chaitanya: "ଚୈତନ୍ୟ", Mahaprabhu: "ମହାପ୍ରଭୁ", Rigveda: "ଋଗ୍ୱେଦ",
  Samaveda: "ସାମବେଦ", Yajurveda: "ଯଜୁର୍ବେଦ", Atharvaveda: "ଅଥର୍ବବେଦ", Gita: "ଗୀତା", Advaita: "ଅଦ୍ୱੈତ",
  Vedanta: "ବେଦାନ୍ତ", Narayana: "ନାରାୟଣ", Jagannath: "ଜଗନ୍ନାଥ", Odisha: "ଓଡ଼ିଶା", pilgrimage: "ତୀର୍ଥଯାତ୍ରା",
  festival: "ଉତ୍ସବ", worship: "ଉପାସନା", devotion: "ଭକ୍ତି", meditation: "ଧ୍ୟାନ", knowledge: "ଜ୍ଞାନ",
  liberation: "ମୁକ୍ତି", sacrifice: "ଯଜ୍ଞ", ritual: "କର୍ମକାଣ୍ଡ", ethics: "ନୀତି", medicine: "ଔଷଧ",
  healing: "ଚିକିତ୍ସା", creation: "ସୃଷ୍ଟି", cosmology: "ବ୍ରହ୍ମାଣ୍ଡ", consciousness: "ଚେତନା", mind: "ମନ",
  death: "ମୃତ୍ୟୁ", immortality: "ଅମରତ୍ୱ", renunciation: "ତ୍ୟାଗ", action: "କର୍ମ", duty: "କର୍ତ୍ତବ୍ୟ",
  wisdom: "ପ୍ରଜ୍ଞା", peace: "ଶାନ୍ତି", prosperity: "ସମୃଦ୍ଧି", obstacles: "ବାଧା", Guide: "ମାର୍ଗଦର୍ଶିକା",
  guide: "ମାର୍ଗଦର୍ଶିକା", traditions: "ପରମ୍ପରା", tradition: "ପରମ୍ପରା", calendar: "ପଞ୍ଜିକା",
  hours: "ଘଣ୍ଟା", minutes: "ମିନିଟ", Andhra: "ଆନ୍ଧ୍ର", Pradesh: "ପ୍ରଦେଶ", Pradesh: "ପ୍ରଦେଶ",
  Maharashtra: "ମହାରାଷ୍ଟ୍ର", Karnataka: "କର୍ଣାଟକ", Kerala: "କେରଳ", Gujarat: "ଗୁଜରାଟ", Punjab: "ପଞ୍ଜାବ",
  Rajasthan: "ରାଜସ୍ଥାନ", Bengal: "ବଙ୍ଗ", Tamil: "ତାମିଲ", Nadu: "ନାଡୁ", Pradesh: "ପ୍ରଦେଶ",
  Hindi: "ହିନ୍ଦୀ", Telugu: "ତେଲୁଗୁ", Kannada: "କନ୍ନଡ", Malayalam: "ମଲୟାଳମ", Gujarati: "ଗୁଜରାଟୀ",
  Marathi: "ମରାଠୀ", Bengali: "ବଙ୍ଗଳୀ", Assamese: "ଅସମୀୟ", Konkani: "କୋଙ୍କଣୀ", Punjabi: "ପଞ୍ଜାବୀ",
  Odia: "ଓଡ଼ିଆ", English: "ଇଂରାଜୀ", Latin: "ଲାଟିନ", Multiple: "ବହୁ", Buddhist: "ବୌଦ୍ଧ",
  Indigenous: "ସ୍ୱତନ୍ତ୍ର", sacred: "ପବିତ୍ର", Sacred: "ପବିତ୍ର", temple: "ମନ୍ଦିର", Temple: "ମନ୍ଦିର",
  temples: "ମନ୍ଦିର", Monastery: "ମଠ", worship: "ଉପାସନା", festivals: "ଉତ୍ସବ", Diwali: "ଦୀପାବଳି",
  Holi: "ହୋଲି", Navaratri: "ନବରାତ୍ରି", Janmashtami: "ଜନ୍ମାଷ୍ଟମୀ", Shivaratri: "ଶିବରାତ୍ରି",
  Sankranti: "ସଂକ୍ରା�nti", Ugadi: "ଉଗାଦି", Onam: "ଓଣମ", Vishu: "ବିଷୁ", Pongal: "ପଙ୍ଗଲ",
  Ratha: "ରଥ", Yatra: "ଯାତ୍ରା", Raja: "ରଜ", Parba: "ପର୍ବ", Durga: "ଦୁର୍ଗା", Puja: "ପୂଜା",
};

function shieldTerms(text) {
  let out = text;
  const tokens = new Map();
  let i = 0;
  const entries = Object.entries(termShield).sort((a, b) => b[0].length - a[0].length);
  for (const [en, orVal] of entries) {
    const re = new RegExp(`\\b${en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g");
    out = out.replace(re, () => {
      const tok = `__T${i++}__`;
      tokens.set(tok, orVal);
      return tok;
    });
  }
  return { shielded: out, tokens };
}

function unshield(text, tokens) {
  let out = text;
  for (const [tok, val] of tokens) out = out.split(tok).join(val);
  return out;
}

function hasLatin(s) {
  return /[A-Za-z]{2,}/.test(s.replace(/\$\{[^}]+\}/g, "").replace(/__T\d+__/g, ""));
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function retranslate(en) {
  const { shielded, tokens } = shieldTerms(en);
  const phMap = new Map();
  let pi = 0;
  const withPh = shielded.replace(/\$\{[^}]+\}/g, (m) => {
    const k = `__PH${pi++}__`;
    phMap.set(k, m);
    return k;
  });
  const r = await translate(withPh, { from: "en", to: "or", client: "gtx" });
  let val = r.text;
  for (const [k, v] of phMap) val = val.split(k).join(v);
  val = unshield(val, tokens);
  return val.replace(/\s*\|\s*$/g, "।").replace(/\s+/g, " ").trim();
}

for (const [k, v] of Object.entries(manualOr)) or[k] = v;

const needsFix = Object.keys(or).filter((k) => hasLatin(or[k]));
console.log(`Re-translating ${needsFix.length} Odia entries...`);

let done = 0;
for (const k of needsFix) {
  try {
    or[k] = await retranslate(k);
  } catch {
    /* keep */
  }
  done++;
  if (done % 25 === 0) process.stdout.write(`\r${done}/${needsFix.length}`);
  await sleep(180);
}

console.log(`\nRemaining Latin: ${Object.values(or).filter(hasLatin).length}`);
fs.writeFileSync(orPath, JSON.stringify(or, null, 2), "utf8");
console.log(`Wrote ${Object.keys(or).length} keys to ${orPath}`);
