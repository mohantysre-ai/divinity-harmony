/** Hero artwork for sacred-text cards — Commons FilePath URLs stay valid if files move. */

import { deities } from "@/data/deities";

function commonsFile(file: string, width = 960): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
}

/** Stable Commons files (deity catalog + manuscripts/temples used as covers). */
export const ART_POOL: readonly string[] = [
  ...deities.map((d) => d.imageUrl),
  commonsFile("Kartikeya.jpg"),
  commonsFile("Palm-leaf manuscript.jpg"),
  commonsFile("Sanskrit manuscript.jpg"),
  commonsFile("Nataraja.jpg"),
  commonsFile("Bhagavad Gita.jpg"),
  commonsFile("Valmiki Ramayana.jpg"),
  commonsFile("Mahabharata.jpg"),
  commonsFile("Vedas.jpg"),
  commonsFile("Jagannath Temple Puri.jpg"),
  commonsFile("Brihadeeswarar Temple.jpg"),
  commonsFile("Meenakshi Temple.jpg"),
  commonsFile("Adiyogi Shiva.jpg"),
  commonsFile("Gayatri Mantra.jpg"),
  commonsFile("Tulsidas.jpg"),
];

const titleArt: Record<string, string> = {
  "Rigveda Samhita": commonsFile("Vedas.jpg"),
  "Samaveda Samhita": commonsFile("Palm-leaf manuscript.jpg"),
  "Shukla Yajurveda": commonsFile("Vedas.jpg"),
  "Krishna Yajurveda": commonsFile("Palm-leaf manuscript.jpg"),
  "Atharvaveda Samhita": commonsFile("Sanskrit manuscript.jpg"),
  "Bhagavad Gita": ART_POOL[3],
  "Bhagavata Purana": ART_POOL[3],
  "Valmiki Ramayana": ART_POOL[4],
  Ramcharitmanas: commonsFile("Tulsidas.jpg"),
  Mahabharata: ART_POOL[4],
  "Devi Mahatmya": ART_POOL[5],
  "Markandeya Purana": ART_POOL[5],
  "Shiva Purana": ART_POOL[1],
  "Vishnu Purana": ART_POOL[2],
  "Isha Upanishad": commonsFile("Sanskrit manuscript.jpg"),
  "Chandogya Upanishad": commonsFile("Palm-leaf manuscript.jpg"),
  "Kena Upanishad": ART_POOL[7],
  "Katha Upanishad": ART_POOL[1],
  "Brihadaranyaka Upanishad": commonsFile("Sanskrit manuscript.jpg"),
  "Mandukya Upanishad": ART_POOL[7],
};

const CATEGORY_INDEX: Record<string, number> = {
  "Vedas & Vedangas": 0,
  Upanishads: 1,
  Puranas: 2,
  Gitas: 3,
  "Itihasa & Sacred Narratives": 4,
  "Philosophy & Yoga": 5,
  "Deities & Sacred Lore": 6,
  "Ancestors & Dharma": 7,
  "Hymns & Mantras": 8,
};

function poolIndex(id: number, category: string, title: string): number {
  const cat = CATEGORY_INDEX[category] ?? 0;
  const titleHash = [...title].reduce((s, c) => s + c.charCodeAt(0), 0);
  return (id * 997 + cat * 503 + titleHash * 89) % ART_POOL.length;
}

export function sacredTextImageUrl(title: string, category: string, id = 0): string {
  return titleArt[title] ?? ART_POOL[poolIndex(id, category, title)];
}

/** Ordered candidates — primary first, then alternates from the art pool. */
export function sacredTextImageCandidates(
  title: string,
  category: string,
  id = 0,
): string[] {
  const primary = sacredTextImageUrl(title, category, id);
  const cat = CATEGORY_INDEX[category] ?? 0;
  const altIndices = [
    poolIndex(id, category, title),
    poolIndex(id + 1, category, title),
    poolIndex(id + 2, category, title),
    (id * 13 + cat * 7) % ART_POOL.length,
    (id * 29 + cat * 11 + 3) % ART_POOL.length,
    (id * 41 + cat * 17 + 5) % ART_POOL.length,
  ];
  const deityFallback = deities.map((d) => d.imageUrl);
  return [...new Set([primary, ...altIndices.map((i) => ART_POOL[i]), ...deityFallback])];
}

export function sacredTextImageSearchQuery(title: string, category: string): string {
  const topic = title.split(/[,:]/)[0]?.trim() || title;
  if (category === "Vedas & Vedangas") return `Hindu Vedas palm leaf manuscript India`;
  if (category === "Upanishads") return `Sanskrit manuscript Hindu India`;
  if (category === "Gitas") return `Bhagavad Gita Krishna Arjuna painting`;
  if (category === "Puranas") return `Hindu Purana temple painting India`;
  return `Hindu ${topic} temple India painting`;
}

export function sacredTextImagePosition(category: string, id: number): string {
  const positions = ["50% 45%", "50% 22%", "50% 35%", "50% 68%", "50% 15%"];
  return positions[(id + (CATEGORY_INDEX[category] ?? 0) * 3) % positions.length];
}

export function sacredTextGradient(category: string): string {
  const gradients: Record<string, string> = {
    "Vedas & Vedangas": "from-black/80 via-black/25 to-transparent",
    Upanishads: "from-black/80 via-indigo-950/30 to-transparent",
    Puranas: "from-black/80 via-rose-950/25 to-transparent",
    Gitas: "from-black/80 via-sky-950/25 to-transparent",
    "Itihasa & Sacred Narratives": "from-black/80 via-emerald-950/25 to-transparent",
    "Philosophy & Yoga": "from-black/80 via-slate-950/25 to-transparent",
    "Deities & Sacred Lore": "from-black/80 via-fuchsia-950/25 to-transparent",
    "Ancestors & Dharma": "from-black/80 via-amber-950/25 to-transparent",
    "Hymns & Mantras": "from-black/80 via-teal-950/25 to-transparent",
  };
  return gradients[category] ?? "from-black/80 via-black/25 to-transparent";
}
