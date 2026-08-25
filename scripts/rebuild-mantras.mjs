/**
 * Rebuild mantras.json:
 * - Assign verified Wikimedia deity images (no stale hashed Commons URLs)
 * - Clear broken audio URLs (app uses device TTS)
 * - Enrich short/placeholder text where we have standard public-domain verses
 * - Append many additional Sacred / Vedic mantras
 *
 * Run: node scripts/rebuild-mantras.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const target = path.join(root, 'src', 'data', 'mantras.json');

const IMAGES = {
  ganesha: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Ganesha_Basohli_miniature_circa_1730_Dubost_p73.jpg',
  shiva: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Shiva_as_the_Lord_of_Dance_LACMA_edit.jpg',
  vishnu: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Vishnu_and_Lakshmi_on_Shesha_Naga%2C_ca_1870.jpg',
  krishna: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Radha_Krishna.jpg',
  rama: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Vishnu.jpg',
  durga: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Durga_Mahishasuramardini.jpg',
  lakshmi: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Lakshmi.jpg',
  saraswati: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Saraswati.jpg',
  hanuman: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Hanuman.jpg',
  surya: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Surya_deva.jpg',
  murugan: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Kartikeya.jpg',
  om: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Om_symbol.svg',
  gayatri: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Gayatri.jpg',
  kali: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Durga_Mahishasuramardini.jpg',
};

function classify(title = '', description = '') {
  const v = `${title} ${description}`.toLowerCase();
  if (/(ganesh|ganapati|vinayak)/.test(v)) return 'ganesha';
  if (/(hanuman)/.test(v)) return 'hanuman';
  if (/(kali|tara|chandi|bhairav)/.test(v)) return 'kali';
  if (/(durga|devi|shakti|bhavani|annapurna|lalita|soundarya|saptashloki)/.test(v)) return 'durga';
  if (/(lakshmi|kamala|ashta.?lakshmi|kanakadhara|sri sukt)/.test(v)) return 'lakshmi';
  if (/(saraswati|sarasvati)/.test(v)) return 'saraswati';
  if (/(krishna|govinda|gita|radha|madhura|bhaja govinda)/.test(v)) return 'krishna';
  if (/(rama|sita|ramayana|sundara kanda)/.test(v)) return 'rama';
  if (/(vishnu|narayana|narasimha|hayagriva|venkatesh|panduranga|hari)/.test(v)) return 'vishnu';
  if (/(shiva|siva|rudra|linga|tandava|mrityunjaya|dakshinamurthy|nataraja|kalabhairava)/.test(v)) return 'shiva';
  if (/(subramanya|murugan|kartikeya|skanda)/.test(v)) return 'murugan';
  if (/(surya|aditya|navagraha|chandra|shani|rahu|ketu|mangala|budha|shukra|guru \()/.test(v)) return 'surya';
  if (/(gayatri)/.test(v)) return 'gayatri';
  return 'om';
}

/** Standard public-domain enrichments for entries that only had a short namah. */
const TEXT_FIXES = {
  'Varuna Mantra': {
    text: 'ॐ जलाम्बराय विद्महे नीलपुरुषाय धीमहि। तन्नो वरुणः प्रचोदयात्॥',
    translation: 'Om. We meditate on Varuna, clothed in waters, the blue-hued lord. May that Varuna inspire and illuminate us.',
  },
  'Agni Mantra': {
    text: 'ॐ वैश्वानराय विद्महे लालीलाय धीमहि। तन्नो अग्निः प्रचोदयात्॥',
    translation: 'Om. We meditate upon Agni Vaiśvānara, the playful flame. May that Agni inspire our intellect.',
  },
  'Indra Mantra': {
    text: 'ॐ सहस्रनयनाय विद्महे वज्रहस्ताय धीमहि। तन्नो इन्द्रः प्रचोदयात्॥',
    translation: 'Om. We meditate on Indra of a thousand eyes, who holds the thunderbolt. May Indra inspire us.',
  },
  'Vayu Mantra': {
    text: 'ॐ सर्वप्राणाय विद्महे यष्टिहस्ताय धीमहि। तन्नो वायुः प्रचोदयात्॥',
    translation: 'Om. We meditate on Vayu, the life-breath of all, staff in hand. May Vayu inspire us.',
  },
  'Yama Mantra': {
    text: 'ॐ कालात्मकाय विद्महे चित्रगुप्ताय धीमहि। तन्नो यमः प्रचोदयात्॥',
    translation: 'Om. We meditate on Yama, the soul of time, and on Chitragupta. May Yama inspire righteousness.',
  },
  'Brahma Mantra': {
    text: 'ॐ चतुर्मुखाय विद्महे हंसवाहनाय धीमहि। तन्नो ब्रह्म प्रचोदयात्॥',
    translation: 'Om. We meditate on four-faced Brahmā, who rides the swan. May Brahmā inspire our creation and wisdom.',
  },
  'Kubera Mantra': {
    text: 'ॐ यक्षराजाय विद्महे वैश्रवणाय धीमहि। तन्नो कुबेरः प्रचोदयात्॥',
    translation: 'Om. We meditate on Kubera, king of the yakṣas, Vaiśravaṇa. May Kubera inspire rightful prosperity.',
  },
  'Durga Mantra': {
    text: 'ॐ दुं दुर्गायै नमः। सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके। शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते॥',
    translation: 'Om Dum Durgāyai Namaḥ. O auspicious one who brings all welfare, who fulfills every aim, refuge of the three-eyed Gaurī—salutations to you, Nārāyaṇī.',
  },
  'Vishnu Mantra': {
    text: 'ॐ नमो भगवते वासुदेवाय। ॐ नमो नारायणाय।',
    translation: 'Om. Salutations to the Blessed Lord Vāsudeva. Om. Salutations to Nārāyaṇa.',
  },
  'Krishna Mantra': {
    text: 'ॐ क्लीं कृष्णाय नमः। हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे। हरे राम हरे राम राम राम हरे हरे॥',
    translation: 'Om Klīm Kṛṣṇāya Namaḥ. Chant the names of Krishna and Rama with devotion.',
  },
  'Narayana Mantra': {
    text: 'ॐ नमो नारायणाय।',
    translation: 'Om. Salutations to Nārāyaṇa, the resting place of all beings.',
  },
};

