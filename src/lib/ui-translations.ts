import type { AppLocale } from "@/hooks/use-locale";
import { localizeContent } from "@/lib/content-i18n";
import { buildUiDict } from "@/lib/locale-packs";
import { regionalScriptFallback } from "@/lib/regional-fallback";
import { isCanonicalBrandText, localizedBrandName } from "@/lib/brand";

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

type UiTemplate = {
  expression: RegExp;
  names: string[];
  translated: string;
};

const templateCache = new Map<AppLocale, UiTemplate[]>();

function escapeExpression(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function templatesFor(locale: AppLocale): UiTemplate[] {
  const cached = templateCache.get(locale);
  if (cached) return cached;

  const templates = Object.entries(uiTranslations[locale] ?? {})
    .filter(([source]) => /\$?\{[A-Za-z0-9_]+\}/.test(source))
    .map(([source, translated]) => {
      const names: string[] = [];
      let cursor = 0;
      let pattern = "^";
      for (const match of source.matchAll(/\$?\{([A-Za-z0-9_]+)\}/g)) {
        pattern += escapeExpression(source.slice(cursor, match.index));
        pattern += "(.+?)";
        names.push(match[1]);
        cursor = (match.index ?? 0) + match[0].length;
      }
      pattern += `${escapeExpression(source.slice(cursor))}$`;
      return { expression: new RegExp(pattern, "u"), names, translated };
    })
    .sort(
      (left, right) =>
        right.expression.source.length - left.expression.source.length,
    );

  templateCache.set(locale, templates);
  return templates;
}

function translateTemplate(text: string, locale: AppLocale): string | null {
  for (const template of templatesFor(locale)) {
    const match = template.expression.exec(text);
    if (!match) continue;

    const values = Object.fromEntries(
      template.names.map((name, index) => [name, match[index + 1]]),
    );
    return template.translated.replace(
      /\$?\{([A-Za-z0-9_]+)\}/g,
      (_, name) => values[name] ?? "",
    );
  }
  return null;
}

/** Match complete UI strings or their reviewed templates, never partial phrases. */
export function translateUiText(text: string, locale: AppLocale): string {
  if (isCanonicalBrandText(text)) return localizedBrandName(locale);
  if (locale === "en") return text;

  const dict = uiTranslations[locale];
  if (!dict) return localizeContent(text, locale);

  // The DOM observer sees both interface labels and catalog/article copy.
  // Consult the semantic content pack before using its phonetic fallback.
  const translatedTemplate = translateTemplate(text, locale);
  return regionalScriptFallback(
    dict[text] ?? translatedTemplate ?? localizeContent(text, locale),
    locale,
  );
}
