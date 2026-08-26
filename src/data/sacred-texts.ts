export type SacredText = {
  id: number;
  title: string;
  category: string;
  tradition: string;
  description: string;
  topics: string[];
};

type SacredTextSeed = Omit<SacredText, 'id'>;

const seeds: SacredTextSeed[] = [
  // Vedas, Brahmanas, Aranyakas and Vedangas (12)
  { title: 'Rigveda Samhita', category: 'Vedas & Vedangas', tradition: 'Shruti · Vedic', description: 'The oldest Vedic collection, preserving hymns to Agni, Indra, Soma, Ushas, Varuna and cosmic principles such as rita.', topics: ['hymns', 'deities', 'cosmic order'] },
  { title: 'Samaveda Samhita', category: 'Vedas & Vedangas', tradition: 'Shruti · Vedic chant', description: 'A liturgical collection arranged primarily for melodic chanting by the udgatri priests during soma rituals.', topics: ['chanting', 'sama melodies', 'ritual'] },
  { title: 'Shukla Yajurveda', category: 'Vedas & Vedangas', tradition: 'Shruti · Vedic ritual', description: 'The White Yajurveda, separating sacrificial formulas from explanatory prose and preserving the Vajasaneyi Samhita.', topics: ['yajna', 'ritual formulas', 'Vajasaneyi'] },
  { title: 'Krishna Yajurveda', category: 'Vedas & Vedangas', tradition: 'Shruti · Vedic ritual', description: 'The Black Yajurveda, interweaving ritual formulas and explanations across recensions such as the Taittiriya Samhita.', topics: ['yajna', 'Taittiriya', 'sacrificial lore'] },
  { title: 'Atharvaveda Samhita', category: 'Vedas & Vedangas', tradition: 'Shruti · Vedic', description: 'Hymns concerning healing, protection, household life, kingship, reconciliation and profound speculation on existence.', topics: ['healing', 'household rites', 'philosophy'] },
  { title: 'Aitareya Brahmana', category: 'Vedas & Vedangas', tradition: 'Rigvedic Brahmana', description: 'A prose guide to Rigvedic sacrifice, priestly roles and the symbolic interpretation of major soma ceremonies.', topics: ['soma sacrifice', 'priesthood', 'ritual meaning'] },
  { title: 'Shatapatha Brahmana', category: 'Vedas & Vedangas', tradition: 'Shukla Yajurvedic Brahmana', description: 'An extensive ritual and theological work containing yajna exposition, creation accounts and the flood story of Manu.', topics: ['ritual', 'Manu', 'cosmology'] },
  { title: 'Taittiriya Brahmana', category: 'Vedas & Vedangas', tradition: 'Krishna Yajurvedic Brahmana', description: 'Ritual explanations connected with the Taittiriya school, including fire rites, seasonal sacrifices and sacred formulas.', topics: ['agni', 'seasonal rites', 'yajna'] },
  { title: 'Vedic Aranyakas', category: 'Vedas & Vedangas', tradition: 'Shruti · Forest texts', description: 'Meditative “forest texts” that reinterpret outer sacrifice through symbolism, contemplation and inner knowledge.', topics: ['meditation', 'symbolism', 'inner sacrifice'] },
  { title: 'Six Vedangas', category: 'Vedas & Vedangas', tradition: 'Vedic auxiliary sciences', description: 'An overview of phonetics, ritual, grammar, etymology, meter and astronomy—the disciplines used to preserve and apply the Vedas.', topics: ['shiksha', 'vyakarana', 'jyotisha'] },
  { title: 'Grihya Sutras', category: 'Vedas & Vedangas', tradition: 'Kalpa · Domestic rites', description: 'Manuals for household samskaras including birth, naming, initiation, marriage, daily offerings and funerary observances.', topics: ['samskara', 'marriage', 'household rites'] },
  { title: 'Shrauta Sutras', category: 'Vedas & Vedangas', tradition: 'Kalpa · Public sacrifice', description: 'Technical manuals describing large-scale Vedic sacrifices performed with multiple sacred fires and specialist priests.', topics: ['shrauta ritual', 'sacred fires', 'priests'] },

  // Principal and influential Upanishads (14)
  { title: 'Isha Upanishad', category: 'Upanishads', tradition: 'Shukla Yajurveda', description: 'A concise meditation on the indwelling Lord, renunciation, action and seeing all beings within the Self.', topics: ['atman', 'renunciation', 'unity'] },
  { title: 'Kena Upanishad', category: 'Upanishads', tradition: 'Samaveda', description: 'Asks what power directs mind, speech and senses, teaching Brahman as the reality behind every capacity.', topics: ['Brahman', 'mind', 'Uma Haimavati'] },
  { title: 'Katha Upanishad', category: 'Upanishads', tradition: 'Krishna Yajurveda', description: 'Nachiketa learns from Yama about death, the immortal Self, disciplined choice and the chariot image of human life.', topics: ['Nachiketa', 'Yama', 'immortality'] },
  { title: 'Prashna Upanishad', category: 'Upanishads', tradition: 'Atharvaveda', description: 'Six seekers ask about creation, prana, consciousness, Om and the person of sixteen parts.', topics: ['six questions', 'prana', 'Om'] },
  { title: 'Mundaka Upanishad', category: 'Upanishads', tradition: 'Atharvaveda', description: 'Distinguishes higher knowledge of Brahman from lower learning and uses the image of two birds on one tree.', topics: ['higher knowledge', 'two birds', 'liberation'] },
  { title: 'Mandukya Upanishad', category: 'Upanishads', tradition: 'Atharvaveda', description: 'Maps Om to waking, dreaming, deep sleep and turiya, the non-dual fourth state of consciousness.', topics: ['Om', 'four states', 'turiya'] },
  { title: 'Taittiriya Upanishad', category: 'Upanishads', tradition: 'Krishna Yajurveda', description: 'Explores education, ethical conduct, the five sheaths, bliss and Brahman as truth, knowledge and infinity.', topics: ['five koshas', 'bliss', 'student ethics'] },
  { title: 'Aitareya Upanishad', category: 'Upanishads', tradition: 'Rigveda', description: 'Reflects on cosmic creation, birth and consciousness, culminating in the insight that awareness is Brahman.', topics: ['creation', 'consciousness', 'prajnanam brahma'] },
  { title: 'Chandogya Upanishad', category: 'Upanishads', tradition: 'Samaveda', description: 'A major collection of teachings on sacred sound, meditation and identity, including “Tat Tvam Asi.”', topics: ['Tat Tvam Asi', 'Uddalaka', 'meditation'] },
  { title: 'Brihadaranyaka Upanishad', category: 'Upanishads', tradition: 'Shukla Yajurveda', description: 'The great forest Upanishad discusses the Self, neti neti, rebirth and dialogues of Yajnavalkya, Maitreyi and Gargi.', topics: ['Yajnavalkya', 'neti neti', 'Gargi'] },
  { title: 'Shvetashvatara Upanishad', category: 'Upanishads', tradition: 'Krishna Yajurveda', description: 'Combines meditation, yoga and theistic language centered on Rudra as the supreme divine reality.', topics: ['Rudra', 'yoga', 'theism'] },
  { title: 'Kaushitaki Upanishad', category: 'Upanishads', tradition: 'Rigveda', description: 'Teachings on prana, consciousness, rebirth and the soul’s symbolic journey after death.', topics: ['prana', 'afterlife journey', 'knowledge'] },
  { title: 'Maitri Upanishad', category: 'Upanishads', tradition: 'Krishna Yajurveda', description: 'Discusses the Self, mind, time, rebirth and a sixfold system of contemplative yoga.', topics: ['mind', 'time', 'sixfold yoga'] },
  { title: 'Mahanarayana Upanishad', category: 'Upanishads', tradition: 'Krishna Yajurveda', description: 'A devotional and ritual anthology honoring Narayana, Rudra, Surya and other divine forms through prayers and meditations.', topics: ['Narayana', 'Rudra', 'prayers'] },

  // Eighteen Mahapuranas (18)
  { title: 'Brahma Purana', category: 'Puranas', tradition: 'Mahapurana', description: 'Sacred geography, creation traditions, royal lineages and pilgrimage praise, especially connected with Odisha.', topics: ['creation', 'pilgrimage', 'Odisha'] },
  { title: 'Padma Purana', category: 'Puranas', tradition: 'Vaishnava Mahapurana', description: 'A vast compilation on cosmology, pilgrimage, dharma, sacred months and devotion to Vishnu.', topics: ['Vishnu', 'dharma', 'sacred places'] },
  { title: 'Vishnu Purana', category: 'Puranas', tradition: 'Vaishnava Mahapurana', description: 'A systematic account of creation, avatars, dynasties, cosmic cycles and devotion to Vishnu.', topics: ['avatars', 'dynasties', 'cosmic cycles'] },
  { title: 'Shiva Purana', category: 'Puranas', tradition: 'Shaiva Mahapurana', description: 'Narratives and theology of Shiva, Shakti, linga worship, sacred sites and paths of devotion.', topics: ['Shiva', 'linga', 'Shakti'] },
  { title: 'Bhagavata Purana', category: 'Puranas', tradition: 'Vaishnava Mahapurana', description: 'Celebrates bhakti through accounts of Vishnu’s avatars, especially the childhood and teachings of Krishna.', topics: ['Krishna', 'bhakti', 'avatars'] },
  { title: 'Narada Purana', category: 'Puranas', tradition: 'Vaishnava Mahapurana', description: 'An encyclopedic work on devotion, pilgrimage, festivals, temple worship, philosophy and religious observance.', topics: ['Narada', 'festivals', 'temple worship'] },
  { title: 'Markandeya Purana', category: 'Puranas', tradition: 'Mahapurana', description: 'Contains diverse legends and the Devi Mahatmya, the foundational celebration of the Goddess defeating cosmic disorder.', topics: ['Devi Mahatmya', 'Markandeya', 'Durga'] },
  { title: 'Agni Purana', category: 'Puranas', tradition: 'Mahapurana', description: 'An encyclopedic text covering ritual, iconography, polity, architecture, medicine, grammar and sacred lore.', topics: ['iconography', 'architecture', 'ritual'] },
  { title: 'Bhavishya Purana', category: 'Puranas', tradition: 'Mahapurana', description: 'A layered compilation on rites, festivals, solar worship and later historical or prophetic-style narratives.', topics: ['festivals', 'Surya', 'later traditions'] },
  { title: 'Brahmavaivarta Purana', category: 'Puranas', tradition: 'Krishna tradition', description: 'Centers Krishna, Radha, Prakriti and Ganesha within a devotional theology of divine manifestation.', topics: ['Radha-Krishna', 'Prakriti', 'Ganesha'] },
  { title: 'Linga Purana', category: 'Puranas', tradition: 'Shaiva Mahapurana', description: 'Explains the linga as a cosmic sign of Shiva and presents creation, worship, pilgrimage and sacred observances.', topics: ['linga', 'Shiva', 'cosmology'] },
  { title: 'Varaha Purana', category: 'Puranas', tradition: 'Vaishnava Mahapurana', description: 'Teachings associated with Vishnu’s Varaha form, with strong attention to pilgrimage, worship and sacred geography.', topics: ['Varaha', 'pilgrimage', 'Vishnu'] },
  { title: 'Skanda Purana', category: 'Puranas', tradition: 'Shaiva Mahapurana', description: 'The largest Purana, famous for regional sacred geography, pilgrimage mahatmyas and stories of Shiva’s family.', topics: ['Skanda', 'pilgrimage', 'sacred geography'] },
  { title: 'Vamana Purana', category: 'Puranas', tradition: 'Mahapurana', description: 'Contains cosmology, pilgrimage material and narratives connected with Vamana, Shiva and sacred landscapes.', topics: ['Vamana', 'Shiva', 'pilgrimage'] },
  { title: 'Kurma Purana', category: 'Puranas', tradition: 'Vaishnava-Shaiva synthesis', description: 'Teachings voiced through the Kurma avatar on cosmology, yoga, pilgrimage and the unity of major divine traditions.', topics: ['Kurma', 'yoga', 'Hari-Hara'] },
  { title: 'Matsya Purana', category: 'Puranas', tradition: 'Vaishnava Mahapurana', description: 'Matsya’s teachings to Manu on the flood, kingship, temple design, iconography and religious duties.', topics: ['Matsya', 'Manu', 'temple design'] },
  { title: 'Garuda Purana', category: 'Puranas', tradition: 'Vaishnava Mahapurana', description: 'A broad work on Vishnu devotion, ethics, medicine and after-death traditions; funerary passages form only one portion.', topics: ['afterlife', 'funerary rites', 'Vishnu'] },
  { title: 'Brahmanda Purana', category: 'Puranas', tradition: 'Mahapurana', description: 'Cosmology, dynasties and sacred geography, also preserving the Lalita Sahasranama within the Lalitopakhyana.', topics: ['cosmos', 'Lalita', 'dynasties'] },

  // Gitas and teaching dialogues (12)
  { title: 'Bhagavad Gita', category: 'Gitas', tradition: 'Mahabharata · Vaishnava', description: 'Krishna teaches Arjuna about dharma, action, knowledge, meditation, devotion and surrender on the battlefield.', topics: ['Krishna', 'dharma', 'yoga'] },
  { title: 'Uddhava Gita', category: 'Gitas', tradition: 'Bhagavata Purana', description: 'Krishna’s final extended teachings to Uddhava on detachment, devotion, wisdom and spiritual discipline.', topics: ['Uddhava', 'bhakti', 'detachment'] },
  { title: 'Ashtavakra Gita', category: 'Gitas', tradition: 'Advaita dialogue', description: 'A radical non-dual dialogue between Ashtavakra and King Janaka on freedom through knowledge of pure awareness.', topics: ['Advaita', 'Janaka', 'awareness'] },
  { title: 'Avadhuta Gita', category: 'Gitas', tradition: 'Advaita · Dattatreya', description: 'A poetic declaration of the Self as free, indivisible consciousness beyond social and conceptual limitations.', topics: ['Dattatreya', 'non-duality', 'freedom'] },
  { title: 'Anu Gita', category: 'Gitas', tradition: 'Mahabharata', description: 'A later Krishna-Arjuna dialogue revisiting liberation, knowledge and disciplined life after the Kurukshetra war.', topics: ['Krishna', 'liberation', 'Mahabharata'] },
  { title: 'Ganesha Gita', category: 'Gitas', tradition: 'Ganesha Purana', description: 'Ganesha teaches King Varenya about yoga, knowledge, duty and devotion to the supreme reality.', topics: ['Ganesha', 'yoga', 'duty'] },
  { title: 'Devi Gita', category: 'Gitas', tradition: 'Devi Bhagavata Purana', description: 'The Goddess explains her supreme nature, cosmic manifestation, yoga, devotion and modes of worship.', topics: ['Devi', 'Shakti', 'bhakti'] },
  { title: 'Ishvara Gita', category: 'Gitas', tradition: 'Kurma Purana · Shaiva', description: 'A teaching attributed to Shiva on knowledge, meditation, yoga and realization of the supreme Lord.', topics: ['Shiva', 'meditation', 'knowledge'] },
  { title: 'Rama Gita', category: 'Gitas', tradition: 'Adhyatma Ramayana', description: 'Rama instructs Lakshmana on the Self, ignorance, spiritual discipline and liberating knowledge.', topics: ['Rama', 'Lakshmana', 'Vedanta'] },
  { title: 'Ribhu Gita', category: 'Gitas', tradition: 'Shaiva-Advaita', description: 'Ribhu’s sustained instruction on non-dual awareness and the unreality of limiting identification.', topics: ['Ribhu', 'Advaita', 'Self'] },
  { title: 'Guru Gita', category: 'Gitas', tradition: 'Skanda Purana tradition', description: 'A dialogue of Shiva and Parvati on the guru principle, initiation, contemplation and reverence for spiritual teaching.', topics: ['guru', 'Shiva-Parvati', 'initiation'] },
  { title: 'Vyadha Gita', category: 'Gitas', tradition: 'Mahabharata', description: 'A householder butcher teaches that sincere performance of one’s duty can embody wisdom and spiritual integrity.', topics: ['dharma', 'householder', 'ethical action'] },

  // Itihasa, sacred narratives and devotional classics (10)
  { title: 'Valmiki Ramayana', category: 'Itihasa & Sacred Narratives', tradition: 'Itihasa', description: 'The Sanskrit epic of Rama, Sita, Lakshmana and Hanuman, exploring dharma, kingship, loyalty, exile and return.', topics: ['Rama', 'Sita', 'Hanuman'] },
  { title: 'Ramcharitmanas', category: 'Itihasa & Sacred Narratives', tradition: 'Rama bhakti · Awadhi', description: 'Tulsidas’s devotional retelling of Rama’s story, central to North Indian performance, worship and ethical imagination.', topics: ['Tulsidas', 'Rama bhakti', 'Awadhi'] },
  { title: 'Adhyatma Ramayana', category: 'Itihasa & Sacred Narratives', tradition: 'Vedantic Ramayana', description: 'A spiritualized Ramayana presenting Rama as supreme Brahman and emphasizing devotion joined with self-knowledge.', topics: ['Rama', 'Vedanta', 'bhakti'] },
  { title: 'Mahabharata', category: 'Itihasa & Sacred Narratives', tradition: 'Itihasa', description: 'The epic of the Kuru dynasty, examining dharma through family conflict, pilgrimage, statecraft, war and renunciation.', topics: ['Pandavas', 'Kauravas', 'dharma'] },
  { title: 'Harivamsha', category: 'Itihasa & Sacred Narratives', tradition: 'Mahabharata supplement', description: 'Narratives of creation, the lunar dynasty and Krishna’s lineage and early deeds, traditionally appended to the Mahabharata.', topics: ['Krishna', 'Yadavas', 'genealogy'] },
  { title: 'Yoga Vasistha', category: 'Itihasa & Sacred Narratives', tradition: 'Vedanta · Narrative philosophy', description: 'Vasistha teaches Rama through layered stories about mind, appearance, consciousness, effort and liberation.', topics: ['Vasistha', 'Rama', 'mind'] },
  { title: 'Devi Mahatmya', category: 'Itihasa & Sacred Narratives', tradition: 'Shakta', description: 'The Goddess defeats Madhu-Kaitabha, Mahishasura and Shumbha-Nishumbha, revealing divine power as protector and liberator.', topics: ['Durga', 'Mahishasura', 'Shakti'] },
  { title: 'Krishna Karnamrita', category: 'Itihasa & Sacred Narratives', tradition: 'Krishna bhakti', description: 'Lyrical Sanskrit devotion celebrating the beauty, play and intimate presence of Krishna.', topics: ['Krishna', 'devotional poetry', 'lila'] },
  { title: 'Narada Bhakti Sutras', category: 'Itihasa & Sacred Narratives', tradition: 'Bhakti', description: 'A concise aphoristic guide describing supreme love, the qualities of devotees and the practice of devotion.', topics: ['bhakti', 'Narada', 'divine love'] },
  { title: 'Shandilya Bhakti Sutras', category: 'Itihasa & Sacred Narratives', tradition: 'Bhakti', description: 'A classical inquiry into devotion as unwavering attachment to the divine and its relation to knowledge and practice.', topics: ['devotion', 'Shandilya', 'spiritual practice'] },

  // Darshanas, yoga and foundational philosophy (10)
  { title: 'Brahma Sutras', category: 'Philosophy & Yoga', tradition: 'Vedanta', description: 'Badarayana’s aphorisms systematize Upanishadic teaching and became the foundation for diverse Vedanta commentaries.', topics: ['Vedanta', 'Brahman', 'commentarial traditions'] },
  { title: 'Yoga Sutras of Patanjali', category: 'Philosophy & Yoga', tradition: 'Yoga Darshana', description: 'A systematic account of mental discipline, eight-limbed yoga, concentration and freedom from affliction.', topics: ['ashtanga', 'samadhi', 'chitta'] },
  { title: 'Samkhya Karika', category: 'Philosophy & Yoga', tradition: 'Samkhya', description: 'Ishvarakrishna’s concise exposition of purusha, prakriti, the tattvas, suffering and discriminative liberation.', topics: ['purusha', 'prakriti', 'tattvas'] },
  { title: 'Nyaya Sutras', category: 'Philosophy & Yoga', tradition: 'Nyaya', description: 'Foundational aphorisms on reliable knowledge, reasoning, debate, error and the means to liberation.', topics: ['logic', 'knowledge', 'inference'] },
  { title: 'Vaisheshika Sutras', category: 'Philosophy & Yoga', tradition: 'Vaisheshika', description: 'An analytic philosophy classifying reality through substance, quality, action, universality and particularity.', topics: ['categories', 'atoms', 'metaphysics'] },
  { title: 'Mimamsa Sutras', category: 'Philosophy & Yoga', tradition: 'Purva Mimamsa', description: 'Jaimini’s inquiry into Vedic injunction, ritual duty, language and the authority of sacred revelation.', topics: ['dharma', 'Vedic interpretation', 'ritual'] },
  { title: 'Tattvartha Sutra Overview', category: 'Philosophy & Yoga', tradition: 'Comparative Indian philosophy', description: 'A respectful comparative entry on the Jain synthesis of knowledge, conduct, karma and liberation alongside Hindu darshanas.', topics: ['Indian philosophy', 'karma', 'comparison'] },
  { title: 'Vedantasara', category: 'Philosophy & Yoga', tradition: 'Advaita Vedanta', description: 'A concise primer on qualifications, superimposition, the subtle and gross bodies, knowledge and liberation.', topics: ['Advaita', 'three bodies', 'moksha'] },
  { title: 'Panchadashi', category: 'Philosophy & Yoga', tradition: 'Advaita Vedanta', description: 'Vidyaranya’s teaching text explores discrimination, illumination and bliss through fifteen structured chapters.', topics: ['Vidyaranya', 'consciousness', 'bliss'] },
  { title: 'Hatha Yoga Pradipika', category: 'Philosophy & Yoga', tradition: 'Hatha Yoga', description: 'A classical manual on asana, pranayama, mudra and samadhi, traditionally practiced with qualified guidance.', topics: ['asana', 'pranayama', 'mudra'] },

  // Deities, theology and sacred symbolism (10)
  { title: 'Vishnu and the Dashavatara', category: 'Deities & Sacred Lore', tradition: 'Vaishnava', description: 'An introduction to Vishnu as preserver and to the ten-avatar framework through which divine protection restores dharma.', topics: ['Vishnu', 'Dashavatara', 'dharma'] },
  { title: 'Shiva: Forms and Sacred Symbols', category: 'Deities & Sacred Lore', tradition: 'Shaiva', description: 'Explains Shiva as yogi, householder, Nataraja, Dakshinamurti and linga, with the meanings of his major symbols.', topics: ['Shiva', 'Nataraja', 'linga'] },
  { title: 'Devi and the Mahavidyas', category: 'Deities & Sacred Lore', tradition: 'Shakta', description: 'Introduces the supreme Goddess and ten Mahavidya forms as distinct theological and contemplative expressions of Shakti.', topics: ['Devi', 'Mahavidyas', 'Shakti'] },
  { title: 'Ganesha: Wisdom and Beginnings', category: 'Deities & Sacred Lore', tradition: 'Ganapatya', description: 'Stories, symbols and theology of Ganesha as remover of obstacles, guardian of thresholds and lord of discernment.', topics: ['Ganesha', 'obstacles', 'wisdom'] },
  { title: 'Surya and the Adityas', category: 'Deities & Sacred Lore', tradition: 'Saura · Vedic', description: 'Explores Surya, Savitr and the Adityas as forms of light, order, health, vision and moral guardianship.', topics: ['Surya', 'Savitr', 'Adityas'] },
  { title: 'Hanuman: Bhakti, Strength and Service', category: 'Deities & Sacred Lore', tradition: 'Rama bhakti', description: 'Hanuman’s epic role and symbolism as the union of devotion, courage, disciplined power and selfless service.', topics: ['Hanuman', 'seva', 'Rama'] },
  { title: 'Lakshmi: Prosperity and Auspiciousness', category: 'Deities & Sacred Lore', tradition: 'Vaishnava-Shakta', description: 'Introduces Lakshmi’s associations with abundance, ethical prosperity, beauty, sovereignty and household well-being.', topics: ['Lakshmi', 'prosperity', 'auspiciousness'] },
  { title: 'Saraswati: Knowledge and Sacred Speech', category: 'Deities & Sacred Lore', tradition: 'Vedic-Puranic', description: 'Traces Saraswati from river and Vedic inspiration to Goddess of learning, music, language and refined understanding.', topics: ['Saraswati', 'learning', 'vak'] },
  { title: 'Kartikeya: Skanda and Murugan', category: 'Deities & Sacred Lore', tradition: 'Shaiva · Kaumara', description: 'Presents Kartikeya’s northern and southern traditions as warrior, teacher, son of Shiva and commander of divine forces.', topics: ['Skanda', 'Murugan', 'Tamil tradition'] },
  { title: 'Krishna: Lila and Divine Teaching', category: 'Deities & Sacred Lore', tradition: 'Vaishnava', description: 'Connects Krishna’s childhood lila, Vrindavan devotion, royal life and teachings on dharma and liberation.', topics: ['Krishna', 'lila', 'Gita'] },

  // Ancestors, family tradition and dharma (8)
  { title: 'Pitru: Understanding the Ancestors', category: 'Ancestors & Dharma', tradition: 'Vedic-Puranic family tradition', description: 'Explains pitrs as honored ancestors, the debt to one’s lineage and remembrance as an expression of gratitude and continuity.', topics: ['pitru', 'lineage', 'gratitude'] },
  { title: 'Shraddha Traditions', category: 'Ancestors & Dharma', tradition: 'Domestic dharma', description: 'An educational overview of ancestral memorial offerings, their symbolism and why procedures differ by region, family and Vedic school.', topics: ['shraddha', 'memorial rites', 'family custom'] },
  { title: 'Tarpana and Remembrance', category: 'Ancestors & Dharma', tradition: 'Domestic dharma', description: 'Introduces water offerings and remembrance for deities, sages and ancestors; ritual performance should follow family guidance.', topics: ['tarpana', 'water offering', 'remembrance'] },
  { title: 'Pitru Paksha', category: 'Ancestors & Dharma', tradition: 'Annual observance', description: 'Explains the ancestral fortnight, its lunar timing, charity, food offerings and regional forms of commemoration.', topics: ['Pitru Paksha', 'lunar calendar', 'charity'] },
  { title: 'Gotra and Pravara', category: 'Ancestors & Dharma', tradition: 'Lineage memory', description: 'Describes gotra and pravara as inherited frameworks of ritual affiliation and rishi lineage, not simple modern surnames.', topics: ['gotra', 'pravara', 'rishi lineage'] },
  { title: 'Sixteen Samskaras', category: 'Ancestors & Dharma', tradition: 'Grihya tradition', description: 'A guide to the life-cycle sacraments from conception and naming through education, marriage and final rites.', topics: ['samskara', 'life cycle', 'family dharma'] },
  { title: 'Antyeshti and Mourning Traditions', category: 'Ancestors & Dharma', tradition: 'Regional and family rites', description: 'A sensitive overview of final rites, mourning, remembrance and the diversity of Hindu practices; local guidance is essential.', topics: ['antyeshti', 'mourning', 'regional practice'] },
  { title: 'Manusmriti and Dharma Literature', category: 'Ancestors & Dharma', tradition: 'Dharmashastra · Historical study', description: 'Places Manusmriti among many historical dharma texts, distinguishing descriptive study from uncritical modern application.', topics: ['Dharmashastra', 'history', 'ethical interpretation'] },

  // Major Vedic and ancestral hymns/mantras (6)
  { title: 'Gayatri Mantra and Savitri Hymn', category: 'Hymns & Mantras', tradition: 'Rigveda 3.62.10', description: 'The celebrated prayer to Savitr for illumination of understanding, presented with context, meaning and recitation respect.', topics: ['Gayatri', 'Savitr', 'illumination'] },
  { title: 'Mahamrityunjaya Mantra', category: 'Hymns & Mantras', tradition: 'Rigveda 7.59.12', description: 'A Vedic prayer to Tryambaka-Rudra associated with healing, freedom from fear and spiritual ripening.', topics: ['Tryambaka', 'Rudra', 'healing'] },
  { title: 'Purusha Sukta', category: 'Hymns & Mantras', tradition: 'Rigveda 10.90', description: 'A cosmic hymn portraying the universe and social-sacrificial order through the primordial Purusha.', topics: ['Purusha', 'cosmos', 'sacrifice'] },
  { title: 'Nasadiya Sukta', category: 'Hymns & Mantras', tradition: 'Rigveda 10.129', description: 'A philosophically open creation hymn asking what existed before being and whether creation can finally be known.', topics: ['creation', 'mystery', 'cosmology'] },
  { title: 'Devi Sukta', category: 'Hymns & Mantras', tradition: 'Rigveda 10.125', description: 'The inspired seer speaks as cosmic Vak, power within gods, peoples, knowledge and the breadth of existence.', topics: ['Vak', 'Devi', 'sacred speech'] },
  { title: 'Pitru Sukta', category: 'Hymns & Mantras', tradition: 'Rigvedic ancestral hymns', description: 'Hymns honoring the forebears and asking for their goodwill, studied here as the Vedic foundation of ancestor remembrance.', topics: ['ancestors', 'pitrs', 'remembrance'] },
];

