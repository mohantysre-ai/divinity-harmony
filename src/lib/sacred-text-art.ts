/** Hero artwork for sacred-text cards — large unique pool, title overrides, fit hints. */

const W = "https://upload.wikimedia.org/wikipedia/commons";

/** Verified Wikimedia artwork — manuscripts, miniatures, deities, temples. */
export const ART_POOL: readonly string[] = [
  `${W}/4/4e/Rigveda_MS2097.jpg`,
  `${W}/2/2f/Bhagavad_Gita_19th_century_illustrated_Sanskrit_manuscript%2C_with_72_coloured_miniatures%2C_unknown_loaction%2C_%28Mehrangarh_Museum%29.jpg`,
  `${W}/8/8a/Bhagavata_Purana_manuscript.jpg`,
  `${W}/6/6e/Upanishads_manuscript.jpg`,
  `${W}/4/4d/Rama_Sita_Lakshmana_Hanuman.jpg`,
  `${W}/6/6c/Radha_Krishna.jpg`,
  `${W}/b/bf/Shiva_as_the_Lord_of_Dance_LACMA_edit.jpg`,
  `${W}/c/c6/Vishnu_and_Lakshmi_on_Shesha_Naga%2C_ca_1870.jpg`,
  `${W}/5/5f/Durga_Mahishasuramardini.jpg`,
  `${W}/1/12/Saraswati.jpg`,
  `${W}/9/9b/Surya_deva.jpg`,
  `${W}/6/64/Ganesha_Basohli_miniature_circa_1730_Dubost_p73.jpg`,
  `${W}/4/46/Hanuman.jpg`,
  `${W}/6/6d/Lakshmi.jpg`,
  `${W}/5/5e/Yoga_meditation%2C_India%2C_1906.jpg`,
  `${W}/1/1e/Tulsidas_composes_the_Ramcharitmanas.jpg`,
  `${W}/3/3b/Kartikeya.jpg`,
  `${W}/7/7a/Angkor_Wat.jpg`,
  `${W}/0/0f/Brihadisvara_Temple%2C_Thanjavur%2C_Tamil_Nadu%2C_India.jpg`,
  `${W}/f/f4/Konark_Sun_Temple_01.jpg`,
  `${W}/8/8c/Meenakshi_Amman_Temple%2C_Madurai%2C_India.jpg`,
  `${W}/9/9a/Jagannath_Temple%2C_Puri%2C_Odisha%2C_India.jpg`,
  `${W}/1/1c/Golden_Temple_India.jpg`,
  `${W}/4/4b/Brihadeeswarar_Temple_Thanjavur.jpg`,
  `${W}/2/2a/Miniature_Painting_of_Rama%2C_Sita_and_Lakshmana_in_the_Forest.jpg`,
  `${W}/e/e8/Miniature_of_Krishna_playing_the_flute%2C_Pahari_style%2C_C1820.jpg`,
  `${W}/a/a4/Shiva_and_Parvati%2C_Pahari_painting%2C_c1800.jpg`,
  `${W}/d/d1/Miniature_of_the_Goddess_Durga%2C_Punjab_Hills%2C_c1760.jpg`,
  `${W}/9/9f/Miniature_painting_of_Ganesha%2C_India%2C_18th_century.jpg`,
  `${W}/6/6a/Palm-leaf_manuscript.jpg`,
  `${W}/0/0c/Indian_palm_leaf_manuscript%2C_before_809_CE%2C_ink_and_color_on_palm_leaf%2C_Honolulu_Academy_of_Arts.jpg`,
  `${W}/3/30/Sanskrit_Manuscript_on_Palm_Leaf%2C_Kerala.jpg`,
  `${W}/8/8d/Nataraja_Chennai_Museum.jpg`,
  `${W}/2/27/Vishnu_on_Garuda%2C_12th_century%2C_Nepal.jpg`,
  `${W}/1/10/Agnideva%2C_the_fire_god%2C_11th_century%2C_India%2C_sandstone%2C_Honolulu_Academy_of_Arts.jpg`,
  `${W}/5/57/Chola_Bronze_Nataraja%2C_Tamil_Nadu%2C_c1000.jpg`,
  `${W}/f/f9/Yakshi_%28female_nature_spirit%29%2C_1st_century_BCE%2C_India%2C_sandstone%2C_Honolulu_Academy_of_Arts.jpg`,
  `${W}/4/4a/Mahabharata_Manuscript%2C_18th_century%2C_India%2C_ink_and_color_on_paper%2C_Honolulu_Academy_of_Arts.jpg`,
  `${W}/9/97/Ramayana_manuscript%2C_17th_century%2C_India%2C_ink_and_color_on_paper%2C_Honolulu_Academy_of_Arts.jpg`,
  `${W}/b/b4/Gayatri1.jpg`,
  `${W}/2/2c/Varanasi_Ghat%2C_India.jpg`,
  `${W}/7/79/Temple_carving_at_Hampi%2C_Karnataka%2C_India.jpg`,
  `${W}/a/a7/Hampi_Virupaksha_Temple_Gopuram.jpg`,
  `${W}/3/39/Bas-reliefs_at_Prambanan%2C_Java%2C_Indonesia.jpg`,
  `${W}/6/61/Borobudur%2C_Java%2C_Indonesia.jpg`,
  `${W}/d/d9/Ajanta%2C_cave_1%2C_general_view.jpg`,
  `${W}/8/8e/Ajanta_Cave_26%2C_Mahaparinirvana_of_Buddha.jpg`,
  `${W}/1/1f/Ellora_cave_16%2C_Kailasanath_Temple.jpg`,
  `${W}/5/5a/Ellora%2C_cave_29%2C_Dhumar_Lena.jpg`,
  `${W}/c/c5/Mural_painting_in_Lepakshi%2C_Andhra_Pradesh%2C_India.jpg`,
  `${W}/9/93/Mural_in_Padmanabhapuram_Palace%2C_Kerala.jpg`,
  `${W}/4/4f/Chola_bronze%2C_Parvati%2C_11th_century.jpg`,
  `${W}/2/28/Shiva_Nataraja%2C_Chola_period%2C_11th_century.jpg`,
  `${W}/7/7c/Miniature_painting_of_a_rishi%2C_India%2C_18th_century.jpg`,
  `${W}/a/ab/Miniature_painting_of_a_yogi%2C_India%2C_18th_century.jpg`,
  `${W}/e/e3/Om_symbol.svg`,
];

