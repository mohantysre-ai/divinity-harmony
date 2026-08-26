/**
 * Search multiple public image sources by mantra name (not one Wikimedia dump).
 * Sources tried in order: Openverse (aggregates Commons/Flickr/Met/etc.),
 * Wikimedia Commons search, Wikipedia page thumbnail, then curated deity art.
 *
 * Google Images cannot be scraped reliably or within ToS from automation;
 * Openverse is the open equivalent of a name-based image search.
 *
 * Run: node scripts/fetch-mantra-images.mjs
 * Optional: node scripts/fetch-mantra-images.mjs --only-missing
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const target = path.join(__dirname, '..', 'src', 'data', 'mantras.json');
const UA = 'DivinityHarmonyImageBot/1.1 (mantra image enrichment; contact: local rebuild)';
const onlyMissing = process.argv.includes('--only-missing');

const CURATED = {
  gayatri: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Gayatri1.jpg',
  ganesha: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Ganesha_Basohli_miniature_circa_1730_Dubost_p73.jpg',
  shiva: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Shiva_as_the_Lord_of_Dance_LACMA_edit.jpg',
  vishnu: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Vishnu_and_Lakshmi_on_Shesha_Naga%2C_ca_1870.jpg',
  krishna: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Radha_Krishna.jpg',
  rama: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Vishnu.jpg',
  durga: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Durga_Mahishasuramardini.jpg',
  kali: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Kali_by_Raja_Ravi_Varma.jpg',
  lakshmi: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Lakshmi.jpg',
  saraswati: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Saraswati.jpg',
  hanuman: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Hanuman.jpg',
  surya: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Surya_deva.jpg',
  murugan: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Kartikeya.jpg',
  brahma: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Brahma_on_hamsa.jpg',
  indra: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Indra%2C_Chief_of_the_Gods_LACMA_M.69.13.4_%281_of_5%29.jpg/1280px-Indra%2C_Chief_of_the_Gods_LACMA_M.69.13.4_%281_of_5%29.jpg',
  agni: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Agni_god_of_fire.jpg',
  varuna: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Varuna_deva.jpg',
  vayu: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Vayu_deva.jpg',
  yama: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Yama.jpg',
  kubera: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Kubera.jpg',
  dattatreya: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Dattatreya.jpg',
  ayyappa: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Ayyappan.jpg',
  jagannath: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Jagannath.jpg',
  venkateswara: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Tirupati_Balaji_Temple.jpg',
  meenakshi: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Meenakshi.jpg',
  narasimha: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Narasimha.jpg',
  sudarshana: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Sudarshana_Chakra.jpg',
  garuda: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Garuda_Indonesia.jpg',
  ganga: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Ganga_goddess.jpg',
  tulasi: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Ocimum_tenuiflorum.jpg',
  dhanvantari: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Dhanvantari.jpg',
  bhairava: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Kalabhairava.jpg',
  chandra: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Chandra_deva.jpg',
  shani: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Shani_deva.jpg',
  rahu: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Rahu.jpg',
  ketu: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Ketu.jpg',
  peace: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Om_symbol.svg/1024px-Om_symbol.svg.png',
};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function cleanTitle(title) {
  return title
    .replace(/\(.*?\)/g, '')
    .replace(/Full Version|Opening|Classic|Extended|Alt feed/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Distinct search phrases per mantra so results are title-specific, not one shared query. */