const minorUpanishads = [
  'Akshi Upanishad', 'Amritabindu Upanishad', 'Amritanada Upanishad', 'Annapurna Upanishad',
  'Aruni Upanishad', 'Atma Upanishad', 'Atmabodha Upanishad', 'Avadhuta Upanishad',
  'Bahvricha Upanishad', 'Bhasmajabala Upanishad', 'Bhikshuka Upanishad', 'Brahma Upanishad',
  'Brahmavidya Upanishad', 'Brihajjabala Upanishad', 'Dakshinamurti Upanishad', 'Dattatreya Upanishad',
  'Dhyanabindu Upanishad', 'Ekakshara Upanishad', 'Ganapati Atharvashirsha Upanishad', 'Garbhopanishad',
  'Gopala Tapani Upanishad', 'Hamsa Upanishad', 'Hayagriva Upanishad', 'Jabala Upanishad',
  'Jabali Upanishad', 'Kaivalya Upanishad', 'Kalisantarana Upanishad', 'Kshurika Upanishad',
  'Krishna Upanishad', 'Kundika Upanishad', 'Mahavakya Upanishad', 'Maitreya Upanishad',
  'Mandala Brahmana Upanishad', 'Mantrika Upanishad', 'Muktika Upanishad', 'Nadabindu Upanishad',
  'Narada Parivrajaka Upanishad', 'Narayana Upanishad', 'Nirvana Upanishad', 'Nrisimha Tapani Upanishad',
  'Paingala Upanishad', 'Panchabrahma Upanishad', 'Paramahamsa Upanishad', 'Paramahamsa Parivrajaka Upanishad',
  'Pashupata Brahma Upanishad', 'Pranagnihotra Upanishad', 'Rama Rahasya Upanishad', 'Rama Tapani Upanishad',
  'Rudra Hridaya Upanishad', 'Rudraksha Jabala Upanishad', 'Sandilya Upanishad', 'Sannyasa Upanishad',
  'Sarasvati Rahasya Upanishad', 'Sariraka Upanishad', 'Sarvasara Upanishad', 'Saubhagyalakshmi Upanishad',
  'Savitri Upanishad', 'Sita Upanishad', 'Skanda Upanishad', 'Subala Upanishad',
  'Suka Rahasya Upanishad', 'Surya Upanishad', 'Tejobindu Upanishad', 'Tripura Upanishad',
  'Tripura Tapini Upanishad', 'Trisikhi Brahmana Upanishad', 'Tulasi Upanishad', 'Turiyatita Avadhuta Upanishad',
  'Varaha Upanishad', 'Vasudeva Upanishad', 'Yoga Chudamani Upanishad', 'Yoga Kundalini Upanishad',
  'Yoga Shikha Upanishad', 'Yoga Tattva Upanishad', 'Yajnavalkya Upanishad', 'Adhyatma Upanishad',
];

