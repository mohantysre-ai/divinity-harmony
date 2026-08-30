import type { UiKey } from "@/lib/ui-keys";

export const ROUTINE_ITEMS: { id: string; key: UiKey }[] = [
  { id: "Light the lamp", key: "lightTheLamp" },
  { id: "Ganesha invocation", key: "ganeshaInvocation" },
  { id: "Ishta-devata mantra", key: "ishtaDevataMantra" },
  { id: "One scripture verse", key: "oneScriptureVerse" },
  { id: "Japa practice", key: "japaPractice" },
  { id: "Aarti and closing prayer", key: "aartiClosingPrayer" },
];

export function routineKeyFor(id: string): UiKey | null {
  return ROUTINE_ITEMS.find((item) => item.id === id)?.key ?? null;
}