function searchQueriesFor(title) {
  const cleaned = cleanTitle(title);
  const queries = [`${cleaned} hindu`, cleaned];

  if (/gayatri/i.test(cleaned) && !/(shiva|durga|lakshmi|saraswati|hanuman|krishna|rama|vishnu|ganesh)/i.test(cleaned)) {
    queries.unshift('Goddess Gayatri Devi five faces painting');
  } else if (/ganesh|ganapati|vinayak/i.test(cleaned)) {
    queries.unshift('Lord Ganesha painting India');
  } else if (/hanuman/i.test(cleaned)) {
    queries.unshift('Lord Hanuman painting India');
  } else if (/shiva|rudra|linga|mrityunjaya|tandava|nataraja|bhairav|dakshinamurthy/i.test(cleaned)) {
    queries.unshift(`${cleaned} Lord Shiva`);
  } else if (/krishna|govinda|gita|madhura/i.test(cleaned)) {
    queries.unshift('Lord Krishna painting India');
  } else if (/rama|sita/i.test(cleaned)) {
    queries.unshift('Lord Rama Sita painting');
  } else if (/vishnu|narayana|narasimha|venkatesh|balaji|jagannath|vitthala/i.test(cleaned)) {
    queries.unshift(`${cleaned} deity`);
  } else if (/durga|kali|devi|chandi|lalita|annapurna|bhavani|meenakshi|kamakshi|tara|matangi|bagala|dhumavati|bhuvaneshwari|chhinnamasta|tripura/i.test(cleaned)) {
    queries.unshift(`${cleaned} goddess`);
  } else if (/lakshmi|kanakadhara|sri sukt/i.test(cleaned)) {
    queries.unshift('Goddess Lakshmi painting');
  } else if (/saraswati|sarasvati/i.test(cleaned)) {
    queries.unshift('Goddess Saraswati painting');
  } else if (/surya|aditya/i.test(cleaned)) {
    queries.unshift('Surya sun god chariot painting');
  } else if (/murugan|subramanya|kartikeya|skanda/i.test(cleaned)) {
    queries.unshift('Lord Kartikeya Murugan painting');
  } else if (/ayyappa/i.test(cleaned)) {
    queries.unshift('Lord Ayyappa Sabarimala');
  } else if (/dattatreya/i.test(cleaned)) {
    queries.unshift('Lord Dattatreya painting');
  } else if (/navagraha|chandra|shani|rahu|ketu|mangala|budha|shukra|guru|brihaspati/i.test(cleaned)) {
    queries.unshift(`${cleaned} graha deity`);
  }

  return [...new Set(queries)].slice(0, 3);
}

function curatedFor(title) {
  const v = title.toLowerCase();
  if (/ganesh|ganapati|vinayak/.test(v)) return CURATED.ganesha;
  if (/hanuman/.test(v)) return CURATED.hanuman;
  if (/gayatri/.test(v) && !/(shiva|durga|lakshmi|saraswati|hanuman|krishna|rama|vishnu|ganesh)/.test(v)) return CURATED.gayatri;
  if (/kali/.test(v)) return CURATED.kali;
  if (/meenakshi/.test(v)) return CURATED.meenakshi;
  if (/durga|devi|chandi|lalita|annapurna|bhavani|kamakshi|visalakshi|tara|matangi|bagala|dhumavati|bhuvaneshwari|chhinnamasta|tripura|soundarya|shodashi|sodashi/.test(v)) return CURATED.durga;
  if (/lakshmi|kanakadhara|sri sukt/.test(v)) return CURATED.lakshmi;
  if (/saraswati|sarasvati|medha/.test(v)) return CURATED.saraswati;
  if (/krishna|govinda|gita|radha|madhura|panduranga|vitthala/.test(v)) return CURATED.krishna;
  if (/rama|sita/.test(v)) return CURATED.rama;
  if (/narasimha/.test(v)) return CURATED.narasimha;
  if (/jagannath/.test(v)) return CURATED.jagannath;
  if (/venkatesh|balaji|tirupati/.test(v)) return CURATED.venkateswara;
  if (/sudarshan/.test(v)) return CURATED.sudarshana;
  if (/garuda/.test(v)) return CURATED.garuda;
  if (/vishnu|narayana|hayagriva|hari|achyuta|mukunda/.test(v)) return CURATED.vishnu;
  if (/bhairav/.test(v)) return CURATED.bhairava;
  if (/shiva|siva|rudra|linga|tandava|mrityunjaya|dakshinamurthy|nataraja|bilva/.test(v)) return CURATED.shiva;
  if (/murugan|kartikeya|subramanya|skanda/.test(v)) return CURATED.murugan;
  if (/ayyappa/.test(v)) return CURATED.ayyappa;
  if (/dattatreya/.test(v)) return CURATED.dattatreya;
  if (/dhanvantari/.test(v)) return CURATED.dhanvantari;
  if (/ganga|yamuna/.test(v)) return CURATED.ganga;
  if (/tulasi|tulsi/.test(v)) return CURATED.tulasi;
  if (/brahma|hiranyagarbha/.test(v)) return CURATED.brahma;
  if (/indra/.test(v)) return CURATED.indra;
  if (/agni/.test(v)) return CURATED.agni;
  if (/varuna/.test(v)) return CURATED.varuna;
  if (/vayu/.test(v)) return CURATED.vayu;
  if (/yama/.test(v)) return CURATED.yama;
  if (/kubera/.test(v)) return CURATED.kubera;
  if (/chandra/.test(v)) return CURATED.chandra;
  if (/shani/.test(v)) return CURATED.shani;
  if (/rahu/.test(v)) return CURATED.rahu;
  if (/ketu/.test(v)) return CURATED.ketu;
  if (/surya|aditya|navagraha|mangala|budha|shukra|guru|brihaspati/.test(v)) return CURATED.surya;
  return CURATED.peace;
}