const deityNames = [
  'Agni', 'Brahma', 'Vishnu', 'Shiva', 'Krishna', 'Rama', 'Narasimha', 'Vamana', 'Varaha', 'Matsya',
  'Kurma', 'Parashurama', 'Balarama', 'Jagannath', 'Venkateswara', 'Vitthala', 'Dattatreya', 'Dhanvantari',
  'Ganesha', 'Kartikeya', 'Hanuman', 'Ayyappa', 'Surya', 'Chandra', 'Indra', 'Varuna', 'Vayu', 'Kubera',
  'Yama', 'Vishwakarma', 'Dakshinamurti', 'Nataraja', 'Ardhanarishvara', 'Harihara', 'Lakshmi', 'Saraswati',
  'Parvati', 'Durga', 'Kali', 'Lalita Tripurasundari', 'Bhuvaneshwari', 'Tara', 'Chinnamasta', 'Dhumavati',
  'Bagalamukhi', 'Matangi', 'Kamala', 'Annapurna', 'Sita', 'Radha', 'Rukmini', 'Andal',
];

const sacredPlaces = [
  'Kashi Vishwanath', 'Kedarnath', 'Somnath', 'Mahakaleshwar Ujjain', 'Omkareshwar', 'Baidyanath Dham',
  'Rameshwaram', 'Mallikarjuna Srisailam', 'Bhimashankar', 'Nageshwar', 'Trimbakeshwar', 'Grishneshwar',
  'Badrinath', 'Dwarka', 'Puri Jagannath', 'Rameswaram Char Dham', 'Tirumala Tirupati', 'Srirangam',
  'Guruvayur', 'Udupi Krishna', 'Pandharpur', 'Nathdwara', 'Vrindavan', 'Mathura', 'Ayodhya', 'Chitrakoot',
  'Haridwar', 'Rishikesh', 'Prayagraj', 'Gaya', 'Kurukshetra', 'Pushkar', 'Kanchipuram', 'Madurai Meenakshi',
  'Chidambaram', 'Thanjavur Brihadeeswara', 'Arunachala Tiruvannamalai', 'Kalahasti', 'Kollur Mookambika',
  'Kamakhya', 'Kalighat', 'Dakshineswar', 'Tarapith', 'Vaishno Devi', 'Jwalamukhi', 'Vindhyachal',
  'Konark Surya', 'Modhera Sun Temple', 'Sabarimala', 'Palani', 'Tiruchendur', 'Swamimalai', 'Kukke Subramanya',
  'Hampi Virupaksha', 'Belur Chennakeshava', 'Halebidu Hoysaleswara', 'Lingaraj Bhubaneswar', 'Mukteshwar Bhubaneswar',
  'Sakshi Gopal', 'Alarnath Brahmagiri', 'Taratarini', 'Biraja Jajpur', 'Akshardham', 'Pashupatinath',
];

