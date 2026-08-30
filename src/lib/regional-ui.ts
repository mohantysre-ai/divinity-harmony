import Sanscript from "@indic-transliteration/sanscript";

import type { AppLocale } from "@/hooks/use-locale";

const scripts: Partial<Record<AppLocale, string>> = {
  hi: "devanagari",
  mr: "devanagari",
  bn: "bengali",
  as: "bengali",
  gu: "gujarati",
  ta: "tamil",
  te: "telugu",
  ml: "malayalam",
  kn: "kannada",
  or: "oriya",
  pa: "gurmukhi",
};

// Reviewed Kannada copy is preferred. Any text not yet in this dictionary is
// still rendered in the active regional script, never as Latin-script English.
const kannada: Record<string, string> = {
  "Divinity Harmony": "ದಿವ್ಯ ಸಾಮರಸ್ಯ",
  Home: "ಮುಖಪುಟ",
  Mantras: "ಮಂತ್ರಗಳು",
  "Live Darshan": "ನೇರ ದರ್ಶನ",
  Scriptures: "ಪವಿತ್ರ ಗ್ರಂಥಗಳು",
  Deities: "ದೇವತೆಗಳು",
  Temples: "ದೇವಾಲಯಗಳು",
  Priests: "ಪುರೋಹಿತರು",
  Explore: "ಅನ್ವೇಷಿಸಿ",
  Login: "ಲಾಗಿನ್",
  Settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
  Language: "ಭಾಷೆ",
  English: "ಇಂಗ್ಲಿಷ್",
  "Application language": "ಅಪ್ಲಿಕೇಶನ್ ಭಾಷೆ",
  "Elder Mode": "ಹಿರಿಯರ ವಿಧಾನ",
  "My Dharma": "ನನ್ನ ಧರ್ಮ",
  "Culture of India": "ಭಾರತದ ಸಂಸ್ಕೃತಿ",
  "Pravachan & Reading": "ಪ್ರವಚನ ಮತ್ತು ಓದು",
  "Vedic Astrology": "ವೇದ ಜ್ಯೋತಿಷ್ಯ",
  "Mantra Library": "ಮಂತ್ರ ಗ್ರಂಥಾಲಯ",
  "Sacred Mantras": "ಪವಿತ್ರ ಮಂತ್ರಗಳು",
  "A living devotional library": "ಜೀವಂತ ಭಕ್ತಿ ಗ್ರಂಥಾಲಯ",
  "No mantra found. Try another spelling or deity.":
    "ಮಂತ್ರ ಕಂಡುಬಂದಿಲ್ಲ. ಬೇರೆ ಹೆಸರು ಅಥವಾ ದೇವತೆಯನ್ನು ಪ್ರಯತ್ನಿಸಿ.",
  "Search current contact details": "ಪ್ರಸ್ತುತ ಸಂಪರ್ಕ ವಿವರಗಳನ್ನು ಹುಡುಕಿ",
  "Find near me": "ನನ್ನ ಹತ್ತಿರ ಹುಡುಕಿ",
  "Google Maps": "ಗೂಗಲ್ ನಕ್ಷೆಗಳು",
  "Public directory": "ಸಾರ್ವಜನಿಕ ನಿರ್ದೇಶಿಕೆ",
  "Today’s practice": "ಇಂದಿನ ಸಾಧನೆ",
  "My tradition profile": "ನನ್ನ ಸಂಪ್ರದಾಯದ ವಿವರ",
  "Current state": "ಪ್ರಸ್ತುತ ರಾಜ್ಯ",
  "Home state / cultural tradition": "ತವರು ರಾಜ್ಯ ಅಥವಾ ಸಾಂಸ್ಕೃತಿಕ ಸಂಪ್ರದಾಯ",
  "Preferred language": "ಆದ್ಯತೆಯ ಭಾಷೆ",
  "Calendar tradition": "ಪಂಚಾಂಗ ಸಂಪ್ರದಾಯ",
  "Save My Dharma": "ನನ್ನ ಧರ್ಮವನ್ನು ಉಳಿಸಿ",
  "Family ritual reminders": "ಕುಟುಂಬದ ಧಾರ್ಮಿಕ ನೆನಪುಗಳು",
  "No family dates saved yet. Data remains in this browser.":
    "ಕುಟುಂಬದ ದಿನಾಂಕಗಳನ್ನು ಇನ್ನೂ ಉಳಿಸಿಲ್ಲ. ಮಾಹಿತಿ ಈ ಬ್ರೌಸರ್‌ನಲ್ಲೇ ಉಳಿಯುತ್ತದೆ.",
  "Light the lamp": "ದೀಪ ಹಚ್ಚಿ",
  "Ganesha invocation": "ಗಣೇಶ ಪ್ರಾರ್ಥನೆ",
  "Ishta-devata mantra": "ಇಷ್ಟದೇವತಾ ಮಂತ್ರ",
  "One scripture verse": "ಒಂದು ಶಾಸ್ತ್ರ ಶ್ಲೋಕ",
  "Japa practice": "ಜಪ ಸಾಧನೆ",
  "Aarti and closing prayer": "ಆರತಿ ಮತ್ತು ಸಮಾಪನ ಪ್ರಾರ್ಥನೆ",
  Observances: "ಆಚರಣೆಗಳು",
  "Living traditions": "ಜೀವಂತ ಸಂಪ್ರದಾಯಗಳು",
  "Pravachan guide": "ಪ್ರವಚನ ಮಾರ್ಗದರ್ಶಿ",
  "Dharmic reading room": "ಧಾರ್ಮಿಕ ವಾಚನಾಲಯ",
  "Official sources": "ಅಧಿಕೃತ ಮೂಲಗಳು",
  "Publisher-direct": "ಪ್ರಕಾಶಕರ ನೇರ ಮೂಲ",
  "Vedic Astrology Learning Centre": "ವೇದ ಜ್ಯೋತಿಷ್ಯ ಅಧ್ಯಯನ ಕೇಂದ್ರ",
  "Private birth details": "ಖಾಸಗಿ ಜನ್ಮ ವಿವರಗಳು",
  "Date of birth": "ಜನ್ಮ ದಿನಾಂಕ",
  "Exact birth time": "ನಿಖರ ಜನ್ಮ ಸಮಯ",
  "Birth place": "ಜನ್ಮ ಸ್ಥಳ",
  "Save privately on this device": "ಈ ಸಾಧನದಲ್ಲಿ ಖಾಸಗಿಯಾಗಿ ಉಳಿಸಿ",
  "Core calculation vocabulary": "ಮೂಲ ಗಣನಾ ಪದಕೋಶ",
  "Navagraha study map": "ನವಗ್ರಹ ಅಧ್ಯಯನ ನಕ್ಷೆ",
  "Search YouTube": "ಯೂಟ್ಯೂಬ್‌ನಲ್ಲಿ ಹುಡುಕಿ",
  "Play recording": "ಧ್ವನಿಮುದ್ರಣವನ್ನು ಚಾಲನೆ ಮಾಡಿ",
  "Devotional audio": "ಭಕ್ತಿ ಧ್ವನಿ",
  "Search mantra library": "ಮಂತ್ರ ಗ್ರಂಥಾಲಯ ಹುಡುಕಿ",
  All: "ಎಲ್ಲಾ",
  "Translation:": "ಅರ್ಥ:",
  "Explain this mantra": "ಈ ಮಂತ್ರವನ್ನು ವಿವರಿಸಿ",
  "Meaning and context:": "ಅರ್ಥ ಮತ್ತು ಸಂದರ್ಭ:",
  "Favorite mantra": "ಪ್ರಿಯ ಮಂತ್ರ",
  "Newsletter email": "ಸುದ್ದಿಪತ್ರ ಇಮೇಲ್",
  Subscribe: "ಚಂದಾದಾರರಾಗಿ",
  "Privacy policy": "ಗೌಪ್ಯತಾ ನೀತಿ",
  "Terms of use": "ಬಳಕೆಯ ನಿಯಮಗಳು",
  Accessibility: "ಪ್ರವೇಶಸಾಧ್ಯತೆ",
  "Trust & support": "ವಿಶ್ವಾಸ ಮತ್ತು ಸಹಾಯ",
  Practice: "ಸಾಧನೆ",
  Discover: "ಅನ್ವೇಷಣೆ",
};

