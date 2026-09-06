export const BRAND_NAME = "DharmDisha";

type BrandLocale =
  | "en"
  | "hi"
  | "bn"
  | "gu"
  | "mr"
  | "ta"
  | "te"
  | "ml"
  | "kn"
  | "or"
  | "pa"
  | "as";

/** Reviewed native-script spellings. These are brand spellings, not translations. */
export const BRAND_DISPLAY_NAMES: Record<BrandLocale, string> = {
  en: "DharmDisha",
  hi: "धर्म दिशा",
  bn: "ধর্ম দিশা",
  gu: "ધર્મ દિશા",
  mr: "धर्म दिशा",
  ta: "தர்ம திசை",
  te: "ధర్మ దిశ",
  ml: "ധർമ്മ ദിശ",
  kn: "ಧರ್ಮ ದಿಶಾ",
  or: "ଧର୍ମ ଦିଶା",
  pa: "ਧਰਮ ਦਿਸ਼ਾ",
  as: "ধৰ্ম দিশা",
};

export function localizedBrandName(locale: BrandLocale): string {
  return BRAND_DISPLAY_NAMES[locale] ?? BRAND_NAME;
}

export function isCanonicalBrandText(text: string): boolean {
  return text.trim() === BRAND_NAME;
}
