/** Hero artwork for sacred-text cards — category defaults plus title overrides. */

const categoryArt: Record<string, string> = {
  "Vedas & Vedangas":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Rigveda_MS2097.jpg/640px-Rigveda_MS2097.jpg",
  Upanishads:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Upanishads_manuscript.jpg/640px-Upanishads_manuscript.jpg",
  Puranas:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Bhagavata_Purana_manuscript.jpg/640px-Bhagavata_Purana_manuscript.jpg",
  Gitas:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Bhagavad_Gita_19th_century_illustrated_Sanskrit_manuscript%2C_with_72_coloured_miniatures%2C_unknown_loaction%2C_%28Mehrangarh_Museum%29.jpg/640px-Bhagavad_Gita_19th_century_illustrated_Sanskrit_manuscript%2C_with_72_coloured_miniatures%2C_unknown_loaction%2C_%28Mehrangarh_Museum%29.jpg",
  "Itihasa & Sacred Narratives":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Rama_Sita_Lakshmana_Hanuman.jpg/640px-Rama_Sita_Lakshmana_Hanuman.jpg",
  "Philosophy & Yoga":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Yoga_meditation%2C_India%2C_1906.jpg/640px-Yoga_meditation%2C_India%2C_1906.jpg",
  "Deities & Sacred Lore":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Durga_Mahishasuramardini.jpg/640px-Durga_Mahishasuramardini.jpg",
  "Ancestors & Dharma":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Pitru_Paksha_offering.jpg/640px-Pitru_Paksha_offering.jpg",
  "Hymns & Mantras":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Gayatri1.jpg/640px-Gayatri1.jpg",
};

const titleArt: Record<string, string> = {
  "Rigveda Samhita":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Rigveda_MS2097.jpg/800px-Rigveda_MS2097.jpg",
  "Bhagavad Gita":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Bhagavad_Gita_19th_century_illustrated_Sanskrit_manuscript%2C_with_72_coloured_miniatures%2C_unknown_loaction%2C_%28Mehrangarh_Museum%29.jpg/800px-Bhagavad_Gita_19th_century_illustrated_Sanskrit_manuscript%2C_with_72_coloured_miniatures%2C_unknown_loaction%2C_%28Mehrangarh_Museum%29.jpg",
  "Bhagavata Purana":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Bhagavata_Purana_manuscript.jpg/800px-Bhagavata_Purana_manuscript.jpg",
  "Valmiki Ramayana":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Rama_Sita_Lakshmana_Hanuman.jpg/800px-Rama_Sita_Lakshmana_Hanuman.jpg",
  "Ramcharitmanas":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Tulsidas_composes_the_Ramcharitmanas.jpg/640px-Tulsidas_composes_the_Ramcharitmanas.jpg",
  "Mahabharata":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Radha_Krishna.jpg/800px-Radha_Krishna.jpg",
  "Devi Mahatmya":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Durga_Mahishasuramardini.jpg/800px-Durga_Mahishasuramardini.jpg",
  "Markandeya Purana":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Durga_Mahishasuramardini.jpg/640px-Durga_Mahishasuramardini.jpg",
  "Isha Upanishad":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Upanishads_manuscript.jpg/640px-Upanishads_manuscript.jpg",
  "Chandogya Upanishad":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Upanishads_manuscript.jpg/640px-Upanishads_manuscript.jpg",
};

export function sacredTextImageUrl(title: string, category: string): string {
  return titleArt[title] ?? categoryArt[category] ?? categoryArt["Vedas & Vedangas"];
}

export function sacredTextGradient(category: string): string {
  const gradients: Record<string, string> = {
    "Vedas & Vedangas": "from-amber-900/90 via-orange-900/75 to-red-950/80",
    Upanishads: "from-indigo-950/90 via-violet-900/75 to-purple-950/80",
    Puranas: "from-rose-950/90 via-red-900/75 to-orange-950/80",
    Gitas: "from-blue-950/90 via-sky-900/75 to-cyan-950/80",
    "Itihasa & Sacred Narratives":
      "from-emerald-950/90 via-green-900/75 to-lime-950/80",
    "Philosophy & Yoga": "from-slate-950/90 via-indigo-900/75 to-blue-950/80",
    "Deities & Sacred Lore":
      "from-fuchsia-950/90 via-pink-900/75 to-rose-950/80",
    "Ancestors & Dharma": "from-stone-950/90 via-amber-900/75 to-orange-950/80",
    "Hymns & Mantras": "from-teal-950/90 via-cyan-900/75 to-sky-950/80",
  };
  return gradients[category] ?? gradients["Itihasa & Sacred Narratives"];
}