export function regionalize(text: string, locale: AppLocale): string {
  if (locale === "en" || !/[A-Za-z]/.test(text)) return text;

  let value = text;
  if (locale === "kn") {
    const phrases = Object.entries(kannada).sort(
      ([left], [right]) => right.length - left.length,
    );
    for (const [source, translated] of phrases) {
      value = value.split(source).join(translated);
    }
  }

  if (!/[A-Za-z]/.test(value)) return value;
  const script = scripts[locale];
  if (!script) return value;

  return value.replace(/[A-Za-z][A-Za-z0-9 '&+./:–—-]*/g, (part) =>
    Sanscript.t(part.toLowerCase(), "itrans", script),
  );
}

const originalText = new WeakMap<Node, string>();
const localizedText = new WeakMap<Node, string>();
const originalAttributes = new WeakMap<Element, Record<string, string>>();
const localizedAttributes = new WeakMap<Element, Record<string, string>>();
const blockedSelector =
  "script, style, noscript, iframe, svg, code, pre, textarea, [data-no-regionalize]";
const regionalAttributes = ["placeholder", "title", "aria-label", "alt"];

export function applyRegionalUi(root: ParentNode, locale: AppLocale): void {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];

  while (walker.nextNode()) nodes.push(walker.currentNode as Text);

  for (const node of nodes) {
    const parent = node.parentElement;
    if (!parent || parent.closest(blockedSelector)) continue;

    let source = originalText.get(node);
    const lastLocalized = localizedText.get(node);
    if (
      source === undefined ||
      (lastLocalized !== undefined && node.data !== lastLocalized)
    ) {
      source = node.data;
      originalText.set(node, source);
    }

    const next = regionalize(source, locale);
    localizedText.set(node, next);
    if (node.data !== next) node.data = next;
  }

  const selector = regionalAttributes.map((name) => `[${name}]`).join(",");
  for (const element of Array.from(root.querySelectorAll?.(selector) || [])) {
    if (element.closest(blockedSelector)) continue;

    const sources = originalAttributes.get(element) || {};
    const lastValues = localizedAttributes.get(element) || {};

    for (const attribute of regionalAttributes) {
      const current = element.getAttribute(attribute);
      if (!current) continue;
      if (
        sources[attribute] === undefined ||
        (lastValues[attribute] !== undefined &&
          current !== lastValues[attribute])
      ) {
        sources[attribute] = current;
      }

      const next = regionalize(sources[attribute], locale);
      lastValues[attribute] = next;
      if (current !== next) element.setAttribute(attribute, next);
    }

    originalAttributes.set(element, sources);
    localizedAttributes.set(element, lastValues);
  }
}
