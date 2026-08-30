import { useEffect } from "react";

import type { AppLocale } from "@/hooks/use-locale";
import { applyRegionalUi } from "@/lib/regional-ui";

export function useRegionalUi(locale: AppLocale): void {
  useEffect(() => {
    let applying = false;
    let pending = false;

    const apply = () => {
      if (applying) return;
      applying = true;
      applyRegionalUi(document.documentElement, locale);
      applying = false;
    };

    const schedule = () => {
      if (pending) return;
      pending = true;
      queueMicrotask(() => {
        pending = false;
        apply();
      });
    };

    apply();
    const observer = new MutationObserver(schedule);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label", "alt"],
    });

    return () => observer.disconnect();
  }, [locale]);
}
