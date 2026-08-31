import type { AppLocale } from "@/hooks/use-locale";
import type { MantraScript } from "@/lib/transliterate";

/** Regional script for deity Sanskrit labels — never Devanagari on South Indian locales. */
export function scriptForAppLocale(locale: AppLocale): MantraScript {
  switch (locale) {
    case "or":
      return "oriya";
    case "te":
      return "telugu";
    case "ta":
      return "tamil";
    case "bn":
      return "bengali";
    case "gu":
      return "gujarati";
    case "pa":
      return "gurmukhi";
    case "kn":
      return "kannada";
    case "ml":
      return "malayalam";
    case "hi":
    case "mr":
      return "devanagari";
    case "en":
    case "as":
      return "devanagari";
    default: {
      const _exhaustive: never = locale;
      return _exhaustive;
    }
  }
}
