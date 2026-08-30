import type { UiKey } from "@/lib/ui-keys";

const DEITY_KEYS: Record<string, UiKey> = {
  Ganesha: "deityGanesha",
  Shiva: "deityShiva",
  "Vishnu & avatars": "deityVishnuAvatars",
  Krishna: "deityKrishna",
  "Divine Mother": "deityDivineMother",
  Lakshmi: "deityLakshmi",
  Saraswati: "deitySaraswati",
  Gayatri: "deityGayatri",
  Hanuman: "deityHanuman",
  Murugan: "deityMurugan",
  "Vedic & planetary": "deityVedicPlanetary",
  "Vedic & universal": "deityVedicUniversal",
};

export function deityUiKey(label: string): UiKey | null {
  return DEITY_KEYS[label] ?? null;
}