const festivals = [
  'Diwali', 'Holi', 'Navaratri', 'Durga Puja', 'Dussehra', 'Janmashtami', 'Rama Navami', 'Maha Shivaratri',
  'Ganesh Chaturthi', 'Ratha Yatra', 'Makar Sankranti', 'Pongal', 'Onam', 'Vishu', 'Ugadi', 'Gudi Padwa',
  'Akshaya Tritiya', 'Vasant Panchami', 'Guru Purnima', 'Raksha Bandhan', 'Karva Chauth', 'Chhath Puja',
  'Kartik Purnima', 'Dev Deepavali', 'Vaikuntha Ekadashi', 'Narasimha Jayanti', 'Hanuman Jayanti',
  'Parashurama Jayanti', 'Gita Jayanti', 'Dattatreya Jayanti', 'Skanda Sashti', 'Thaipusam', 'Kumbh Mela',
  'Amarnath Yatra', 'Kanwar Yatra', 'Savitri Brata', 'Raja Parba', 'Nuakhai', 'Bali Yatra', 'Pana Sankranti',
  'Mahalaya', 'Pitru Paksha Amavasya', 'Tulsi Vivah', 'Govardhan Puja', 'Bhai Dooj', 'Ananta Chaturdashi',
];

const rishisAndTeachers = [
  'Vashistha', 'Vishwamitra', 'Atri', 'Bharadvaja', 'Gautama Rishi', 'Jamadagni', 'Kashyapa', 'Agastya',
  'Yajnavalkya', 'Gargi Vachaknavi', 'Maitreyi', 'Nachiketa', 'Narada', 'Vyasa', 'Valmiki', 'Shuka',
  'Kapila', 'Patanjali', 'Jaimini', 'Kanada', 'Akshapada Gautama', 'Badarayana', 'Ashtavakra', 'Dattatreya',
  'Adi Shankaracharya', 'Ramanujacharya', 'Madhvacharya', 'Nimbarkacharya', 'Vallabhacharya', 'Chaitanya Mahaprabhu',
  'Basavanna', 'Ramprasad Sen', 'Tulsidas', 'Surdas', 'Mirabai', 'Kabir', 'Namdev', 'Tukaram', 'Jnaneshwar',
  'Narsinh Mehta', 'Andal', 'Nammalvar', 'Appar', 'Sambandar', 'Manikkavacakar', 'Ramana Maharshi',
];