/** Newly added mantras (public-domain Vedic / Purāṇic / stotra openings). */
const ADDITIONS = [
  {
    title: 'Asato Ma Sad Gamaya',
    description: 'Bṛhadāraṇyaka Upaniṣad peace mantra seeking truth, light and immortality',
    text: 'असतो मा सद्गमय। तमसो मा ज्योतिर्गमय। मृत्योर्मा अमृतं गमय॥',
    translation: 'Lead me from the unreal to the real. Lead me from darkness to light. Lead me from death to immortality.',
  },
  {
    title: 'Om Sarvesham Svastir Bhavatu',
    description: 'Universal welfare mantra for peace among all beings',
    text: 'ॐ सर्वेशां स्वस्तिर्भवतु। सर्वेशां शान्तिर्भवतु। सर्वेशां पूर्णं भवतु। सर्वेशां मङ्गलं भवतु॥',
    translation: 'May there be well-being for all. May there be peace for all. May there be fullness for all. May there be auspiciousness for all.',
  },
  {
    title: 'Om Dyauh Shantir',
    description: 'Yajurveda peace invocation across heaven, earth, waters and herbs',
    text: 'ॐ द्यौः शान्तिरन्तरिक्षं शान्तिः पृथिवी शान्तिरापः शान्तिरोषधयः शान्तिः। वनस्पतयः शान्तिर्विश्वेदेवाः शान्तिर्ब्रह्म शान्तिः सर्वं शान्तिः शान्तिरेव शान्तिः सा मा शान्तिरेधि॥',
    translation: 'Om. Peace in the heavens, peace in the mid-region, peace on earth, peace in the waters, peace in the herbs and plants, peace among the gods, peace in Brahman, peace in all—may that peace be mine.',
  },
  {
    title: 'Pavamana Mantra',
    description: 'Purifying mantra from the Bṛhadāraṇyaka Upaniṣad',
    text: 'असतो मा सद्गमय तमसो मा ज्योतिर्गमय मृत्योर्मा अमृतं गमय ॐ शान्तिः शान्तिः शान्तिः॥',
    translation: 'From untruth lead us to truth; from darkness to light; from death to immortality. Om peace, peace, peace.',
  },
  {
    title: 'Om Poornamadah',
    description: 'Īśāvāsya Upaniṣad invocation of completeness',
    text: 'ॐ पूर्णमदः पूर्णमिदं पूर्णात्पूर्णमुदच्यते। पूर्णस्य पूर्णमादाय पूर्णमेवावशिष्यते॥ ॐ शान्तिः शान्तिः शान्तिः॥',
    translation: 'That is whole; this is whole. From wholeness, wholeness comes forth. Taking wholeness from wholeness, wholeness alone remains. Om peace, peace, peace.',
  },
  {
    title: 'Tvameva Mata',
    description: 'Traditional prayer affirming the Divine as mother, father, kin and refuge',
    text: 'त्वमेव माता च पिता त्वमेव त्वमेव बन्धुश्च सखा त्वमेव। त्वमेव विद्या द्रविणं त्वमेव त्वमेव सर्वं मम देव देव॥',
    translation: 'You alone are Mother and Father; You alone are relative and friend. You alone are knowledge and wealth; You alone are my everything, O God of gods.',
  },
  {
    title: 'Kayena Vacha',
    description: 'Dedication of body, speech and mind to the Lord',
    text: 'कायेन वाचा मनसेन्द्रियैर्वा बुद्ध्यात्मना वा प्रकृतिस्वभावात्। करोमि यद्यत् सकलं परस्मै नारायणायेति समर्पयामि॥',
    translation: 'Whatever I do with body, speech, mind, senses, intellect or nature—I offer it all to Nārāyaṇa.',
  },
  {
    title: 'Om Tryambakam (Full)',
    description: 'Complete Mahāmṛtyuñjaya mantra from the Ṛgveda',
    text: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात्॥',
    translation: 'We worship the three-eyed Lord who is fragrant and who nourishes all. As a cucumber is freed from its vine, may we be liberated from death, not from immortality.',
  },
  {
    title: 'Rudrashtakam Opening',
    description: 'Opening of Tulsīdās’ Rudrāṣṭakam praising Śiva',
    text: 'नमामीशमीशान निर्वाणरूपं विभुं व्यापकं ब्रह्मवेदस्वरूपम्। निजं निर्गुणं निर्विकल्पं निरीहं चिदाकाशमाकाशवासं भजेऽहम्॥',
    translation: 'I bow to the Lord Īśāna, of nirvāṇa form, all-pervading, essence of Vedic knowledge. I worship the Self, beyond qualities and alternatives, dwelling in the sky of consciousness.',
  },
  {
    title: 'Lingashtakam Opening',
    description: 'First verse of Liṅgāṣṭakam',
    text: 'ब्रह्ममुरारिसुरार्चितलिङ्गं निर्मलभासितशोभितलिङ्गम्। जन्मजदुःखविनाशकलिङ्गं तत् प्रणमामि सदाशिवलिङ्गम्॥',
    translation: 'I bow forever to that Liṅga of Sadāśiva, worshipped by Brahmā, Viṣṇu and the gods, pure and radiant, destroyer of the sorrows of birth.',
  },
  {
    title: 'Bilvashtakam Opening',
    description: 'Offering of bilva leaves to Śiva',
    text: 'त्रिदलं त्रिगुणाकारं त्रिनेत्रं च त्रयायुधम्। त्रिजन्मपापसंहारं एकबिल्वं शिवार्पणम्॥',
    translation: 'A single bilva leaf of three leaflets, symbol of the three guṇas, three eyes and three weapons—destroyer of sins of three births—I offer to Śiva.',
  },
  {
    title: 'Shiva Panchakshari Stotram Opening',
    description: 'Opening of the Śiva Pañcākṣarī stotra',
    text: 'नागेन्द्रहाराय त्रिलोचनाय भस्माङ्गरागाय महेश्वराय। नित्याय शुद्धाय दिगम्बराय तस्मै नकाराय नमः शिवाय॥',
    translation: 'Salutations to Śiva in the syllable Na—wearing the serpent garland, three-eyed, ash-smeared, the Great Lord, eternal, pure, clad in the directions.',
  },
  {
    title: 'Madhurashtakam Opening',
    description: 'Vallabhācārya’s Madhurāṣṭakam on the sweetness of Kṛṣṇa',
    text: 'अधरं मधुरं वदनं मधुरं नयनं मधुरं हसितं मधुरम्। हृदयं मधुरं गमनं मधुरं मधुराधिपतेरखिलं मधुरम्॥',
    translation: 'His lips are sweet, His face is sweet, His eyes are sweet, His smile is sweet. His heart is sweet, His gait is sweet—everything about the Lord of sweetness is sweet.',
  },
  {
    title: 'Govindashtakam Opening',
    description: 'Ādi Śaṅkara’s Govindāṣṭakam',
    text: 'सत्यं ज्ञानमनन्तं नित्यमनाकाशं परमाकाशम्। गोष्ठप्राङ्गणरिङ्खणलोलमनायासं परमायासम्॥',
    translation: 'Truth, knowledge, infinite, eternal—beyond space yet the supreme space. Playing in the courtyard of the cowherds, effortless yet the supreme effort—Govinda.',
  },
  {
    title: 'Achyutashtakam Opening',
    description: 'Ādi Śaṅkara’s Acyutāṣṭakam',
    text: 'अच्युतं केशवं रामनारायणं कृष्णदामोदरं वासुदेवं हरिम्। श्रीधरं माधवं गोपिकावल्लभं जानकीनायकं रामचन्द्रं भजे॥',
    translation: 'I worship Acyuta, Keśava, Rāma-Nārāyaṇa, Kṛṣṇa-Dāmodara, Vāsudeva, Hari, Śrīdhara, Mādhava, beloved of the gopīs, lord of Jānakī—Rāmacandra.',
  },
  {
    title: 'Mukunda Mala Opening',
    description: 'Opening of Kulaśekhara’s Mukundamālā',
    text: 'जयतु जयतु देवो देवकीनन्दनोऽयं जयतु जयतु कृष्णो वृष्णिवंशप्रदीपः। जयतु जयतु मेघश्यामलः कोमलाङ्गो जयतु जयतु पृथ्वीभारनाशो मुकुन्दः॥',
    translation: 'Victory to the Lord, son of Devakī; victory to Kṛṣṇa, lamp of the Vṛṣṇi line. Victory to the cloud-dark, tender-limbed one; victory to Mukunda, who lifts Earth’s burden.',
  },
  {
    title: 'Rama Stuti Opening',
    description: 'Traditional Rāma stuti from the Rāmāyaṇa tradition',
    text: 'श्रीरामचन्द्र चरणौ मनसा स्मरामि श्रीरामचन्द्र चरणौ वचसा गृणामि। श्रीरामचन्द्र चरणौ शिरसा नमामि श्रीरामचन्द्र चरणौ शरणं प्रपद्ये॥',
    translation: 'I remember Rāmacandra’s feet with my mind; I praise them with my speech; I bow to them with my head; I take refuge at Rāmacandra’s feet.',
  },
  {
    title: 'Hanuman Bahuk Opening',
    description: 'Devotional praise of Hanumān’s strength and grace',
    text: 'मनोजवं मारुततुल्यवेगं जितेन्द्रियं बुद्धिमतां वरिष्ठम्। वातात्मजं वानरयूथमुख्यं श्रीरामदूतं शरणं प्रपद्ये॥',
    translation: 'I take refuge in the messenger of Śrī Rāma—swift as mind, equal to wind in speed, master of the senses, foremost among the wise, son of the Wind, chief of the monkey host.',
  },
  {
    title: 'Durga Dvatrimshannamamala Opening',
    description: 'Opening of the 32 names of Durgā',
    text: 'दुर्गा दुर्गारतिदुर्गा दुर्गपद्मिनी दुर्गनाशिनी। दुर्गमालिनी दुर्गा दुर्गा दुर्गतिनाशिनी॥',
    translation: 'Durgā—she who is difficult of access, who destroys hardship, who is the lotus in difficulty, who ends calamity.',
  },
  {
    title: 'Mahishasura Mardini Stotram Opening',
    description: 'Opening of the Mahiṣāsura Mardinī stotra',
    text: 'अयि गिरिनन्दिनि नन्दितमेदिनि विश्वविनोदिनि नन्दिनुते। गिरिवरविन्ध्यशिरोऽधिनिवासिनि विष्णुविलासिनि जिष्णुनुते॥',
    translation: 'O daughter of the Mountain, who delights the earth and the universe, praised by Nandin; dwelling on Vindhya’s peak, playful with Viṣṇu, praised by the victorious.',
  },
  {
    title: 'Annapurna Stotram Opening',
    description: 'Śaṅkara’s Annapūrṇā stotra opening',
    text: 'नित्यानन्दकरी वराभयकरी सौन्दर्यरत्नाकरी निर्धूताखिलदोषपूरपरिपूर्णानन्दचित्रीकरी। श्रीकण्ठाङ्कुकुलेश्वरी भुवनेश्वरी ब्रह्माण्डगर्भाधरी लीलाढ्या परिपूर्णान्नदानाधन्या भवानी पुरी॥',
    translation: 'O Bhavānī of the city—giver of eternal bliss, bestower of boons and fearlessness, ocean of beauty, remover of all faults—Mother Annapūrṇā, full of playful grace.',
  },
  {
    title: 'Lakshmi Ashtottara Opening',
    description: 'Opening names from Lakṣmī’s 108 names',
    text: 'ॐ प्रकृतिं विकृतिं विद्यां सर्वभूतहितप्रदाम्। श्रद्धां विभूतिं सुरभिं नमामि परमात्मिकाम्॥',
    translation: 'Om. I bow to Prakṛti and Vikṛti, to Vidyā who benefits all beings, to Śraddhā, Vibhūti, Surabhi—the supreme Self as Lakṣmī.',
  },
  {
    title: 'Saraswati Vandana',
    description: 'Classic Sarasvatī vandana',
    text: 'सरस्वति नमस्तुभ्यं वरदे कामरूपिणि। विद्यारम्भं करिष्यामि सिद्धिर्भवतु मे सदा॥',
    translation: 'O Sarasvatī, salutations to you, giver of boons, who assumes desired forms. As I begin study, may success always be mine.',
  },
  {
    title: 'Ganesha Dhyanam',
    description: 'Traditional Ganeśa meditation verse',
    text: 'वक्रतुण्ड महाकाय कोटिसूर्यसमप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
    translation: 'O Lord of the curved trunk and mighty body, whose brilliance equals a crore suns—make all my works always free of obstacles.',
  },
  {
    title: 'Siddhi Vinayaka Mantra',
    description: 'Mantra for accomplishment through Gaṇeśa',
    text: 'ॐ गं गणपतये नमः। ॐ श्री सिद्धिविनायकाय नमः॥',
    translation: 'Om Gaṁ Gaṇapataye Namaḥ. Om. Salutations to Śrī Siddhi-Vināyaka.',
  },
  {
    title: 'Subrahmanya Bhujanga Opening',
    description: 'Opening of Śaṅkara’s Subrahmaṇya Bhujṅga',
    text: 'सदा बालरूपाऽपि विघ्नाद्रिहन्त्री महादन्तिवक्त्राऽपि पञ्चास्यमान्या। विधीन्द्रादिमृग्या गणेशाभिधाने त्वमेकः प्रणम्यो जगत्स्वामिदेवः॥',
    translation: 'Though always childlike, you shatter mountains of obstacles; though elephant-faced, you are honoured by Śiva. Sought by Brahmā and Indra—you alone, Lord of the world, are worthy of bowing.',
  },
  {
    title: 'Surya Namaskar Mantra 1',
    description: 'First of the twelve Sūrya Namaskāra mantras',
    text: 'ॐ मित्राय नमः',
    translation: 'Om. Salutations to Mitra, the friendly aspect of the Sun.',
  },
  {
    title: 'Surya Namaskar Mantra 2',
    description: 'Second Sūrya Namaskāra mantra',
    text: 'ॐ रवये नमः',
    translation: 'Om. Salutations to Ravi, the radiant Sun.',
  },
  {
    title: 'Surya Namaskar Mantra 3',
    description: 'Third Sūrya Namaskāra mantra',
    text: 'ॐ सूर्याय नमः',
    translation: 'Om. Salutations to Sūrya.',
  },
  {
    title: 'Surya Namaskar Mantra 4',
    description: 'Fourth Sūrya Namaskāra mantra',
    text: 'ॐ भानवे नमः',
    translation: 'Om. Salutations to Bhānu, the shining one.',
  },
  {
    title: 'Surya Namaskar Mantra 5',
    description: 'Fifth Sūrya Namaskāra mantra',
    text: 'ॐ खगाय नमः',
    translation: 'Om. Salutations to Khaga, who moves through the sky.',
  },
  {
    title: 'Surya Namaskar Mantra 6',
    description: 'Sixth Sūrya Namaskāra mantra',
    text: 'ॐ पूष्णे नमः',
    translation: 'Om. Salutations to Pūṣan, the nourisher.',
  },
  {
    title: 'Surya Namaskar Mantra 7',
    description: 'Seventh Sūrya Namaskāra mantra',
    text: 'ॐ हिरण्यगर्भाय नमः',
    translation: 'Om. Salutations to Hiraṇyagarbha, the golden womb.',
  },
  {
    title: 'Surya Namaskar Mantra 8',
    description: 'Eighth Sūrya Namaskāra mantra',
    text: 'ॐ मरीचये नमः',
    translation: 'Om. Salutations to Marīci, the ray of light.',
  },
  {
    title: 'Surya Namaskar Mantra 9',
    description: 'Ninth Sūrya Namaskāra mantra',
    text: 'ॐ आदित्याय नमः',
    translation: 'Om. Salutations to Āditya, son of Aditi.',
  },
  {
    title: 'Surya Namaskar Mantra 10',
    description: 'Tenth Sūrya Namaskāra mantra',
    text: 'ॐ सवित्रे नमः',
    translation: 'Om. Salutations to Savitṛ, the impeller.',
  },
  {
    title: 'Surya Namaskar Mantra 11',
    description: 'Eleventh Sūrya Namaskāra mantra',
    text: 'ॐ अर्काय नमः',
    translation: 'Om. Salutations to Arka, the ray.',
  },
  {
    title: 'Surya Namaskar Mantra 12',
    description: 'Twelfth Sūrya Namaskāra mantra',
    text: 'ॐ भास्कराय नमः',
    translation: 'Om. Salutations to Bhāskara, the maker of light.',
  },
  {
    title: 'Navagraha Stotra Opening',
    description: 'Opening of the Navagraha stotra',
    text: 'जपाकुसुमसंकाशं काश्यपेयं महद्युतिम्। तमोरिं सर्वपापघ्नं प्रणतोऽस्मि दिवाकरम्॥',
    translation: 'I bow to the Sun, bright as the hibiscus, son of Kaśyapa, enemy of darkness, destroyer of all sins.',
  },
  {
    title: 'Chandra Stotra',
    description: 'Praise of the Moon among the Navagrahas',
    text: 'दधिशङ्खतुषाराभं क्षीरोदार्णवसम्भवम्। नमामि शशिनं सोमं शम्भोर्मुकुटभूषणम्॥',
    translation: 'I bow to Soma, the Moon—white as curd, conch and frost, born of the milky ocean, ornament of Śambhu’s crown.',
  },
  {
    title: 'Mangala Stotra',
    description: 'Praise of Mars (Maṅgala)',
    text: 'धरणीगर्भसम्भूतं विद्युत्कान्तिसमप्रभम्। कुमारं शक्तिहस्तं तं मङ्गलं प्रणमाम्यहम्॥',
    translation: 'I bow to Maṅgala, born of Earth’s womb, bright as lightning, the youth who holds śakti.',
  },
  {
    title: 'Budha Stotra',
    description: 'Praise of Mercury (Budha)',
    text: 'प्रियङ्गुकलिकाश्यामं रूपेणाप्रतिमं बुधम्। सौम्यं सौम्यगुणोपेतं तं बुधं प्रणमाम्यहम्॥',
    translation: 'I bow to Budha, dark as the priyaṅgu bud, matchless in form, gentle and endowed with gentle qualities.',
  },
  {
    title: 'Guru Stotra (Brihaspati)',
    description: 'Praise of Jupiter (Bṛhaspati)',
    text: 'देवानां च ऋषीणां च गुरुं काञ्चनसन्निभम्। बुद्धिभूतं त्रिलोकेशं तं नमामि बृहस्पतिम्॥',
    translation: 'I bow to Bṛhaspati, guru of gods and sages, golden-hued, embodiment of intellect, lord of the three worlds.',
  },
  {
    title: 'Shukra Stotra',
    description: 'Praise of Venus (Śukra)',
    text: 'हिमकुन्दमृणालाभं दैत्यानां परमं गुरुम्। सर्वशास्त्रप्रवक्तारं भार्गवं प्रणमाम्यहम्॥',
    translation: 'I bow to Bhārgava (Śukra), white as frost, jasmine and lotus fibre, supreme guru of the daityas, expounder of all śāstras.',
  },
  {
    title: 'Shani Stotra',
    description: 'Praise of Saturn (Śani)',
    text: 'नीलाञ्जनसमाभासं रविपुत्रं यमाग्रजम्। छायामार्तण्डसम्भूतं तं नमामि शनैश्चरम्॥',
    translation: 'I bow to Śanaiścara, dark as blue collyrium, son of the Sun, elder brother of Yama, born of Chāyā and Mārtaṇḍa.',
  },
  {
    title: 'Rahu Stotra',
    description: 'Praise of Rāhu',
    text: 'अर्धकायं महावीर्यं चन्द्रादित्यविमर्दनम्। सिंहिकागर्भसम्भूतं तं राहुं प्रणमाम्यहम्॥',
    translation: 'I bow to Rāhu—half-bodied, of great valour, tormentor of Moon and Sun, born of Siṃhikā’s womb.',
  },
  {
    title: 'Ketu Stotra',
    description: 'Praise of Ketu',
    text: 'पलाशपुष्पसङ्काशं तारकाग्रहमस्तकम्। रौद्रं रौद्रात्मकं घोरं तं केतुं प्रणमाम्यहम्॥',
    translation: 'I bow to Ketu, coloured like the palāśa flower, head among stars and planets, fierce and terrible in nature.',
  },
  {
    title: 'Bhagavad Gita 2.20',
    description: 'The Self is never born and never dies',
    text: 'न जायते म्रियते वा कदाचिन्नायं भूत्वा भविता वा न भूयः। अजो नित्यः शाश्वतोऽयं पुराणो न हन्यते हन्यमाने शरीरे॥',
    translation: 'The Self is never born nor dies; having been, It never ceases to be. Unborn, eternal, everlasting, ancient—It is not slain when the body is slain.',
  },
  {
    title: 'Bhagavad Gita 4.7',
    description: 'The Lord descends to restore dharma',
    text: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत। अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥',
    translation: 'Whenever dharma declines and adharma rises, O Bhārata, then I manifest Myself.',
  },
  {
    title: 'Bhagavad Gita 9.22',
    description: 'The Lord protects those who worship Him alone',
    text: 'अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते। तेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्॥',
    translation: 'Those who worship Me thinking of nothing else, ever united—I carry their yoga and kṣema (what they need and what they have).',
  },
  {
    title: 'Bhagavad Gita 18.66',
    description: 'The carama śloka — take refuge in the Lord alone',
    text: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज। अहं त्वा सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥',
    translation: 'Abandoning all dharmas, take refuge in Me alone. I shall liberate you from all sins; do not grieve.',
  },
  {
    title: 'Ishavasya Opening',
    description: 'Opening of the Īśāvāsya Upaniṣad',
    text: 'ईशावास्यमिदं सर्वं यत्किञ्च जगत्यां जगत्। तेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम्॥',
    translation: 'All this—whatever moves in this world—is pervaded by the Lord. Enjoy by renunciation; do not covet anyone’s wealth.',
  },
  {
    title: 'Katha Upanishad Opening',
    description: 'Famous teaching on the two paths',
    text: 'श्रेयश्च प्रेयश्च मनुष्यमेतः तौ सम्परीत्य विविनक्ति धीरः। श्रेयो हि धीरोऽभि प्रेयसो वृणीते प्रेयो मन्दो योगक्षेमाद्वृणीते॥',
    translation: 'The good and the pleasant approach a person; the wise discriminate and choose the good over the pleasant; the dull choose the pleasant for yoga-kṣema.',
  },
  {
    title: 'Mundaka Upanishad Opening',
    description: 'Two birds on one tree — the classic Upaniṣadic image',
    text: 'द्वा सुपर्णा सयुजा सखाया समानं वृक्षं परिषस्वजाते। तयोरन्यः पिप्पलं स्वाद्वत्त्यनश्नन्नन्यो अभिचाकशीति॥',
    translation: 'Two birds, companions, cling to the same tree. One eats the sweet fruit; the other looks on without eating.',
  },
  {
    title: 'Taittiriya Shanti Mantra',
    description: 'Peace mantra of the Taittirīya Upaniṣad',
    text: 'ॐ शं नो मित्रः शं वरुणः। शं नो भवत्वर्यमा। शं नो इन्द्रो बृहस्पतिः। शं नो विष्णुरुरुक्रमः॥',
    translation: 'Om. May Mitra be gracious to us; may Varuṇa; may Aryaman; may Indra and Bṛhaspati; may Viṣṇu of wide strides be gracious to us.',
  },
  {
    title: 'Om Namo Bhagavate Vasudevaya',
    description: 'Dvādaśākṣara mantra of Viṣṇu-Kṛṣṇa',
    text: 'ॐ नमो भगवते वासुदेवाय॥',
    translation: 'Om. Salutations to the Blessed Lord Vāsudeva.',
  },
  {
    title: 'Om Aim Hrim Klim Chamundayai Vicche',
    description: 'Navārṇa mantra of the Divine Mother',
    text: 'ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे॥',
    translation: 'Om Aiṁ Hrīṁ Klīṁ Cāmuṇḍāyai Vicce — the nine-syllable mantra of the Goddess.',
  },
  {
    title: 'Kalikayai Namah',
    description: 'Simple Kālī mantra',
    text: 'ॐ क्रीं कालिकायै नमः॥',
    translation: 'Om Krīṁ Kālikāyai Namaḥ — salutations to Mother Kālī.',
  },
  {
    title: 'Dattatreya Digambara',
    description: 'Traditional Datta nāma',
    text: 'ॐ द्रां दत्तात्रेयाय नमः। दत्त दिगम्बरा जय जय दत्त दिगम्बरा॥',
    translation: 'Om Drāṁ Dattātreyāya Namaḥ. Victory to Datta Digambara.',
  },
  {
    title: 'Sai Gayatri',
    description: 'Modern-traditional Gāyatrī for Sai',
    text: 'ॐ शिरडीवासाय विद्महे भक्तानुग्रहाय धीमहि। तन्नः साईः प्रचोदयात्॥',
    translation: 'Om. We meditate on the Lord who dwells in Shirdi, who blesses devotees. May Sai inspire us.',
  },
  {
    title: 'Venkatesha Suprabhatam Opening',
    description: 'Opening of Śrī Veṅkaṭeśa Suprabhātam',
    text: 'कौसल्यासुप्रजा राम पूर्वा सन्ध्या प्रवर्तते। उत्तिष्ठ नरशार्दूल कर्तव्यं दैवमाह्निकम्॥',
    translation: 'O Rāma, noble son of Kausalyā—the eastern twilight advances. Arise, tiger among men; the divine daily duties await.',
  },
  {
    title: 'Vishnu Sahasranama Dhyanam',
    description: 'Meditation verse before Viṣṇu Sahasranāma',
    text: 'शान्ताकारं भुजगशयनं पद्मनाभं सुरेशं विश्वाधारं गगनसदृशं मेघवर्णं शुभाङ्गम्। लक्ष्मीकान्तं कमलनयनं योगिभिर्ध्यानगम्यं वन्दे विष्णुं भवभयहरं सर्वलोकैकनाथम्॥',
    translation: 'I bow to Viṣṇu—peaceful in form, reclining on the serpent, lotus-naveled Lord of gods, support of the universe, sky-like, cloud-hued, graceful, beloved of Lakṣmī, lotus-eyed, reachable by yogis’ meditation, remover of worldly fear, sole Lord of all worlds.',
  },
  {
    title: 'Ganga Stotram Opening',
    description: 'Śaṅkara’s Gaṅgā stotra opening',
    text: 'देवि सुरेश्वरि भगवति गङ्गे त्रिभुवनतारिणि तरलतरङ्गे। शङ्करमौलविहारिणि विमले मम मतिरास्तां तव पदकमले॥',
    translation: 'O Goddess, queen of gods, Blessed Gaṅgā—saviour of the three worlds with playful waves, sporting in Śaṅkara’s matted locks—may my mind rest at your lotus feet.',
  },
  {
    title: 'Yamuna Ashtakam Opening',
    description: 'Praise of Yamunā',
    text: 'नमस्ते यमुने देव्यै सर्वपापप्रणाशिन्यै। नमस्ते सर्वदेवानामाश्रयायै नमो नमः॥',
    translation: 'Salutations to Goddess Yamunā, destroyer of all sins, refuge of all gods—salutations again and again.',
  },
  {
    title: 'Tulsi Vandana',
    description: 'Worship of Tulasī',
    text: 'यन्मूले सर्वतीर्थानि यन्मध्ये सर्वदेवताः। यदग्रे सर्ववेदाश्च तुलसीं त्वां नमाम्यहम्॥',
    translation: 'At your root are all tīrthas; in your middle all deities; at your tip all Vedas—O Tulasī, I bow to you.',
  },
  {
    title: 'Bhumi Sukta Opening',
    description: 'Opening spirit of the Bhūmi Sūkta (Atharvaveda)',
    text: 'भूमिर्भूम्ना ध्यौर्वरिणाऽन्तरिक्षं महित्वा। उपस्थे ते देव्यदितेऽग्निमन्नादमन्नाद्यायादधे॥',
    translation: 'Earth by greatness, Heaven by height, the mid-region by majesty—O Goddess Aditi, in your lap I place Agni, eater of food, for the sake of food.',
  },
  {
    title: 'Mrityunjaya Homa Mantra',
    description: 'Fire offering form of the Mṛtyuñjaya',
    text: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् स्वाहा॥',
    translation: 'We worship the three-eyed Lord… may we be freed from death, not from immortality—svāhā.',
  },
  {
    title: 'Om Shanti Shanti Shanti',
    description: 'Threefold peace invocation',
    text: 'ॐ शान्तिः शान्तिः शान्तिः॥',
    translation: 'Om. Peace (in the body), peace (in nature), peace (in the divine).',
  },
  {
    title: 'Guru Stotram Classic',
    description: 'Classic verse on the Guru',
    text: 'गुरुर्ब्रह्मा गुरुर्विष्णुर्गुरुर्देवो महेश्वरः। गुरुरेव परं ब्रह्म तस्मै श्रीगुरवे नमः॥',
    translation: 'The Guru is Brahmā, Viṣṇu and Maheśvara. The Guru alone is the Supreme Brahman—salutations to that holy Guru.',
  },
  {
    title: 'Om Aim Saraswatyai Namah',
    description: 'Bīja mantra of Sarasvatī',
    text: 'ॐ ऐं सरस्वत्यै नमः॥',
    translation: 'Om Aiṁ Sarasvatyai Namaḥ — salutations to Sarasvatī.',
  },
  {
    title: 'Om Shreem Mahalakshmyai Namah',
    description: 'Bīja mantra of Mahālakṣmī',
    text: 'ॐ श्रीं महालक्ष्म्यै नमः॥',
    translation: 'Om Śrīṁ Mahālakṣmyai Namaḥ — salutations to Mahālakṣmī.',
  },
  {
    title: 'Om Dum Durgayai Namah',
    description: 'Bīja mantra of Durgā',
    text: 'ॐ दुं दुर्गायै नमः॥',
    translation: 'Om Duṁ Durgāyai Namaḥ — salutations to Durgā.',
  },
  {
    title: 'Om Gam Ganapataye Namah',
    description: 'Primary bīja mantra of Gaṇeśa',
    text: 'ॐ गं गणपतये नमः॥',
    translation: 'Om Gaṁ Gaṇapataye Namaḥ — salutations to Gaṇapati.',
  },
  {
    title: 'Om Namah Shivaya (Panchakshari)',
    description: 'The five-syllable mantra of Śiva',
    text: 'ॐ नमः शिवाय॥',
    translation: 'Om. Salutations to Śiva.',
  },
  {
    title: 'Hare Rama Hare Krishna',
    description: 'Alternate ordering of the Mahāmantra',
    text: 'हरे राम हरे राम राम राम हरे हरे। हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे॥',
    translation: 'Chant the holy names of Rāma and Kṛṣṇa.',
  },
  {
    title: 'Sri Rama Jaya Rama',
    description: 'Simple Rāma nāma for continuous japa',
    text: 'श्री राम जय राम जय जय राम॥',
    translation: 'Victory to Śrī Rāma; victory, victory to Rāma.',
  },
  {
    title: 'Sita Rama Radhe Shyam',
    description: 'Combined nāma of Rāma-Sītā and Rādhā-Śyāma',
    text: 'सीता राम सीता राम सीता राम जय सीता राम। राधे श्याम राधे श्याम राधे श्याम जय राधे श्याम॥',
    translation: 'Glory to Sītā-Rāma; glory to Rādhā-Śyāma.',
  },
  {
    title: 'Om Tat Sat',
    description: 'Upaniṣadic designation of the Absolute',
    text: 'ॐ तत् सत्॥',
    translation: 'Om. That is Truth / Reality.',
  },
  {
    title: 'Brahmarpanam',
    description: 'Food offering verse from the Bhagavad Gītā tradition',
    text: 'ब्रह्मार्पणं ब्रह्म हविर्ब्रह्माग्नौ ब्रह्मणा हुतम्। ब्रह्मैव तेन गन्तव्यं ब्रह्मकर्मसमाधिना॥',
    translation: 'Brahman is the offering, Brahman the oblation, poured by Brahman into the fire of Brahman. Brahman alone is to be reached by one absorbed in action as Brahman.',
  },
  {
    title: 'Pratah Smaranam Opening',
    description: 'Morning remembrance of the Self',
    text: 'प्रातः स्मरामि हृदि संस्फुरदात्मतत्त्वं सच्चित्सुखं परमहंसगतिं तुरीयम्। यत्स्वप्नजागरसुषुप्तमवैति नित्यं तद्ब्रह्म निष्कलमहं न च भूतसङ्घः॥',
    translation: 'At dawn I remember the Self shining in the heart—existence-consciousness-bliss, the fourth state of the supreme swan. That which knows dream, waking and sleep—I am that partless Brahman, not this aggregate of elements.',
  },
  {
    title: 'Sandhya Vandana Gayatri',
    description: 'Gāyatrī as used in sandhyā worship',
    text: 'ॐ भूर्भुवः सुवः। तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि। धियो यो नः प्रचोदयात्॥',
    translation: 'Om. Earth, mid-region, heaven. We meditate on the excellent glory of Savitṛ; may He inspire our intellect.',
  },
  {
    title: 'Agnimeele Purohitam',
    description: 'Opening ṛk of the Ṛgveda',
    text: 'अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम्। होतारं रत्नधातमम्॥',
    translation: 'I praise Agni, the household priest, divine ministrant of the sacrifice, the invoker who most bestows treasure.',
  },
  {
    title: 'Purusha Sukta Opening',
    description: 'Opening of the Puruṣa Sūkta',
    text: 'सहस्रशीर्षा पुरुषः सहस्राक्षः सहस्रपात्। स भूमिं विश्वतो वृत्वा अत्यतिष्ठद्दशाङ्गुलम्॥',
    translation: 'The Puruṣa has a thousand heads, a thousand eyes, a thousand feet. Encompassing the earth on all sides, He stood beyond it by ten fingers’ breadth.',
  },
  {
    title: 'Sri Sukta Opening',
    description: 'Opening of the Śrī Sūkta',
    text: 'हिरण्यवर्णां हरिणीं सुवर्णरजतस्रजाम्। चन्द्रां हिरण्मयीं लक्ष्मीं जातवेदो म आवह॥',
    translation: 'O Jātavedas, bring to me Lakṣmī—golden-hued, deer-like, adorned with gold and silver, moon-like, made of gold.',
  },
  {
    title: 'Medha Suktam Opening',
    description: 'Prayer for medhā (intelligence)',
    text: 'मेधा देवी जुषमाणा न आगात् विश्वाची भद्रा सुमनस्यमाना। त्वया जुष्टा जुषमाणा दुरुक्तान् बृहद्वदेम विदथे सुवीराः॥',
    translation: 'May Goddess Medhā, gracious and auspicious, come to us facing all ways. Favoured by you, may we speak greatly in the assembly as brave ones, free from harsh speech.',
  },
  {
    title: 'Durga Suktam Opening',
    description: 'Opening of the Durgā Sūkta',
    text: 'जातवेदसे सुनवाम सोममरातीयतो निदहाति वेदः। स नः पर्षदति दुर्गाणि विश्वा नावेव सिन्धुं दुरितात्यग्निः॥',
    translation: 'To Jātavedas we press Soma; may He burn away the knowledge of our enemies. May Agni carry us across all difficulties and evils, as a boat across a river.',
  },
  {
    title: 'Narayana Upanishad Mantra',
    description: 'Core mantra from the Nārāyaṇa Upaniṣad tradition',
    text: 'ॐ नारायणाय विद्महे वासुदेवाय धीमहि। तन्नो विष्णुः प्रचोदयात्॥',
    translation: 'Om. We meditate on Nārāyaṇa, on Vāsudeva. May that Viṣṇu inspire us.',
  },
  {
    title: 'Rudra Gayatri',
    description: 'Gāyatrī of Rudra-Śiva',
    text: 'ॐ तत्पुरुषाय विद्महे महादेवाय धीमहि। तन्नो रुद्रः प्रचोदयात्॥',
    translation: 'Om. We meditate on that Puruṣa, on Mahādeva. May Rudra inspire us.',
  },
  {
    title: 'Narasimha Gayatri',
    description: 'Gāyatrī of Narasiṃha',
    text: 'ॐ वज्रनखाय विद्महे तीक्ष्णदंष्ट्राय धीमहि। तन्नो नारसिंहः प्रचोदयात्॥',
    translation: 'Om. We meditate on the thunderbolt-clawed, sharp-fanged one. May Narasiṃha inspire us.',
  },
  {
    title: 'Hayagriva Gayatri',
    description: 'Gāyatrī of Hayagrīva',
    text: 'ॐ वागीश्वराय विद्महे हयग्रीवाय धीमहि। तन्नो हंसः प्रचोदयात्॥',
    translation: 'Om. We meditate on the Lord of speech, Hayagrīva. May that Swan inspire us.',
  },
  {
    title: 'Sudarshana Mantra',
    description: 'Mantra of Viṣṇu’s discus',
    text: 'ॐ क्लीं कृष्णाय गोविन्दाय गोपीजनवल्लभाय पराया नमः। ॐ सहस्रार हुं फट्॥',
    translation: 'Om. Salutations to Kṛṣṇa-Govinda, beloved of the gopīs, the Supreme. Om. Thousand-spoked (discus)—hūṁ phaṭ.',
  },
  {
    title: 'Garuda Mantra',
    description: 'Mantra associated with Garuḍa',
    text: 'ॐ पक्षिराजाय विद्महे स्वर्णपक्षाय धीमहि। तन्नो गरुडः प्रचोदयात्॥',
    translation: 'Om. We meditate on the king of birds, golden-winged. May Garuḍa inspire us.',
  },
  {
    title: 'Ayyappa Mantra',
    description: 'Traditional Śabarimalā nāma',
    text: 'स्वामीये शरणं अय्यप्पा। ॐ श्री अय्यप्पाये नमः॥',
    translation: 'Swamiye Śaraṇam Ayyappā. Om. Salutations to Śrī Ayyappa.',
  },
  {
    title: 'Vitthala Mantra',
    description: 'Pandharpur nāma of Viṭṭhala',
    text: 'जय जय विठ्ठल जय हरि विठ्ठल। ज्ञानदेव तुकाराम विठ्ठल विठ्ठल॥',
    translation: 'Victory to Viṭṭhala, victory to Hari Viṭṭhala—remembered with Jñāneśvar and Tukārām.',
  },
  {
    title: 'Jagannatha Mantra',
    description: 'Mantra of Lord Jagannātha of Puri',
    text: 'ॐ नमो भगवते जगन्नाथाय। नीलाचलेशाय नमः॥',
    translation: 'Om. Salutations to the Blessed Lord Jagannātha, Lord of Nīlācala.',
  },
  {
    title: 'Balaji Mantra',
    description: 'Mantra of Śrī Veṅkaṭeśwara',
    text: 'ॐ नमो वेङ्कटेशाय। श्रीनिवासाय नमः॥',
    translation: 'Om. Salutations to Veṅkaṭeśa. Salutations to Śrīnivāsa.',
  },
  {
    title: 'Meenakshi Mantra',
    description: 'Mantra of Goddess Mīnākṣī',
    text: 'ॐ ह्रीं मीनाक्ष्यै नमः। मातङ्ग्यै नमः॥',
    translation: 'Om Hrīṁ Mīnākṣyai Namaḥ. Salutations to Mātaṅgī-Mīnākṣī.',
  },
  {
    title: 'Kamakshi Mantra',
    description: 'Mantra of Kāmākṣī of Kāñcī',
    text: 'ॐ क्लीं कामाक्ष्यै नमः॥',
    translation: 'Om Klīṁ Kāmākṣyai Namaḥ — salutations to Kāmākṣī.',
  },
  {
    title: 'Visalakshi Mantra',
    description: 'Mantra of Viśālākṣī of Vārāṇasī',
    text: 'ॐ ह्रीं विशालाक्ष्यै नमः॥',
    translation: 'Om Hrīṁ Viśālākṣyai Namaḥ — salutations to Viśālākṣī.',
  },
  {
    title: 'Bala Tripurasundari Mantra',
    description: 'Mantra of Bālā Tripurasundarī',
    text: 'ॐ ऐं क्लीं सौः बालायै नमः॥',
    translation: 'Om Aiṁ Klīṁ Sauḥ Bālāyai Namaḥ — salutations to Bālā.',
  },
  {
    title: 'Chhinnamasta Mantra',
    description: 'Mantra of Chhinnamastā (Mahāvidyā)',
    text: 'ॐ श्रीं ह्रीं क्लीं ऐं वज्रवैरोचनीये हूं हूं फट् स्वाहा॥',
    translation: 'Traditional bīja mantra of Chhinnamastā — recite with guidance from a qualified teacher.',
  },
  {
    title: 'Bagalamukhi Mantra',
    description: 'Mantra of Goddess Bagalāmukhī',
    text: 'ॐ ह्लीं बगलामुखि सर्वदुष्टानां वाचं मुखं पदं स्तम्भय जिह्वां कीलय बुद्धिं विनाशय ह्लीं ॐ स्वाहा॥',
    translation: 'Om Hlīṁ Bagalāmukhi—stun the speech, mouth and feet of all the wicked; nail the tongue; destroy (hostile) intellect—Hlīṁ Om Svāhā.',
  },
  {
    title: 'Matangi Mantra',
    description: 'Mantra of Goddess Mātaṅgī',
    text: 'ॐ ह्रीं क्लीं हूँ मातङ्ग्यै फट् स्वाहा॥',
    translation: 'Om Hrīṁ Klīṁ Hūṁ Mātaṅgyai Phaṭ Svāhā.',
  },
  {
    title: 'Dhumavati Mantra',
    description: 'Mantra of Goddess Dhūmāvatī',
    text: 'ॐ धूं धूं धूमावत्यै नमः॥',
    translation: 'Om Dhūṁ Dhūṁ Dhūmāvatyai Namaḥ.',
  },
  {
    title: 'Bhuvaneshwari Mantra',
    description: 'Mantra of Bhuvaneśvarī',
    text: 'ॐ ह्रीं भुवनेश्वर्यै नमः॥',
    translation: 'Om Hrīṁ Bhuvaneśvaryai Namaḥ.',
  },
  {
    title: 'Tripura Bhairavi Mantra',
    description: 'Mantra of Tripura Bhairavī',
    text: 'ॐ हसैं हसकरीं हसैं त्रिपुरभैरव्यै नमः॥',
    translation: 'Om Hasaiṁ Hasakarīṁ Hasaiṁ Tripurabhairavyai Namaḥ.',
  },
  {
    title: 'Sodashi Tripura Mantra',
    description: 'Pañcadaśī / Ṣoḍaśī related invocation (short form)',
    text: 'ॐ श्रीं ह्रीं क्लीं ऐं सौः षोडश्यै नमः॥',
    translation: 'Om Śrīṁ Hrīṁ Klīṁ Aiṁ Sauḥ Ṣoḍaśyai Namaḥ — short form; full ṣoḍaśī is received from a guru.',
  },
];

