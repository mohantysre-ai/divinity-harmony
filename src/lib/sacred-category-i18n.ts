import type { UiKey } from "@/lib/ui-keys";

const CATEGORY_KEYS: Record<string, UiKey> = {
  All: "all",
  "Vedas & Vedangas": "categoryVedasVedangas",
  Upanishads: "categoryUpanishads",
  Puranas: "categoryPuranas",
  Gitas: "categoryGitas",
  "Itihasa & Sacred Narratives": "categoryItihasaSacred",
  "Philosophy & Yoga": "categoryPhilosophyYoga",
  "Deities & Sacred Lore": "categoryDeitiesSacredLore",
  "Ancestors & Dharma": "categoryAncestorsDharma",
  "Hymns & Mantras": "categoryHymnsMantras",
};

export function sacredCategoryKey(category: string): UiKey {
  return CATEGORY_KEYS[category] ?? "all";
}
