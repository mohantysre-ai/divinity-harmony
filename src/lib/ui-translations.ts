import type { AppLocale } from "@/hooks/use-locale";
import { buildUiDict } from "@/lib/locale-packs";

/** Real UI copy — keys are exact English source strings in the app. */
export const uiTranslations: Partial<Record<AppLocale, Record<string, string>>> =
  {
    hi: buildUiDict("hi"),
    kn: buildUiDict("kn"),
    bn: buildUiDict("bn"),
    gu: buildUiDict("gu"),
    mr: buildUiDict("mr"),
    ta: buildUiDict("ta"),
    te: buildUiDict("te"),
    ml: buildUiDict("ml"),
    or: buildUiDict("or"),
    pa: buildUiDict("pa"),
    as: buildUiDict("as"),
  };

/** Exact-match only — avoids partial replacements like "Explore" inside English sentences. */
export function translateUiText(text: string, locale: AppLocale): string {
  if (locale === "en") return text;

  const dict = uiTranslations[locale];
  if (!dict) return text;

  return dict[text] ?? text;
}
