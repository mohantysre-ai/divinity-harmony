import type { AppLocale } from "@/hooks/use-locale";
import contentPacks from "@/lib/content-packs.json";

type ContentLocale = Exclude<AppLocale, "en">;
const packs = contentPacks as Record<ContentLocale, Record<string, string>>;

/** Localize catalog/content strings (exact English key → regional translation). */
export function localizeContent(text: string, locale: AppLocale): string {
  if (!text || locale === "en") return text;
  return packs[locale]?.[text] ?? text;
}

export function localizeContentList(
  items: string[],
  locale: AppLocale,
): string[] {
  return items.map((item) => localizeContent(item, locale));
}
