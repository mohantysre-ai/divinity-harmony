/**
 * Extract unique English strings from content sources for translation packs.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");

function extractSacredTexts() {
  const text = fs.readFileSync(path.join(root, "src/data/sacred-texts.ts"), "utf8");
  const strings = new Set();

  // titles from seed objects and arrays
  const titleRe = /title: ['"]([^'"]+)['"]/g;
  const traditionRe = /tradition: ['"]([^'"]+)['"]/g;
  const descRe = /description: ['`]([^'`]+)['`]/g;
  const topicRe = /topics: \[([^\]]+)\]/g;

  let m;
  while ((m = titleRe.exec(text))) strings.add(m[1]);
  while ((m = traditionRe.exec(text))) strings.add(m[1]);
  while ((m = descRe.exec(text))) strings.add(m[1]);

  const descTemplateRe = /description: `([^`]+)`/g;
  while ((m = descTemplateRe.exec(text))) strings.add(m[1]);

  while ((m = topicRe.exec(text))) {
    const items = m[1].match(/['"]([^'"]+)['"]/g);
    if (items) items.forEach((i) => strings.add(i.slice(1, -1)));
  }

  // minor upanishads etc in string arrays
  const arrayStrRe = /'([A-Za-z][^']*)'/g;
  const arrayBlocks = text.match(/\[[\s\S]*?\]/g) || [];
  for (const block of arrayBlocks) {
    if (block.includes("Upanishad") || block.includes("Purana") || block.includes("Temple")) {
      let s;
      const re = /'([^']+)'/g;
      while ((s = re.exec(block))) strings.add(s[1]);
    }
  }

  // categories
  const catMatch = text.match(/sacredTextCategories = \[([^\]]+)\]/);
  if (catMatch) {
    const re = /'([^']+)'/g;
    let s;
    while ((s = re.exec(catMatch[1]))) strings.add(s[1]);
  }

  return strings;
}

function extractMantras() {
  const data = JSON.parse(fs.readFileSync(path.join(root, "src/data/mantras.json"), "utf8"));
  const strings = new Set();
  for (const m of data.mantras) {
    strings.add(m.title);
    strings.add(m.description);
    strings.add(m.translation);
  }
  return strings;
}

function extractCulturePacks() {
  const text = fs.readFileSync(path.join(root, "src/data/culture-packs.ts"), "utf8");
  const strings = new Set();
  const re = /(?:name|language|calendar|script): "([^"]+)"/g;
  let m;
  while ((m = re.exec(text))) strings.add(m[1]);

  const arrRe = /(?:festivals|traditions|temples): \[([^\]]+)\]/g;
  while ((m = arrRe.exec(text))) {
    const items = m[1].match(/"([^"]+)"/g);
    if (items) items.forEach((i) => strings.add(i.slice(1, -1)));
  }
  return strings;
}

function extractPujas() {
  const text = fs.readFileSync(path.join(root, "src/pages/PriestDirectoryPage.tsx"), "utf8");
  const strings = new Set();
  const block = text.match(/const pujas: Puja\[\] = \[([\s\S]*?)\];/);
  if (!block) return strings;
  const re = /"([^"\\]+(?:\\.[^"\\]*)*)"/g;
  let m;
  while ((m = re.exec(block[1]))) strings.add(m[1]);
  return strings;
}

function extractDeities() {
  const text = fs.readFileSync(path.join(root, "src/data/deities.ts"), "utf8");
  const strings = new Set();
  const re = /(?:name|tradition|summary):['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(text))) strings.add(m[1]);
  const iconRe = /iconography:\[([^\]]+)\]/g;
  while ((m = iconRe.exec(text))) {
    const items = m[1].match(/'([^']+)'/g);
    if (items) items.forEach((i) => strings.add(i.slice(1, -1)));
  }
  const festRe = /festivals:\[([^\]]+)\]/g;
  while ((m = festRe.exec(text))) {
    const items = m[1].match(/'([^']+)'/g);
    if (items) items.forEach((i) => strings.add(i.slice(1, -1)));
  }
  return strings;
}

function extractTemples() {
  const text = fs.readFileSync(path.join(root, "src/data/temples.ts"), "utf8");
  const strings = new Set();
  const re = /(?:name|deity|city|state|type|timings):['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(text))) strings.add(m[1]);
  return strings;
}

function extractPriestCatalog() {
  const text = fs.readFileSync(path.join(root, "server/db.py"), "utf8");
  const strings = new Set();
  const rowRe = /\(\d+,\s*"[^"]+",\s*"[^"]+",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)"/g;
  let m;
  while ((m = rowRe.exec(text))) {
    strings.add(m[1]);
    m[2].split(",").forEach((lang) => strings.add(lang.trim()));
    m[3].split(",").forEach((svc) => strings.add(svc.trim()));
  }
  return strings;
}

function extractWisdom() {
  const text = fs.readFileSync(
    path.join(root, "src/pages/WisdomLivePage.tsx"),
    "utf8",
  );
  const strings = new Set();
  const re = /(?:name|language|topic|publisher|cadence): "([^"]+)"/g;
  let m;
  while ((m = re.exec(text))) {
    strings.add(m[1]);
    for (const segment of m[1].split("·")) {
      for (const part of segment.split(",")) {
        const piece = part.trim();
        if (piece) strings.add(piece);
      }
    }
  }
  return strings;
}

const sacred = extractSacredTexts();
const mantras = extractMantras();
const culture = extractCulturePacks();
const pujas = extractPujas();
const deityCatalog = extractDeities();
const templeCatalog = extractTemples();
const priestCatalog = extractPriestCatalog();
const wisdomCatalog = extractWisdom();

const all = new Set([
  ...sacred,
  ...mantras,
  ...culture,
  ...pujas,
  ...deityCatalog,
  ...templeCatalog,
  ...priestCatalog,
  ...wisdomCatalog,
]);
const sorted = [...all].sort();

const outPath = path.join(__dirname, "content-strings-en.json");
fs.writeFileSync(outPath, JSON.stringify(sorted, null, 2), "utf8");

console.log(JSON.stringify({
  sacred: sacred.size,
  mantras: mantras.size,
  culture: culture.size,
  pujas: pujas.size,
  deities: deityCatalog.size,
  temples: templeCatalog.size,
  priests: priestCatalog.size,
  wisdom: wisdomCatalog.size,
  totalUnique: all.size,
  outPath,
}, null, 2));