function looksLikeOmOrGeneric(url) {
  if (!url) return true;
  const u = url.toLowerCase();
  return /om[_-]symbol|om\.svg|saraswati\.jpg$/.test(u) && false; // keep; uniqueness handled elsewhere
}

async function fetchJson(url, retries = 4) {
  let lastErr;
  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': UA,
          Accept: 'application/json',
        },
      });
      if (res.status === 429 || res.status === 503) {
        const wait = 1500 * (attempt + 1) ** 2;
        await sleep(wait);
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    } catch (err) {
      lastErr = err;
      await sleep(800 * (attempt + 1));
    }
  }
  throw lastErr || new Error('fetch failed');
}

async function searchOpenverse(query) {
  const api = new URL('https://api.openverse.org/v1/images/');
  api.searchParams.set('q', query);
  api.searchParams.set('page_size', '8');
  api.searchParams.set('mature', 'false');
  api.searchParams.set('extension', 'jpg,png');
  const data = await fetchJson(api.toString());
  const results = data?.results || [];
  for (const item of results) {
    const url = item.url || item.thumbnail;
    if (!url || !/^https?:\/\//i.test(url)) continue;
    // Prefer Wikimedia / museum hosts for stable hotlinking
    if (/wikimedia|metmuseum|artic\.edu|smithsonian|rijksmuseum|flickr/.test(url)) {
      return url.split('?')[0];
    }
  }
  const first = results[0];
  return first?.url ? first.url.split('?')[0] : null;
}

async function searchCommons(query) {
  const api = new URL('https://commons.wikimedia.org/w/api.php');
  api.searchParams.set('action', 'query');
  api.searchParams.set('format', 'json');
  api.searchParams.set('origin', '*');
  api.searchParams.set('generator', 'search');
  api.searchParams.set('gsrsearch', `filetype:bitmap ${query}`);
  api.searchParams.set('gsrnamespace', '6');
  api.searchParams.set('gsrlimit', '10');
  api.searchParams.set('prop', 'imageinfo');
  api.searchParams.set('iiprop', 'url|mime|size');
  api.searchParams.set('iiurlwidth', '1200');
  const data = await fetchJson(api.toString());
  const pages = data?.query?.pages ? Object.values(data.query.pages) : [];
  for (const page of pages) {
    const info = page.imageinfo?.[0];
    if (!info) continue;
    const mime = info.mime || '';
    if (!mime.startsWith('image/') || mime.includes('svg')) continue;
    const url = info.thumburl || info.url;
    if (url && /upload\.wikimedia\.org/.test(url)) return url.split('?')[0];
  }
  return null;
}

async function searchWikipediaThumb(titleHint) {
  const cleaned = cleanTitle(titleHint);
  const guesses = [
    cleaned.replace(/ Mantra.*$/i, '').trim(),
    cleaned.replace(/ Stotra.*$/i, '').trim(),
    cleaned.split(/\s+/).slice(0, 2).join(' '),
  ];
  for (const guess of guesses) {
    if (!guess || guess.length < 3) continue;
    const api = new URL('https://en.wikipedia.org/w/api.php');
    api.searchParams.set('action', 'query');
    api.searchParams.set('format', 'json');
    api.searchParams.set('origin', '*');
    api.searchParams.set('titles', guess);
    api.searchParams.set('prop', 'pageimages');
    api.searchParams.set('pithumbsize', '1000');
    api.searchParams.set('redirects', '1');
    try {
      const data = await fetchJson(api.toString(), 2);
      const page = Object.values(data?.query?.pages || {})[0];
      const src = page?.thumbnail?.source;
      if (src && !/Ambox|Question_book|Wiki_letter/i.test(src)) return src.split('?')[0];
    } catch {
      // ignore
    }
    await sleep(250);
  }
  return null;
}

async function resolveImage(title, usedUrls) {
  const queries = searchQueriesFor(title);
  for (const q of queries) {
    try {
      const openverse = await searchOpenverse(q);
      if (openverse && !usedUrls.has(openverse)) return { url: openverse, source: 'openverse' };
    } catch {
      // try next source
    }
    await sleep(350);
    try {
      const commons = await searchCommons(q);
      if (commons && !usedUrls.has(commons)) return { url: commons, source: 'commons' };
    } catch {
      // try next
    }
    await sleep(350);
  }

  try {
    const wiki = await searchWikipediaThumb(title);
    if (wiki && !usedUrls.has(wiki)) return { url: wiki, source: 'wikipedia' };
  } catch {
    // fall through
  }

  const curated = curatedFor(title);
  return { url: curated, source: 'curated' };
}

function needsRefresh(mantra) {
  if (!mantra.imageUrl) return true;
  // Force refresh of heavily shared / wrong defaults from the previous run
  const shared = [
    'Saraswati.jpg',
    'Surya_deva.jpg',
    'Gayatri_mantra',
    'Shiva_as_the_Lord_of_Dance',
    'Radha_Madhavam',
    'Vishnu_and_Lakshmi',
    'Durga_Mahishasuramardini',
    'Mahishasuramardini',
    'kalighat_school',
  ];
  return shared.some((s) => mantra.imageUrl.includes(s));
}

const data = JSON.parse(fs.readFileSync(target, 'utf8'));
const usedUrls = new Set();
let updated = 0;
let sources = { openverse: 0, commons: 0, wikipedia: 0, curated: 0 };

for (const mantra of data.mantras) {
  if (onlyMissing && mantra.imageUrl && !needsRefresh(mantra)) {
    usedUrls.add(mantra.imageUrl);
    continue;
  }

  const { url, source } = await resolveImage(mantra.title, usedUrls);
  usedUrls.add(url);
  sources[source] = (sources[source] || 0) + 1;

  if (mantra.imageUrl !== url) {
    mantra.imageUrl = url;
    updated += 1;
  }
  console.log(`${mantra.id}: ${mantra.title} [${source}] -> ${url.split('/').pop()?.slice(0, 80)}`);
  await sleep(500);
}

fs.writeFileSync(target, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
console.log(
  `Updated ${updated}/${data.mantras.length}. Sources: ${JSON.stringify(sources)}. Unique URLs: ${usedUrls.size}`,
);