const additionalTexts = [
  'Devi Bhagavata Purana', 'Ganesha Purana', 'Mudgala Purana', 'Kalika Purana', 'Saura Purana',
  'Narasimha Purana', 'Brihaddharma Purana', 'Vishnudharmottara Purana', 'Shiva Rahasya', 'Aditya Purana',
  'Vayu Purana', 'Nilamata Purana', 'Samba Purana', 'Kapila Purana', 'Ekamarra Purana', 'Kalki Purana',
  'Adhyatma Ramayana', 'Ananda Ramayana', 'Kamba Ramayanam', 'Ranganatha Ramayanam', 'Krittivasi Ramayana',
  'Jagamohana Ramayana', 'Molla Ramayana', 'Ramakien Comparative Guide', 'Mahabharata Harivamsha', 'Bhagavata Mahatmya',
  'Lalita Sahasranama', 'Vishnu Sahasranama', 'Shiva Sahasranama', 'Ganesha Sahasranama', 'Lakshmi Sahasranama',
  'Durga Saptashati', 'Saundarya Lahari', 'Shivananda Lahari', 'Bhaja Govindam', 'Vivekachudamani',
  'Atma Bodha', 'Aparokshanubhuti', 'Upadesha Sahasri', 'Gaudapada Karika', 'Yoga Taravali',
  'Tirumantiram', 'Tevaram', 'Tiruvachakam', 'Nalayira Divya Prabandham', 'Tiruppavai', 'Tirukkural Dharma Guide',
  'Abhinavagupta Tantraloka', 'Shiva Sutras of Vasugupta', 'Spanda Karika', 'Vijnana Bhairava Tantra',
  'Kularnava Tantra', 'Mahanirvana Tantra', 'Rudra Yamala Overview', 'Devi Rahasya', 'Prapanchasara Tantra',
  'Pancharatra Agamas', 'Vaikhanasa Agamas', 'Shaiva Agamas', 'Shakta Agamas', 'Kashyapa Shilpa Shastra',
  'Manasara', 'Mayamata', 'Samarangana Sutradhara', 'Natya Shastra', 'Arthashastra Dharma Context',
  'Charaka Samhita Heritage Guide', 'Sushruta Samhita Heritage Guide', 'Ashtanga Hridaya Heritage Guide',
  'Brihat Samhita', 'Surya Siddhanta', 'Aryabhatiya Sacred Astronomy Context', 'Lilavati', 'Yuktibhasha',
  'Dharma Sindhu', 'Nirnaya Sindhu', 'Chaturvarga Chintamani', 'Hemadri Vrata Khanda', 'Smriti Chandrika',
];

