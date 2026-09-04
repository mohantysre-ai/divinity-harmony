import Sanscript from "@indic-transliteration/sanscript";

import type { AppLocale } from "@/hooks/use-locale";

const schemes: Record<Exclude<AppLocale, "en">, string> = {
  hi: "devanagari",
  bn: "bengali",
  gu: "gujarati",
  mr: "devanagari",
  ta: "tamil",
  te: "telugu",
  ml: "malayalam",
  kn: "kannada",
  or: "oriya",
  pa: "gurmukhi",
  as: "bengali",
};

/**
 * Last-resort rendering for live/dynamic content that has no reviewed translation yet.
 * Static app copy uses translated packs; this prevents a regional session from falling
 * back to Latin text while a newly discovered place or catalog entry is being reviewed.
 */
export function regionalScriptFallback(
  text: string,
  locale: AppLocale,
): string {
  if (!text || locale === "en" || !/[A-Za-z]/.test(text)) return text;
  const scheme = schemes[locale];
  return text.replace(/[A-Za-z]+(?:[’'-][A-Za-z]+)*/g, (word) =>
    Sanscript.t(word.toLowerCase(), "itrans", scheme),
  );
}
