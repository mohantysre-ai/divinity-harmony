import type { AppLocale } from "@/hooks/use-locale";
import { UI_KEYS, type UiKey, type UiLocale } from "@/lib/ui-keys";
import packs from "@/lib/locale-packs.json";
import reviewedOverrides from "@/lib/locale-pack-reviewed-overrides.json";
import { regionalScriptFallback } from "@/lib/regional-fallback";
import { localizedBrandName } from "@/lib/brand";

export type { UiKey };

const generatedPacks = packs as Record<UiLocale, Record<UiKey, string>>;
const overrides = reviewedOverrides as Partial<
  Record<UiLocale, Partial<Record<UiKey, string>>>
>;
const localePacks = Object.fromEntries(
  Object.entries(generatedPacks).map(([locale, values]) => [
    locale,
    { ...values, ...overrides[locale as UiLocale] },
  ]),
) as Record<UiLocale, Record<UiKey, string>>;

export function translateKey(locale: AppLocale, key: UiKey): string {
  if (key === "divinityHarmony") return localizedBrandName(locale);
  if (locale === "en") return UI_KEYS[key];
  return regionalScriptFallback(
    localePacks[locale]?.[key] ??
      UI_KEYS[key],
    locale,
  );
}

export function buildUiDict(locale: AppLocale): Record<string, string> {
  const dict: Record<string, string> = {};
  for (const key of Object.keys(UI_KEYS) as UiKey[]) {
    dict[UI_KEYS[key]] = translateKey(locale, key);
  }
  return dict;
}