const ancestralTopics = [
  'Nitya Tarpana', 'Amavasya Tarpana', 'Mahalaya Shraddha', 'Ekoddishta Shraddha', 'Parvana Shraddha',
  'Sapindikarana', 'Pinda Dana', 'Gaya Shraddha', 'Narayanabali Tradition', 'Tripindi Shraddha',
  'Asthi Visarjana', 'Preta Kriya Overview', 'Dashaha Mourning Period', 'Ekadasha and Dwadasha Rites',
  'Annual Tithi Shraddha', 'Matru Shraddha', 'Pitru Rin', 'Rishi Rin', 'Deva Rin', 'Kuladeva Tradition',
  'Kuladevi Tradition', 'Ishta Devata', 'Grama Devata', 'Vamsha and Family Memory', 'Sapta Pitrus',
  'Pitru Loka', 'Ancestral Dreams in Tradition', 'Food and Charity in Remembrance', 'Brahmana Bhojana Context',
  'Sacred Kusha Grass', 'Tilodaka Offering', 'Pancha Mahayajnas', 'Bhuta Yajna', 'Manushya Yajna',
  'Brahma Yajna', 'Deva Yajna', 'Pitru Yajna', 'Family Genealogy Preservation', 'Regional Shraddha Customs',
  'Women and Ancestor Remembrance',
];

