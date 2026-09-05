export type VedicHeritageEntry = {
  id: string;
  title: string;
  category: "Samhitas" | "Brahmanas" | "Aranyakas" | "Upanishads" | "Vedangas" | "Rituals";
  url: string;
  format: "portal" | "flipbook";
};

const portal = (id: string, title: string, category: VedicHeritageEntry["category"], path: string): VedicHeritageEntry => ({
  id,
  title,
  category,
  url: `https://vedicheritage.gov.in${path}`,
  format: "portal",
});

export const vedicHeritageCatalog: VedicHeritageEntry[] = [
  portal("rigveda", "Rigveda Samhitas", "Samhitas", "/samhitas/rigveda/"),
  portal("rigveda-maharashtra", "Rigveda Shakala — Maharashtra Tradition", "Samhitas", "/samhitas/rigveda/shakala-samhita/maharashtra-tradition/"),
  portal("rigveda-kerala", "Rigveda Shakala — Kerala Tradition", "Samhitas", "/samhitas/rigveda/shakala-samhita/mandal-01/"),
  portal("rigveda-ashvalayana", "Ashvalayana Samhita", "Samhitas", "/samhitas/rigveda/ashvalayana-samhita/"),
  portal("yajurveda", "Yajurveda Samhitas", "Samhitas", "/samhitas/yajurveda/"),
  portal("vajasaneyi-madhyandina", "Vajasaneyi Samhita (Madhyandina)", "Samhitas", "/samhitas/yajurveda/vajasneyi-madhyandina-samhita/"),
  portal("vajasaneyi-kanva", "Vajasaneyi Samhita (Kanva)", "Samhitas", "/samhitas/yajurveda/vajasaneyi-kanva-samhita/"),
  portal("taittiriya-samhita", "Taittiriya Samhita", "Samhitas", "/samhitas/yajurveda/taittiriya-samhita/"),
  portal("taittiriya-samhita-video", "Taittiriya Samhita — Video", "Samhitas", "/samhitas/yajurveda/taittiriya-samhita-video/"),
  portal("taittiriya-samhita-learning", "Taittiriya Samhita — Learning", "Samhitas", "/samhitas/yajurveda/taittiriya-samhita-learning-purpose/"),
  portal("samaveda", "Samaveda Samhitas", "Samhitas", "/samhitas/samaveda-samhitas/"),
  portal("kauthuma", "Kauthuma Samhita", "Samhitas", "/samhitas/samaveda-samhitas/kauthuma-samhita/"),
  portal("jaiminiya-samhita", "Jaiminiya Samhita", "Samhitas", "/samhitas/samaveda-samhitas/jaiminiya-samhita-2/"),
  portal("ranayaniya", "Ranayaniya Samhita", "Samhitas", "/samhitas/samaveda-samhitas/ranayaniya-samhita/"),
  portal("atharvaveda", "Atharvaveda Samhitas", "Samhitas", "/samhitas/atharvaveda-samhitas/"),
  portal("atharvaveda-video", "Atharvaveda Shaunaka Samhita — Video", "Samhitas", "/samhitas/atharvaveda-samhitas/atharvaveda-shaunaka-samhita/"),
  portal("atharvaveda-audio", "Atharvaveda Shaunaka Samhita — Audio", "Samhitas", "/samhitas/atharvaveda-samhitas/shaunaka-samhita/"),

  portal("aitareya-brahmana", "Aitareya Brahmana", "Brahmanas", "/brahmanas/aitareya-brahmana/"),
  portal("kausitaki-brahmana", "Kausitaki (Shankhayana) Brahmana", "Brahmanas", "/brahmanas/kausitaki-shankhyayana-brahmana/"),
  portal("shatapatha-madhyandina", "Shatapatha Brahmana (Madhyandina)", "Brahmanas", "/brahmanas/shatapatha-brahmana/"),
  portal("shatapatha-kanva", "Shatapatha Brahmana (Kanva)", "Brahmanas", "/brahmanas/kanva-shatapatha-brahmanas/"),
  portal("taittiriya-brahmana", "Taittiriya Brahmana", "Brahmanas", "/brahmanas/taittiriya-brhamana/"),
  portal("tandya-brahmana", "Tandya Brahmana", "Brahmanas", "/brahmanas/tandya-brahmana/"),
  portal("shadavimsa-brahmana", "Shadavimsa Brahmana", "Brahmanas", "/brahmanas/shadavimsa-brahmana/"),
  portal("samavidhana-brahmana", "Samavidhana Brahmana", "Brahmanas", "/brahmanas/samavidhana-brahmana/"),
  portal("aarsheya-brahmana", "Aarsheya Brahmana", "Brahmanas", "/brahmanas/aarsheya-brahmana/"),
  portal("devatadhyaya-brahmana", "Devatadhyaya Brahmana", "Brahmanas", "/brahmanas/devatadhyaya-brahmana/"),
  portal("chandogyopanishad-brahmana", "Chandogyopanishad Brahmana", "Brahmanas", "/brahmanas/chandogyopanishad-brahmana/"),
  portal("samhitopanishad-brahmana", "Samhitopanishad Brahmana", "Brahmanas", "/samhitopanishad-brahmana/"),
  portal("vansha-brahmana", "Vansha Brahmana", "Brahmanas", "/brahmanas/vansha-brahmana/"),
  portal("jaiminiya-brahmana", "Jaiminiya Brahmana", "Brahmanas", "/brahmanas/jaiminiya-brhamana/"),
  portal("jaiminiyopanishad-brahmana", "Jaiminiyopanishad Brahmana", "Brahmanas", "/brahmanas/jaiminiyopanishad-brahmana/"),
  portal("gopatha-brahmana", "Gopatha Brahmana", "Brahmanas", "/brahmanas/gopatha-brhamana/"),
  {
    id: "kanva-shatapatha-vol-1",
    title: "Kanva Shatapatha Brahmanam — Volume I",
    category: "Brahmanas",
    url: "https://vedicheritage.gov.in/flipbook/Kanva_Shatapatha_Brahmanam_Vol_I/#book/1",
    format: "flipbook",
  },

  portal("aitareya-aranyaka", "Aitareya Aranyaka", "Aranyakas", "/aranyakas/aitareyaranyaka/"),
  portal("sankhyayana-aranyaka", "Sankhyayana Aranyaka", "Aranyakas", "/aranyakas/sankhyayana-aranyaka/"),
  portal("brihadaranyaka", "Brihadaranyaka", "Aranyakas", "/aranyakas/brihadaranyaka/"),
  portal("taittiriya-aranyaka", "Taittiriya Aranyaka", "Aranyakas", "/aranyakas/taittiriya-aranyaka/"),
  portal("talavakara-aranyaka", "Talavakara Aranyaka", "Aranyakas", "/aranyakas/talavakararanyaka/"),

  portal("aitareya-upanishad", "Aitareya Upanishad", "Upanishads", "/upanishads/aitareyopanishad/"),
  portal("isha-upanishad", "Isha Upanishad", "Upanishads", "/upanishads/ishavasyopanishad/"),
  portal("brihadaranyaka-upanishad", "Brihadaranyaka Upanishad", "Upanishads", "/upanishads/brihadaranyakopanishad/"),
  portal("taittiriya-upanishad", "Taittiriya Upanishad", "Upanishads", "/upanishads/taittiriya-upanishads/"),
  portal("shvetashvatara-upanishad", "Shvetashvatara Upanishad", "Upanishads", "/upanishads/shwetashwataropanishad/"),
  portal("maitrayani-upanishad", "Maitrayani Upanishad", "Upanishads", "/upanishads/maitrayani-upanishad/"),
  portal("katha-upanishad", "Katha Upanishad", "Upanishads", "/upanishads/kathopanishad/"),
  portal("arsheya-upanishad", "Arsheya Upanishad", "Upanishads", "/upanishads/aarsheyopanishad/"),
  portal("kena-upanishad", "Kena Upanishad", "Upanishads", "/upanishads/kenopanisad/"),
  portal("chandogya-upanishad", "Chandogya Upanishad", "Upanishads", "/upanishads/chandogyopanishad/"),
  portal("prashna-upanishad", "Prashna Upanishad", "Upanishads", "/upanishads/prashnopanishad/"),
  portal("mundaka-upanishad", "Mundaka Upanishad", "Upanishads", "/upanishads/mundakopanishad/"),
  portal("mandukya-upanishad", "Mandukya Upanishad", "Upanishads", "/upanishads/mandukyopanishad/"),

  portal("shiksha", "Shiksha", "Vedangas", "/vedangas/shiksha/"),
  portal("kalpa", "Kalpa", "Vedangas", "/vedangas/kalpa/"),
  portal("vyakarana", "Vyakarana", "Vedangas", "/vedangas/vyakarana/"),
  portal("nirukta", "Nirukta", "Vedangas", "/vedangas/nirukta/"),
  portal("chandas", "Chandas", "Vedangas", "/vedangas/chanda/"),
  portal("jyotisha", "Jyotisha", "Vedangas", "/vedangas/jyotisha/"),

  portal("rituals", "Vedic Rituals", "Rituals", "/rituals/"),
  portal("upaveda", "Upaveda", "Rituals", "/upaveda/"),
  portal("manuscripts", "Vedic Manuscripts", "Rituals", "/vedic-manuscripts-search/"),
  portal("published-books", "Published Books", "Rituals", "/published-books/"),
];

export const vedicHeritageCategories = [
  "All",
  "Samhitas",
  "Brahmanas",
  "Aranyakas",
  "Upanishads",
  "Vedangas",
  "Rituals",
] as const;

// Enabled by default at the project owner's direction. Deployments can still
// disable all outbound cards immediately with an explicit false value.
export const vedicHeritageLinksEnabled = import.meta.env.VITE_VEDIC_HERITAGE_LINKS_ENABLED !== "false";
