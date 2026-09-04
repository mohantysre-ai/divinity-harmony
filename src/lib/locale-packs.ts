import type { AppLocale } from "@/hooks/use-locale";
import { UI_KEYS, type UiKey, type UiLocale } from "@/lib/ui-keys";
import packs from "@/lib/locale-packs.json";
import { regionalScriptFallback } from "@/lib/regional-fallback";

export type { UiKey };

const localePacks = packs as Record<UiLocale, Record<UiKey, string>>;

export function translateKey(locale: AppLocale, key: UiKey): string {
  if (locale === "en") return UI_KEYS[key];
  return (
    localePacks[locale]?.[key] ??
    regionalScriptFallback(UI_KEYS[key], locale)
  );
}

export function buildUiDict(locale: AppLocale): Record<string, string> {
  const dict: Record<string, string> = {};
  for (const key of Object.keys(UI_KEYS) as UiKey[]) {
    dict[UI_KEYS[key]] = translateKey(locale, key);
  }
  return dict;
}
