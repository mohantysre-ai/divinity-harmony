import type { AppLocale } from "@/hooks/use-locale";
import { translateUiText } from "@/lib/ui-translations";

const blockedSelector =
  "script, style, noscript, iframe, svg, code, pre, textarea, [data-no-regionalize], .mantra-text";

const originalText = new WeakMap<Node, string>();
const renderedText = new WeakMap<Node, string>();
const originalAttributes = new WeakMap<Element, Record<string, string>>();
const renderedAttributes = new WeakMap<Element, Record<string, string>>();

/** Translate visible UI copy. English is restored from stored originals — never transliteration. */
export function regionalize(text: string, locale: AppLocale): string {
  return translateUiText(text, locale);
}

export function applyRegionalUi(root: ParentNode, locale: AppLocale): void {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];

  while (walker.nextNode()) nodes.push(walker.currentNode as Text);

  for (const node of nodes) {
    const parent = node.parentElement;
    if (!parent || parent.closest(blockedSelector)) continue;

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

  const selector = ["placeholder", "title", "aria-label", "alt"]
    .map((name) => `[${name}]`)
    .join(",");
  for (const element of Array.from(root.querySelectorAll?.(selector) || [])) {
    if (element.closest(blockedSelector)) continue;

    const sources = originalAttributes.get(element) || {};
    const rendered = renderedAttributes.get(element) || {};

    for (const attribute of ["placeholder", "title", "aria-label", "alt"]) {
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
}
