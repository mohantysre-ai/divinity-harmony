import type { AppLocale } from "@/hooks/use-locale";
import { translateUiText } from "@/lib/ui-translations";

const blockedSelector =
  "script, style, noscript, iframe, svg, code, pre, textarea, [data-no-regionalize], .mantra-text";

const originalText = new WeakMap<Node, string>();
const originalAttributes = new WeakMap<Element, Record<string, string>>();

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
    if (source === undefined) {
      source = node.data;
      originalText.set(node, source);
    }

    const next = locale === "en" ? source : regionalize(source, locale);
    if (node.data !== next) node.data = next;
  }

  const selector = ["placeholder", "title", "aria-label", "alt"]
    .map((name) => `[${name}]`)
    .join(",");
  for (const element of Array.from(root.querySelectorAll?.(selector) || [])) {
    if (element.closest(blockedSelector)) continue;

    const sources = originalAttributes.get(element) || {};

    for (const attribute of ["placeholder", "title", "aria-label", "alt"]) {
      const current = element.getAttribute(attribute);
      if (!current) continue;
      if (sources[attribute] === undefined) {
        sources[attribute] = current;
      }

      const source = sources[attribute];
      const next = locale === "en" ? source : regionalize(source, locale);
      if (current !== next) element.setAttribute(attribute, next);
    }

    originalAttributes.set(element, sources);
  }
}
