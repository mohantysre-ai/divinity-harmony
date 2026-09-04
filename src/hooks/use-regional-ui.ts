import { useEffect } from "react";

import type { AppLocale } from "@/hooks/use-locale";
import { applyRegionalUi } from "@/lib/regional-ui";

export function useRegionalUi(locale: AppLocale): void {
  useEffect(() => {
    const pendingRoots = new Set<Node>();
    let animationFrame: number | undefined;

    const flush = () => {
      animationFrame = undefined;

      const roots: Node[] = [];
      for (const node of pendingRoots) {
        if (!node.isConnected) continue;

        // Keep only the highest changed branch so nested React mutations are
        // translated once rather than repeatedly walking the same subtree.
        if (roots.some((root) => root.contains(node))) continue;
        for (let index = roots.length - 1; index >= 0; index -= 1) {
          if (node.contains(roots[index])) roots.splice(index, 1);
        }
        roots.push(node);
      }
      pendingRoots.clear();

      for (const root of roots) applyRegionalUi(root, locale);
    };

    const schedule = (node: Node) => {
      pendingRoots.add(node);
      if (animationFrame === undefined) animationFrame = window.requestAnimationFrame(flush);
    };

    // A locale change needs one full pass. Subsequent React updates are
    // handled incrementally by the observer below.
    applyRegionalUi(document.documentElement, locale);

    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "childList") {
          record.addedNodes.forEach(schedule);
        } else {
          schedule(record.target);
        }
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label", "alt"],
    });

    return () => {
      observer.disconnect();
      if (animationFrame !== undefined) window.cancelAnimationFrame(animationFrame);
      pendingRoots.clear();
    };
  }, [locale]);
}