const expandedSeeds: SacredTextSeed[] = [
  ...minorUpanishads.map((title) => ({
    title,
    category: 'Upanishads',
    tradition: 'Minor Upanishad · Muktika tradition',
    description: `${title} belongs to the wider Upanishadic heritage and is indexed here for its contemplative, devotional, yogic or renunciant teachings.`,
    topics: ['Upanishad', 'spiritual knowledge', 'text guide'],
  })),
  ...deityNames.flatMap((name) => [
    { title: `${name}: Sacred Stories`, category: 'Deities & Sacred Lore', tradition: 'Vedic-Puranic heritage', description: `A guide to the principal sacred narratives, relationships and theological roles associated with ${name}.`, topics: [name, 'mythology', 'sacred stories'] },
    { title: `${name}: Iconography and Symbols`, category: 'Deities & Sacred Lore', tradition: 'Temple and art tradition', description: `Explains the forms, attributes, vehicles, gestures and visual symbolism traditionally associated with ${name}.`, topics: [name, 'iconography', 'symbols'] },
    { title: `${name}: Names and Epithets`, category: 'Deities & Sacred Lore', tradition: 'Devotional tradition', description: `Introduces important names and epithets of ${name}, with the qualities and stories those names remember.`, topics: [name, 'sacred names', 'qualities'] },
    { title: `${name}: Mantras, Worship and Festivals`, category: 'Hymns & Mantras', tradition: 'Devotional practice overview', description: `An educational overview of prayers, worship customs, sacred days and regional festivals connected with ${name}.`, topics: [name, 'mantra context', 'festivals'] },
  ]),
  ...sacredPlaces.flatMap((place) => [
    { title: `${place}: Sacred Place Guide`, category: 'Itihasa & Sacred Narratives', tradition: 'Tirtha and temple heritage', description: `Introduces the sacred history, presiding deity, major legends and pilgrimage significance of ${place}.`, topics: [place, 'tirtha', 'pilgrimage'] },
    { title: `${place}: Temple Traditions and Festivals`, category: 'Ancestors & Dharma', tradition: 'Regional temple heritage', description: `A guide to the worship traditions, annual celebrations, local customs and cultural heritage associated with ${place}.`, topics: [place, 'temple tradition', 'festival'] },
  ]),
  ...festivals.map((name) => ({ title: `${name}: Meaning and Traditions`, category: 'Ancestors & Dharma', tradition: 'Festival heritage', description: `Explores the sacred narratives, calendar setting, household observances and regional diversity of ${name}.`, topics: [name, 'festival', 'calendar'] })),
  ...rishisAndTeachers.map((name) => ({ title: `${name}: Rishi and Teacher Guide`, category: 'Philosophy & Yoga', tradition: 'Guru and teaching lineage', description: `Introduces the life traditions, teachings, texts and continuing influence associated with ${name}.`, topics: [name, 'teacher', 'lineage'] })),
  ...additionalTexts.map((title) => ({ title, category: 'Itihasa & Sacred Narratives', tradition: 'Expanded Hindu textual heritage', description: `A reference guide to ${title}, its traditional setting, major themes, influence and place within Hindu knowledge traditions.`, topics: ['scripture', 'heritage', 'study guide'] })),
  ...ancestralTopics.map((name) => ({ title: `${name}: Ancestral Dharma Guide`, category: 'Ancestors & Dharma', tradition: 'Family and regional tradition', description: `A respectful educational overview of ${name}, including its symbolism, family context and regional variation; ritual details require qualified guidance.`, topics: [name, 'ancestors', 'family dharma'] })),
];

const uniqueSeeds = [...seeds, ...expandedSeeds].filter((text, index, all) =>
  all.findIndex((candidate) => candidate.title.trim().toLowerCase() === text.title.trim().toLowerCase()) === index,
);

export const sacredTexts: SacredText[] = uniqueSeeds.map((text, index) => ({
  ...text,
  id: index + 1,
}));

export const sacredTextCategories = ['All', ...Array.from(new Set(sacredTexts.map((text) => text.category)))];
