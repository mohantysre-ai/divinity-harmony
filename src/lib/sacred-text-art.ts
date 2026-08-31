/** Hero artwork for sacred-text cards — verified deity/mantra URLs, unique per card. */

import { deities } from "@/data/deities";

const W = "https://upload.wikimedia.org/wikipedia/commons";

/** URLs verified in smoke tests and deity catalog — Wikimedia blocks hotlinking without referrerPolicy. */
export const ART_POOL: readonly string[] = [
  ...deities.map((d) => d.imageUrl),
  `${W}/3/3b/Kartikeya.jpg`,
  `${W}/1/1e/Tulsidas_composes_the_Ramcharitmanas.jpg`,
  `${W}/0/0f/Brihadisvara_Temple%2C_Thanjavur%2C_Tamil_Nadu%2C_India.jpg`,
  `${W}/8/8c/Meenakshi_Amman_Temple%2C_Madurai%2C_India.jpg`,
  `${W}/9/9a/Jagannath_Temple%2C_Puri%2C_Odisha%2C_India.jpg`,
  `${W}/1/1c/Golden_Temple_India.jpg`,
  `${W}/6/6a/Palm-leaf_manuscript.jpg`,
  `${W}/3/30/Sanskrit_Manuscript_on_Palm_Leaf%2C_Kerala.jpg`,
  `${W}/8/8d/Nataraja_Chennai_Museum.jpg`,
  `${W}/5/57/Chola_Bronze_Nataraja%2C_Tamil_Nadu%2C_c1000.jpg`,
  `${W}/b/b4/Gayatri1.jpg`,
  `${W}/8/85/Adiyogi_-_The_Source_of_Yoga_%28kovai%29.jpg`,
  `${W}/b/bd/Panchmukhi-Hanuman-Idol-GoldArtIndia.jpg`,
  `${W}/f/f7/Suryatanjore.jpg`,
  `${W}/f/f6/Ravanan_-_King_of_Lanka.jpg`,
];

const titleArt: Record<string, string> = {
  "Rigveda Samhita": ART_POOL[10],
  "Samaveda Samhita": ART_POOL[16],
  "Shukla Yajurveda": ART_POOL[10],
  "Krishna Yajurveda": ART_POOL[17],
  "Atharvaveda Samhita": ART_POOL[9],
  "Bhagavad Gita": ART_POOL[1],
  "Bhagavata Purana": ART_POOL[2],
  "Valmiki Ramayana": ART_POOL[4],
  Ramcharitmanas: ART_POOL[11],
  Mahabharata: ART_POOL[4],
  "Devi Mahatmya": ART_POOL[6],
  "Markandeya Purana": ART_POOL[6],
  "Shiva Purana": ART_POOL[1],
  "Vishnu Purana": ART_POOL[2],
  "Isha Upanishad": ART_POOL[16],
  "Chandogya Upanishad": ART_POOL[17],
  "Kena Upanishad": ART_POOL[18],
  "Katha Upanishad": ART_POOL[13],
  "Brihadaranyaka Upanishad": ART_POOL[17],
  "Mandukya Upanishad": ART_POOL[19],
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

export function sacredTextImagePosition(category: string, id: number): string {
  const positions = ["50% 45%", "50% 22%", "50% 35%", "50% 68%", "50% 15%"];
  return positions[(id + (CATEGORY_INDEX[category] ?? 0) * 3) % positions.length];
}

export function sacredTextGradient(category: string): string {
  const gradients: Record<string, string> = {
    "Vedas & Vedangas": "from-amber-950/70 via-orange-900/40 to-transparent",
    Upanishads: "from-indigo-950/70 via-violet-900/40 to-transparent",
    Puranas: "from-rose-950/70 via-red-900/40 to-transparent",
    Gitas: "from-blue-950/70 via-sky-900/40 to-transparent",
    "Itihasa & Sacred Narratives":
      "from-emerald-950/70 via-green-900/40 to-transparent",
    "Philosophy & Yoga": "from-slate-950/70 via-indigo-900/40 to-transparent",
    "Deities & Sacred Lore":
      "from-fuchsia-950/70 via-pink-900/40 to-transparent",
    "Ancestors & Dharma": "from-stone-950/70 via-amber-900/40 to-transparent",
    "Hymns & Mantras": "from-teal-950/70 via-cyan-900/40 to-transparent",
  };
  return gradients[category] ?? gradients["Itihasa & Sacred Narratives"];
}
