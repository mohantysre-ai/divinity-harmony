/**
 * Regression check for every localized phrase used by the Scripture, Temple,
 * Purohit/Puja Vidhi and Culture sections.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const locales = ["hi", "bn", "gu", "mr", "ta", "te", "ml", "kn", "or", "pa", "as"];
const sections = JSON.parse(
  fs.readFileSync(path.join(root, "scripts/packs/section-strings-en.json"), "utf8"),
);
const contentPacks = JSON.parse(
  fs.readFileSync(path.join(root, "src/lib/content-packs.json"), "utf8"),
);
const contentSupplementPacks = JSON.parse(
  fs.readFileSync(
    path.join(root, "src/lib/content-supplement-packs.json"),
    "utf8",
  ),
);
const contentReleaseSupplementPacks = JSON.parse(
  fs.readFileSync(
    path.join(root, "src/lib/content-release-supplement-packs.json"),
    "utf8",
  ),
);
const uiKeys = JSON.parse(
  fs.readFileSync(path.join(root, "src/lib/ui-keys-export.json"), "utf8"),
);
const uiPacks = JSON.parse(
  fs.readFileSync(path.join(root, "src/lib/locale-packs.json"), "utf8"),
);
const reviewedOdiaTempleCopy = JSON.parse(
  fs.readFileSync(
    path.join(root, "scripts/packs/odia-temples-reviewed.json"),
    "utf8",
  ),
);
const reviewedTempleCopy = JSON.parse(
  fs.readFileSync(path.join(root, "scripts/packs/temples-reviewed.json"), "utf8"),
);

const placeholderNames = (text) =>
  [...text.matchAll(/(?:\$)?\{([A-Za-z0-9_]+)\}/g)]
    .map((match) => match[1])
    .sort()
    .join(",");

const failures = [];
const report = {};

const templePhrases = sections.temples ?? [];
for (const [locale, reviewed] of Object.entries(reviewedTempleCopy)) {
  if (!locales.includes(locale) || locale === "or") {
    failures.push(`temples: invalid reviewed locale ${locale}`);
    continue;
  }
  for (const [english, translated] of Object.entries(reviewed)) {
    if (!templePhrases.includes(english)) {
      failures.push(`temples/${locale}: stale reviewed phrase ${JSON.stringify(english)}`);
    }
    if (placeholderNames(english) !== placeholderNames(translated)) {
      failures.push(`temples/${locale}: placeholders changed in reviewed phrase ${JSON.stringify(english)}`);
    }
  }
}
for (const english of templePhrases) {
  if (!Object.hasOwn(reviewedOdiaTempleCopy, english)) {
    failures.push(`temples/or: missing reviewed phrase ${JSON.stringify(english)}`);
  }
}
for (const english of Object.keys(reviewedOdiaTempleCopy)) {
  if (!templePhrases.includes(english)) {
    failures.push(`temples/or: stale reviewed phrase ${JSON.stringify(english)}`);
  }
}
const permittedTempleLatin = /(?:OpenStreetMap|UNESCO|BAPS|MRT|KTM|TTD)/g;
for (const [english, translated] of Object.entries(reviewedOdiaTempleCopy)) {
  const fragments = translated
    .replace(/(?:\$)?\{[A-Za-z0-9_]+\}/g, "")
    .replace(permittedTempleLatin, "")
    .match(/[A-Za-z]{2,}/g);
  if (fragments) {
    failures.push(
      `temples/or: unexpected Latin text ${fragments.join(", ")} in ${JSON.stringify(english)}`,
    );
  }
}

for (const [section, phrases] of Object.entries(sections)) {
  report[section] = { phrases: phrases.length };
  for (const locale of locales) {
    let valid = 0;
    for (const english of phrases) {
      const translated =
        (section === "temples" && locale === "or"
          ? reviewedOdiaTempleCopy[english]
          : undefined) ??
        (section === "temples" ? reviewedTempleCopy[locale]?.[english] : undefined) ??
        contentReleaseSupplementPacks[locale]?.[english] ??
        contentSupplementPacks[locale]?.[english] ??
        contentPacks[locale]?.[english];
      if (!translated) {
        failures.push(`${section}/${locale}: missing ${JSON.stringify(english)}`);
        continue;
      }
      if (translated === english && /[A-Za-z]{3}/.test(english)) {
        failures.push(`${section}/${locale}: unchanged ${JSON.stringify(english)}`);
        continue;
      }
      if (placeholderNames(english) !== placeholderNames(translated)) {
        failures.push(`${section}/${locale}: placeholders changed in ${JSON.stringify(english)}`);
        continue;
      }
      valid += 1;
    }
    report[section][locale] = `${valid}/${phrases.length}`;
  }
}

const forbiddenTempleFragments = {
  hi: /उतार प्रदेश|तीर्थ तीर्थ/,
  bn: /চর ধাম|[0-9]:[0-9]{2} অম্|[0-9]:[0-9]{2} প্ম্|ওপেন্স্ত্রীত্মপ্/,
  gu: /[0-9]:[0-9]{2} અમ્|[0-9]:[0-9]{2} પ્મ્|ઓપેન્સ્ત্রীত্মપ્/,
  mr: /उंच उंच|[0-9]:[0-9]{2} अम्|[0-9]:[0-9]{2} प्म्/,
  ta: /[0-9]:[0-9]{2} அம்|[0-9]:[0-9]{2} ப்ம்|பிரஜா தேவி/,
  te: /[0-9]:[0-9]{2} అమ్|[0-9]:[0-9]{2} ప్మ్|ఉనేస్చో/,
  ml: /[0-9]:[0-9]{2} അമ്|[0-9]:[0-9]{2} പ്മ്/,
  kn: /[0-9]:[0-9]{2} ಅಮ್|[0-9]:[0-9]{2} ಪ್ಮ್|ಉನೇಸ್ಚೋ|ಓಪೇನ್ಸ್ತ್ರೀತ್ಮಪ್/,
  pa: /[0-9]:[0-9]{2} ਅਮ੍|[0-9]:[0-9]{2} ਪ੍ਮ੍/,
  as: /চৰ ধাম|ওপেন্স্ত্রীত্মপ্/,
};
for (const [locale, pattern] of Object.entries(forbiddenTempleFragments)) {
  for (const english of templePhrases) {
    const translated =
      reviewedTempleCopy[locale]?.[english] ??
      contentReleaseSupplementPacks[locale]?.[english] ??
      contentSupplementPacks[locale]?.[english] ??
      contentPacks[locale]?.[english] ??
      "";
    if (pattern.test(translated)) {
      failures.push(`temples/${locale}: known corruption remains in ${JSON.stringify(english)}`);
    }
  }
}

for (const locale of locales) {
  for (const [key, english] of Object.entries(uiKeys)) {
    const translated = uiPacks[locale]?.[key];
    if (!translated) {
      failures.push(`ui/${locale}: missing key ${key}`);
      continue;
    }
    if (placeholderNames(english) !== placeholderNames(translated)) {
      failures.push(`ui/${locale}: placeholders changed for ${key}`);
    }
  }
}

console.log(JSON.stringify(report, null, 2));
console.log(`UI keys: ${Object.keys(uiKeys).length}/${Object.keys(uiKeys).length} in ${locales.length} regional languages`);

if (failures.length) {
  console.error(`Localization validation failed (${failures.length}):`);
  failures.slice(0, 50).forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Section localization validation passed.");
