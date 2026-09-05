import type { AppLocale } from "@/hooks/use-locale";
import contentPacks from "@/lib/content-packs.json";
import contentSupplementPacks from "@/lib/content-supplement-packs.json";
import contentReleaseSupplementPacks from "@/lib/content-release-supplement-packs.json";
import { regionalScriptFallback } from "@/lib/regional-fallback";

type ContentLocale = Exclude<AppLocale, "en">;
const basePacks = contentPacks as Record<ContentLocale, Record<string, string>>;
const supplements = contentSupplementPacks as Record<
  ContentLocale,
  Record<string, string>
>;
const releaseSupplements = contentReleaseSupplementPacks as Record<
  ContentLocale,
  Record<string, string>
>;
const packs = Object.fromEntries(
  Object.keys(basePacks).map((locale) => [
    locale,
    {
      ...basePacks[locale as ContentLocale],
      ...supplements[locale as ContentLocale],
      ...releaseSupplements[locale as ContentLocale],
    },
  ]),
) as Record<ContentLocale, Record<string, string>>;

type TemplateMatch = {
  expression: RegExp;
  names: string[];
  translated: string;
};

const templateCache = new Map<ContentLocale, TemplateMatch[]>();

function escapeExpression(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function contentTemplates(locale: ContentLocale): TemplateMatch[] {
  const cached = templateCache.get(locale);
  if (cached) return cached;

  const templates = Object.entries(packs[locale] ?? {})
    .filter(([english]) => english.includes("${"))
    .map(([english, translated]) => {
      const names: string[] = [];
      let cursor = 0;
      let pattern = "^";
      for (const match of english.matchAll(/\$\{([A-Za-z0-9_]+)\}/g)) {
        pattern += escapeExpression(english.slice(cursor, match.index));
        pattern += "(.+?)";
        names.push(match[1]);
        cursor = (match.index ?? 0) + match[0].length;
      }
      pattern += `${escapeExpression(english.slice(cursor))}$`;
      return { expression: new RegExp(pattern, "u"), names, translated };
    })
    .sort(
      (left, right) =>
        right.expression.source.length - left.expression.source.length,
    );

  templateCache.set(locale, templates);
  return templates;
}

function localizeTemplate(text: string, locale: ContentLocale): string | null {
  for (const template of contentTemplates(locale)) {
    const match = template.expression.exec(text);
    if (!match) continue;

    const values = Object.fromEntries(
      template.names.map((name, index) => [
        name,
        localizeContent(match[index + 1], locale),
      ]),
    );
    return template.translated.replace(
      /\$\{([A-Za-z0-9_]+)\}/g,
      (_, name) => values[name] ?? "",
    );
  }
  return null;
}

/** Localize catalog/content strings without leaking Latin copy in regional mode. */
export function localizeContent(text: string, locale: AppLocale): string {
  if (!text || locale === "en") return text;
  const contentLocale = locale as ContentLocale;
  const translated =
    packs[contentLocale]?.[text] ?? localizeTemplate(text, contentLocale);
  return regionalScriptFallback(translated ?? text, locale);
}

export function localizeContentList(
  items: string[],
  locale: AppLocale,
): string[] {
  return items.map((item) => localizeContent(item, locale));
}
