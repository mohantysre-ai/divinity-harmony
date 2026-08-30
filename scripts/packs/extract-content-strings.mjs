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

const sacred = extractSacredTexts();
const mantras = extractMantras();
const culture = extractCulturePacks();
const pujas = extractPujas();

const all = new Set([...sacred, ...mantras, ...culture, ...pujas]);
const sorted = [...all].sort();

const outPath = path.join(__dirname, "content-strings-en.json");
fs.writeFileSync(outPath, JSON.stringify(sorted, null, 2), "utf8");

console.log(JSON.stringify({
  sacred: sacred.size,
  mantras: mantras.size,
  culture: culture.size,
  pujas: pujas.size,
  totalUnique: all.size,
  outPath,
}, null, 2));