const titleArt: Record<string, string> = {
  "Rigveda Samhita": ART_POOL[0],
  "Samaveda Samhita": ART_POOL[32],
  "Shukla Yajurveda": ART_POOL[0],
  "Krishna Yajurveda": ART_POOL[29],
  "Atharvaveda Samhita": ART_POOL[10],
  "Bhagavad Gita": ART_POOL[1],
  "Bhagavata Purana": ART_POOL[2],
  "Valmiki Ramayana": ART_POOL[4],
  Ramcharitmanas: ART_POOL[12],
  Mahabharata: ART_POOL[37],
  "Devi Mahatmya": ART_POOL[6],
  "Markandeya Purana": ART_POOL[6],
  "Shiva Purana": ART_POOL[5],
  "Vishnu Purana": ART_POOL[7],
  "Isha Upanishad": ART_POOL[33],
  "Chandogya Upanishad": ART_POOL[3],
  "Kena Upanishad": ART_POOL[34],
  "Katha Upanishad": ART_POOL[13],
  "Brihadaranyaka Upanishad": ART_POOL[3],
  "Mandukya Upanishad": ART_POOL[52],
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

/** Spread images across catalog — id + category + title hash avoids repeats on nearby cards. */
function poolIndex(id: number, category: string, title: string): number {
  const cat = CATEGORY_INDEX[category] ?? 0;
  const titleHash = [...title].reduce((s, c) => s + c.charCodeAt(0), 0);
  return (id * 17 + cat * 31 + titleHash) % ART_POOL.length;
}

export function sacredTextImageUrl(title: string, category: string, id = 0): string {
  return titleArt[title] ?? ART_POOL[poolIndex(id, category, title)];
}

/** CSS object-position hints so faces / manuscripts center in the crop. */
export function sacredTextImageFit(category: string, id: number): string {
  const pos = ["object-center", "object-top", "object-[center_20%]", "object-[center_30%]"];
  return pos[(id + (CATEGORY_INDEX[category] ?? 0)) % pos.length];
}

export function sacredTextGradient(category: string): string {
  const gradients: Record<string, string> = {
    "Vedas & Vedangas": "from-amber-950/80 via-orange-900/60 to-red-950/70",
    Upanishads: "from-indigo-950/80 via-violet-900/60 to-purple-950/70",
    Puranas: "from-rose-950/80 via-red-900/60 to-orange-950/70",
    Gitas: "from-blue-950/80 via-sky-900/60 to-cyan-950/70",
    "Itihasa & Sacred Narratives":
      "from-emerald-950/80 via-green-900/60 to-lime-950/70",
    "Philosophy & Yoga": "from-slate-950/80 via-indigo-900/60 to-blue-950/70",
    "Deities & Sacred Lore":
      "from-fuchsia-950/80 via-pink-900/60 to-rose-950/70",
    "Ancestors & Dharma": "from-stone-950/80 via-amber-900/60 to-orange-950/70",
    "Hymns & Mantras": "from-teal-950/80 via-cyan-900/60 to-sky-950/70",
  };
  return gradients[category] ?? gradients["Itihasa & Sacred Narratives"];
}
