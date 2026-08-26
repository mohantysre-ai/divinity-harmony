import type { SacredText } from '@/data/sacred-texts';

export type SacredTextArticle = {
  introduction: string;
  keyPoints: string[];
  significance: string;
  studyPath: string[];
  context: string;
  practiceNote?: string;
};

const joinedTopics = (text: SacredText) => text.topics.join(', ');

const categoryArticles: Record<string, (text: SacredText) => SacredTextArticle> = {
  'Vedas & Vedangas': (text) => ({
    introduction: `${text.title} belongs to the Vedic knowledge tradition identified here as ${text.tradition}. ${text.description} Vedic works are layered records of hymn, ritual, contemplation, language and transmitted memory rather than modern single-author books.`,
    keyPoints: [
      `Its central study themes include ${joinedTopics(text)}.`,
      'The text should be understood within an oral tradition that carefully preserved accent, meter and recensional differences.',
      'Ritual passages explain relationships among sacred fire, offering, priest, patron, deity and cosmic order.',
      'Later Brahmana, Aranyaka and Upanishadic interpretation often turns outward ritual symbolism toward inward contemplation.',
    ],
    significance: `${text.title} helps explain how early Hindu traditions joined sacred speech, disciplined action and reflection on the cosmos. Its influence can continue through mantra, domestic custom, temple liturgy, philosophy and the vocabulary of dharma.`,
    studyPath: [
      'Begin with its historical position and Vedic school or recension.',
      `Study the recurring ideas: ${joinedTopics(text)}.`,
      'Compare a reliable translation with notes on Sanskrit terms instead of treating one English rendering as final.',
      'For recitation or ritual application, learn through an authorized teacher familiar with the relevant shakha.',
    ],
    context: `${text.tradition} is the immediate classification used by this library. Manuscript editions and living recitation lineages can differ, so scholarly study and tradition-based practice answer different but complementary questions.`,
    practiceNote: 'Vedic accents, mantras and fire rituals require lineage-specific instruction. This article explains context; it is not a ritual manual.',
  }),
  Upanishads: (text) => ({
    introduction: `${text.title} is presented within ${text.tradition}. ${text.description} Like other Upanishadic works, it turns attention toward the knower, the nature of consciousness, the source of existence and the possibility of freedom.`,
    keyPoints: [
      `Use ${joinedTopics(text)} as the main doorway into this teaching.`,
      'Ask what the text means by Self, ultimate reality, knowledge and liberation before importing modern assumptions.',
      'Notice whether the teaching is expressed through dialogue, symbol, meditation, negation, sacred sound or a teacher-student encounter.',
      'Different Vedanta traditions can interpret the same passage through non-dual, qualified non-dual or dual theological frameworks.',
    ],
    significance: `${text.title} contributes to the broad Upanishadic search for knowledge that transforms identity rather than merely adding information. Its value lies in sustained inquiry into experience, ethics and the relation between the individual and the whole.`,
    studyPath: [
      'Read a short structural summary before reading individual verses.',
      'Keep key Sanskrit terms untranslated in your notes and compare how translators explain them.',
      'Identify the principal question, teacher, student and concluding insight.',
      'Compare classical commentarial traditions only after understanding the plain narrative or teaching sequence.',
    ],
    context: `${text.title} is one part of a diverse Upanishadic corpus. “Upanishad” does not indicate one date, author or philosophy; texts developed in different Vedic and sectarian settings.`,
  }),
  Puranas: (text) => ({
    introduction: `${text.title} is classified here as ${text.tradition}. ${text.description} Purana literature transmits theology and cultural memory through stories, genealogies, cosmology, pilgrimage praise, ritual calendars and dialogue.`,
    keyPoints: [
      `Major themes in this guide are ${joinedTopics(text)}.`,
      'Creation and dissolution appear through repeating cosmic cycles rather than a single linear chronology.',
      'Narratives teach through character, sacred geography and devotion; apparent variations across Puranas reflect living traditions.',
      'A Purana may praise one deity as supreme while still participating in a wider world shared with other Hindu traditions.',
    ],
    significance: `${text.title} has helped shape worship, festivals, temple identity, pilgrimage routes, visual art and regional storytelling. It is best approached as layered sacred literature, not reduced either to literal history or to “mere myth.”`,
    studyPath: [
      'Identify the speakers, framing dialogue and major sections of the work.',
      'Separate cosmology, genealogy, pilgrimage, ritual and devotional narrative when taking notes.',
      'Compare important stories with their versions in other Puranas and regional retellings.',
      'Use a complete edition or clearly identified volume because abridgements often omit entire subject areas.',
    ],
    context: `${text.tradition} describes the dominant orientation of this entry, not an exclusive ownership of the work. Purana texts accumulated material over long periods and circulate in different recensions.`,
  }),
  Gitas: (text) => ({
    introduction: `${text.title} belongs to ${text.tradition}. ${text.description} Gita literature normally presents spiritual teaching through a concentrated dialogue responding to a crisis, doubt or request for liberating knowledge.`,
    keyPoints: [
      `The main themes indexed here are ${joinedTopics(text)}.`,
      'Identify who teaches, who asks, and what practical or existential problem begins the dialogue.',
      'Observe how action, knowledge, devotion, meditation and renunciation are balanced rather than isolated.',
      'Read repeated terms such as dharma, yoga, atman, bhakti and moksha within the argument of the specific text.',
    ],
    significance: `${text.title} translates large philosophical questions into a direct teaching encounter. It can therefore be studied both as scripture and as a guide to ethical action, disciplined attention and spiritual orientation.`,
    studyPath: [
      'Read the opening situation before extracting individual quotations.',
      'Map the dialogue into questions, answers and changes in the student’s understanding.',
      'Compare two reputable translations where a key verse has multiple interpretations.',
      'Conclude each section by writing its teaching in your own words without removing its context.',
    ],
    context: `${text.tradition} supplies the literary setting for this Gita. Related texts may use the word “Gita” while presenting very different devotional or philosophical positions.`,
  }),
  'Itihasa & Sacred Narratives': (text) => ({
    introduction: `${text.title} is included within ${text.tradition}. ${text.description} This resource connects narrative, sacred memory and interpretation so that characters and events are understood within their wider ethical and theological setting.`,
    keyPoints: [
      `Follow ${joinedTopics(text)} as the central subjects of the article.`,
      'Distinguish the core textual account from later retellings, local legends, performance traditions and modern adaptations.',
      'Ask how the narrative explores dharma, loyalty, power, suffering, devotion, restoration or liberation.',
      'Notice how geography, festival, temple and community memory keep a sacred narrative alive beyond the written page.',
    ],
    significance: `${text.title} matters because Hindu sacred narratives do more than preserve a plot: they provide shared language for moral reflection, family memory, devotion, art and community identity.`,
    studyPath: [
      'Start with the principal characters, setting and narrative sequence.',
      'Identify the ethical conflict instead of labeling characters too quickly as simply good or evil.',
      'Compare the Sanskrit or earliest available account with one regional retelling.',
      'Explore how the subject appears in music, dance, temple art or annual observance.',
    ],
    context: `${text.tradition} is the tradition label used for orientation. Sacred narratives often have multiple authoritative tellings, and variation is part of their historical life.`,
  }),
  'Philosophy & Yoga': (text) => ({
    introduction: `${text.title} is studied here within ${text.tradition}. ${text.description} The entry treats philosophy as disciplined inquiry into knowledge, reality, mind, suffering, action and freedom—not as abstract opinion alone.`,
    keyPoints: [
      `Its study map begins with ${joinedTopics(text)}.`,
      'Identify the problem the system is trying to solve and the means of valid knowledge it accepts.',
      'Separate metaphysical claims, methods of reasoning, ethical preparation and contemplative practice.',
      'Compare the original aphorism or verse with commentary because many foundational texts are intentionally compressed.',
    ],
    significance: `${text.title} contributes to a culture of debate in which competing schools refined their positions through logic, experience, scripture and practice. Understanding it prevents Hindu philosophy from being reduced to one undifferentiated belief system.`,
    studyPath: [
      'Create a glossary of the system’s technical terms.',
      'Map its account of bondage or suffering and its proposed path to freedom.',
      'Study one classical commentary before moving to modern summaries.',
      'Treat physical or breath practices cautiously and learn advanced methods from a qualified teacher.',
    ],
    context: `${text.tradition} identifies the principal school or lineage. A text’s meaning often depends on its commentarial history and debates with other Indian philosophies.`,
    practiceNote: 'Descriptions of yoga, breath, mantra or initiation are educational. Advanced practice requires competent personal guidance.',
  }),
  'Deities & Sacred Lore': (text) => ({
    introduction: `${text.title} is approached through ${text.tradition}. ${text.description} Hindu divine forms unite story, theology, sacred names, visual symbolism, temple presence and personal devotion.`,
    keyPoints: [
      `The article centers on ${joinedTopics(text)}.`,
      'Names and forms express divine qualities; they should not be treated as interchangeable decorative labels.',
      'Iconographic attributes, gestures, vehicles and companions communicate a visual theology understood through tradition.',
      'Stories may vary across Vedic, epic, Puranic, Agamic and regional sources while preserving related spiritual themes.',
    ],
    significance: `${text.title} helps readers connect image and story with their underlying ideas—protection, wisdom, transformation, abundance, courage, knowledge or devotion—without flattening regional and sectarian diversity.`,
    studyPath: [
      'Begin with the divine form’s principal names, relationships and theological role.',
      'Study each iconographic symbol and the source tradition that explains it.',
      'Compare two major sacred narratives rather than combining every story into one chronology.',
      'Explore living worship through a reputable temple or lineage source while respecting initiation boundaries.',
    ],
    context: `${text.tradition} is the primary lens used here. The same deity may be understood differently across regions and sampradayas without one expression automatically invalidating another.`,
  }),
  'Ancestors & Dharma': (text) => ({
    introduction: `${text.title} belongs to ${text.tradition}. ${text.description} This article explains the idea, symbolism and social setting while respecting differences among families, regions, communities and Vedic affiliations.`,
    keyPoints: [
      `Its principal themes are ${joinedTopics(text)}.`,
      'Ancestor remembrance links gratitude, family continuity, ethical responsibility and awareness of mortality.',
      'Calendar, eligibility, materials and procedure can differ; a general website cannot determine a family’s correct ritual method.',
      'Dharma literature is historically layered and must be interpreted with attention to context, living practice and present-day ethics.',
    ],
    significance: `${text.title} matters because Hindu family traditions understand a person as part of relationships extending across generations. Remembrance is therefore connected with gratitude, charity, responsibility and transmission of values.`,
    studyPath: [
      'Learn the meaning and purpose before looking for procedural instructions.',
      'Record your family’s region, gotra or known custom without inventing missing lineage information.',
      'Compare textual discussion with the practice actually maintained by the family.',
      'Ask a trusted family elder or qualified priest before performing unfamiliar rites.',
    ],
    context: `${text.tradition} is a broad classification. This resource does not override family custom, regional practice, a person’s circumstances or qualified pastoral guidance.`,
    practiceNote: 'This is educational content, not a personalized ritual prescription. Mourning and ancestral observances deserve sensitive, family-specific guidance.',
  }),
  'Hymns & Mantras': (text) => ({
    introduction: `${text.title} is located within ${text.tradition}. ${text.description} A mantra or hymn has meaning through sound, source, deity, seer, meter, intention and the tradition of recitation—not through text alone.`,
    keyPoints: [
      `The central themes indexed here are ${joinedTopics(text)}.`,
      'Study the source and surrounding verses before treating an isolated line as a complete practice.',
      'Separate a plain-language meaning from the layered ritual, theological and contemplative interpretations.',
      'Pronunciation, Vedic accent and initiation requirements vary; not every sacred formula has the same usage rules.',
    ],
    significance: `${text.title} shows how sacred sound can carry praise, contemplation, remembrance and theological insight. Responsible study joins meaning with humility toward the oral traditions that preserved it.`,
    studyPath: [
      'Identify the textual source, seer or traditional attribution, deity and meter when known.',
      'Read a word-by-word meaning before memorizing a free poetic translation.',
      'Listen to a trustworthy lineage-based recitation if the hymn is publicly taught.',
      'Use general devotional practice only within the boundaries advised for that mantra.',
    ],
    context: `${text.tradition} identifies the source or devotional setting. Variants in wording and pronunciation should be documented rather than silently mixed.`,
    practiceNote: 'The article explains the hymn; it does not grant initiation or replace a qualified recitation teacher.',
  }),
};

export function buildSacredTextArticle(text: SacredText): SacredTextArticle {
  const builder = categoryArticles[text.category] || categoryArticles['Itihasa & Sacred Narratives'];
  return builder(text);
}