const existing = JSON.parse(fs.readFileSync(target, 'utf8'));
const seen = new Set();
const out = [];

function keyOf(m) {
  return `${String(m.title).toLowerCase().trim()}|${String(m.text).toLowerCase().replace(/\s+/g, ' ').trim()}`;
}

for (const raw of existing.mantras) {
  const fix = TEXT_FIXES[raw.title];
  const mantra = {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    text: fix?.text ?? raw.text,
    translation: fix?.translation ?? raw.translation,
    imageUrl: IMAGES[classify(raw.title, raw.description)],
    audioUrl: '',
    sourceUrl: raw.sourceUrl || 'https://en.wikipedia.org/wiki/Hindu_texts',
  };
  const k = keyOf(mantra);
  if (seen.has(k)) continue;
  seen.add(k);
  out.push(mantra);
}

let nextId = Math.max(...out.map((m) => m.id)) + 1;
for (const add of ADDITIONS) {
  const mantra = {
    id: nextId++,
    title: add.title,
    description: add.description,
    text: add.text,
    translation: add.translation,
    imageUrl: IMAGES[classify(add.title, add.description)],
    audioUrl: '',
    sourceUrl: 'https://en.wikipedia.org/wiki/Hindu_texts',
  };
  const k = keyOf(mantra);
  if (seen.has(k)) continue;
  seen.add(k);
  out.push(mantra);
}

fs.writeFileSync(target, `${JSON.stringify({ mantras: out }, null, 2)}\n`, 'utf8');
console.log(`Wrote ${out.length} mantras to ${target}`);
