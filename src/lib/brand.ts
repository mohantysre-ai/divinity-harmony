export const BRAND_NAME = "DharmDisha";

/** Brand names are proper nouns and must never be translated or transliterated. */
export function isProtectedBrandText(text: string): boolean {
  return text.trim() === BRAND_NAME;
}
