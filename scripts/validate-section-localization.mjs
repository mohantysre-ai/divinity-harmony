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

const placeholderNames = (text) =>
  [...text.matchAll(/(?:\$)?\{([A-Za-z0-9_]+)\}/g)]
    .map((match) => match[1])
    .sort()
    .join(",");

const failures = [];
const report = {};

const templePhrases = sections.temples ?? [];
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
