import type { AppLocale } from "@/hooks/use-locale";
import { translateUiText } from "@/lib/ui-translations";

const blockedSelector =
  "script, style, noscript, iframe, svg, code, pre, textarea, [data-no-regionalize], .mantra-text";
const translatedAttributes = ["placeholder", "title", "aria-label", "alt"] as const;
const translatedAttributeSelector = translatedAttributes
  .map((name) => `[${name}]`)
  .join(",");

const originalText = new WeakMap<Node, string>();
const renderedText = new WeakMap<Node, string>();
const originalAttributes = new WeakMap<Element, Record<string, string>>();
const renderedAttributes = new WeakMap<Element, Record<string, string>>();

/** Translate visible UI copy. English is restored from stored originals — never transliteration. */
export function regionalize(text: string, locale: AppLocale): string {
  return translateUiText(text, locale);
}

function translateTextNode(node: Text, locale: AppLocale): void {
  const parent = node.parentElement;
  if (!parent || parent.closest(blockedSelector)) return;

  let source = originalText.get(node);
  const rendered = renderedText.get(node);
  if (source === undefined || (rendered !== undefined && node.data !== rendered)) {
    source = node.data;
    originalText.set(node, source);
  }

  const next = locale === "en" ? source : regionalize(source, locale);
  if (node.data !== next) node.data = next;
  renderedText.set(node, next);
}

function translateElementAttributes(element: Element, locale: AppLocale): void {
  if (element.closest(blockedSelector)) return;

  const sources = originalAttributes.get(element) || {};
  const rendered = renderedAttributes.get(element) || {};

  for (const attribute of translatedAttributes) {
    const current = element.getAttribute(attribute);
    if (!current) continue;
    if (
      sources[attribute] === undefined ||
      (rendered[attribute] !== undefined && current !== rendered[attribute])
    ) {
      sources[attribute] = current;
    }

    const source = sources[attribute];
    const next = locale === "en" ? source : regionalize(source, locale);
    if (current !== next) element.setAttribute(attribute, next);
    rendered[attribute] = next;
  }

  originalAttributes.set(element, sources);
  renderedAttributes.set(element, rendered);
}

/**
 * Translate one DOM branch. Mutation observers can pass only the node that
 * changed, avoiding an expensive document-wide scan after every React render.
 */
export function applyRegionalUi(root: Node, locale: AppLocale): void {
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root as Text, locale);
    return;
  }

  if (root instanceof Element && root.closest(blockedSelector)) return;

  if (root instanceof Element) translateElementAttributes(root, locale);

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    translateTextNode(walker.currentNode as Text, locale);
  }

  if (!(root instanceof Element || root instanceof Document || root instanceof DocumentFragment)) {
    return;
  }

  for (const element of Array.from(root.querySelectorAll(translatedAttributeSelector))) {
    translateElementAttributes(element, locale);
  }
}
