export type BeginnerRitualGuidance = {
  meaning: string;
  purpose: string;
  materials: string;
  actions: string[];
  say: string;
  duration: string;
  completeWhen: string;
  note?: string;
};

/**
 * A simple household interpretation of the sixteen offerings. Formal temple,
 * lineage, wedding, fire and life-cycle rites can require a qualified priest.
 */
export const RITUAL_GUIDANCE: Record<string, BeginnerRitualGuidance> = {
  sankalpa: {
    meaning: "Sankalpa means making a clear and sincere intention before beginning worship.",
    purpose: "It settles the mind and states why you are performing this puja.",
    materials: "A flower or a few grains of rice; a little water is optional.",
    actions: [
      "Sit comfortably facing the deity and take one slow breath.",
      "Hold the flower or rice in your right palm, or simply join both palms.",
      "Quietly state your name, where you are, and the purpose of this puja in your own words.",
      "Place the offering before the deity, then press and hold the on-screen offering button.",
    ],
    say: "With a calm mind, I begin this puja. May it be completed peacefully and without obstacles.",
    duration: "About 30–60 seconds.",
    completeWhen: "Your intention has been spoken and the flower or rice has been placed down.",
    note: "You do not need to know your gotra or a long Sanskrit formula for this beginner household version.",
  },
  avahana: {
    meaning: "Dhyana means meditation; Avahana means respectfully inviting the deity's presence.",
    purpose: "You shift attention away from distractions and toward the divine form.",
    materials: "No extra material is required; one flower may be offered.",
    actions: [
      "Look gently at the deity image and notice the face, posture, and symbols.",
      "Visualize a warm light around the deity for a few breaths.",
      "Invite the deity to accept your worship, then tap Offer now.",
    ],
    say: "Please be present in this worship and kindly accept my devotion.",
    duration: "About 30 seconds.",
    completeWhen: "You feel attentive and have made the invitation.",
  },
  asana: {
    meaning: "Asana here means offering a respectful seat to the invited deity.",
    purpose: "It welcomes the deity as an honoured guest.",
    materials: "One flower, a few grains of rice, or a small decorative cloth.",
    actions: [
      "Place the flower, rice, or cloth before the deity image.",
      "Imagine that you are offering a clean and beautiful seat.",
      "Tap Offer now to complete the symbolic offering.",
    ],
    say: "I offer this seat with respect. Please remain here during my worship.",
    duration: "About 15–30 seconds.",
    completeWhen: "The symbolic seat has been placed before the deity.",
  },
  padya: {
    meaning: "Padya means offering water for washing the feet of an honoured guest.",
    purpose: "It expresses humility, welcome, and service.",
    materials: "A spoonful of clean water and a small empty bowl.",
    actions: [
      "Hold the water near the deity's feet without touching the image.",
      "Pour one spoonful into the empty bowl as a symbolic offering.",
      "Press and hold the on-screen button until the water offering completes.",
    ],
    say: "I offer this water at your feet with humility and devotion.",
    duration: "About 20–30 seconds.",
    completeWhen: "A small amount of water has been poured into the receiving bowl.",
    note: "Do not pour water directly onto a paper picture, electrical decoration, or a material that can be damaged.",
  },
  arghya: {
    meaning: "Arghya is a respectful welcome offering of water.",
    purpose: "It honours the deity and continues the traditional welcome given to a revered guest.",
    materials: "Clean water; a flower petal or a few grains of rice are optional.",
    actions: [
      "Add a petal or rice to a small spoon or cup of water if available.",
      "Raise it briefly with both hands in a respectful gesture.",
      "Pour it into the receiving bowl and tap Offer now.",
    ],
    say: "Please accept this respectful offering of water.",
    duration: "About 20–30 seconds.",
    completeWhen: "The welcome water has been offered into the bowl.",
  },
  achamaniya: {
    meaning: "Achamaniya means offering clean water for symbolic sipping or purification.",
    purpose: "It completes the welcome and represents purity before the main offerings.",
    materials: "A very small spoonful of clean water.",
    actions: [
      "Take a small spoonful of water from the clean-water cup.",
      "Offer it symbolically near the deity, then pour it into the receiving bowl.",
      "Tap Offer now.",
    ],
    say: "Please accept this pure water.",
    duration: "About 15–20 seconds.",
    completeWhen: "The small symbolic water offering has been made.",
    note: "This screen asks you to offer water to the deity; it does not require you to drink it.",
  },
  snana: {
    meaning: "Snana or Abhisheka means respectfully bathing the deity.",
    purpose: "It symbolizes purification, care, and renewal.",
    materials: "Clean water and a receiving bowl; use other liquids only if your family tradition specifically does so.",
    actions: [
      "For a bathing-safe metal or stone murti, pour a little clean water slowly over it into a bowl.",
      "For a picture or delicate murti, keep the water in front and make only a symbolic pouring gesture.",
      "Press and hold the on-screen button while visualizing the sacred bath.",
      "Gently dry a physical murti with a clean soft cloth if needed.",
    ],
    say: "May this sacred bath represent purity in body, speech, and mind.",
    duration: "About 1–2 minutes.",
    completeWhen: "The symbolic bath is finished and the worship area is clean and dry.",
    note: "Never pour liquid on paper, painted clay, wood, electronics, or any image that may be damaged.",
  },
  vastra: {
    meaning: "Vastra means offering clean clothing to the deity.",
    purpose: "It expresses care, dignity, and hospitality.",
    materials: "A clean small cloth, decorative fabric, or a symbolic thread.",
    actions: [
      "Place or drape the clean cloth only if the murti is suitable for dressing.",
      "For a picture, place the cloth neatly in front as a symbolic offering.",
      "Tap Offer now.",
    ],
    say: "I offer this clean cloth with respect and devotion.",
    duration: "About 30–60 seconds.",
    completeWhen: "The cloth or symbolic thread has been placed neatly.",
  },
  alankara: {
    meaning: "Yajnopavita and Alankara mean offering a sacred thread and simple adornment.",
    purpose: "They honour the deity with beauty and respectful care.",
    materials: "A sacred thread, flower garland, or simple ornament; all are optional in a beginner puja.",
    actions: [
      "Offer only clean items that are safe for the murti or image.",
      "Place a thread or garland gently, or keep it in front as a symbolic offering.",
      "Tap Offer now.",
    ],
    say: "Please accept these simple adornments offered with devotion.",
    duration: "About 30–60 seconds.",
    completeWhen: "The chosen adornment has been placed without disturbing the altar.",
    note: "It is completely acceptable to skip physical ornaments and offer a flower instead.",
  },
  tilaka: {
    meaning: "Gandha and Tilaka mean offering fragrance and an auspicious sacred mark.",
    purpose: "The mark represents honour, blessing, and focused awareness.",
    materials: "A tiny amount of sandal paste, kumkum, or another substance used by your family tradition.",
    actions: [
      "Take only a very small amount on your ring finger or a clean applicator.",
      "Apply it gently to a suitable murti, or place it before a picture without marking the paper.",
      "Touch the glowing point on the on-screen deity image.",
    ],
    say: "I offer this fragrance and sacred mark with reverence.",
    duration: "About 20–30 seconds.",
    completeWhen: "A small mark or symbolic offering has been made neatly.",
    note: "Do not apply wet paste to paper artwork, screens, or delicate surfaces.",
  },
  pushpa: {
    meaning: "Pushparchana means worship by offering flowers.",
    purpose: "Each flower represents gratitude, love, and one good quality you wish to cultivate.",
    materials: "Six clean flowers or petals; rice may be used when flowers are unavailable.",
    actions: [
      "Take one flower or petal at a time.",
      "Chant the displayed deity mantra once, or simply offer a word of gratitude.",
      "Place the flower at the deity's feet and tap one on-screen flower.",
      "Repeat until all six flowers have been offered.",
    ],
    say: "I offer this flower with gratitude and devotion.",
    duration: "About 1–2 minutes.",
    completeWhen: "All six flowers or petals have been offered.",
  },
  dhoopa: {
    meaning: "Dhoopa means offering incense or a pleasant fragrance.",
    purpose: "The rising fragrance represents a purified atmosphere and an uplifted mind.",
    materials: "One incense stick with a stable holder; a flower may replace incense.",
    actions: [
      "Place the incense in a stable holder away from curtains, children, and pets.",
      "Light it, extinguish the open flame, and let only the tip glow.",
      "Move it clockwise before the deity three gentle times without touching the image.",
      "Press and hold the on-screen offering button.",
    ],
    say: "May this fragrance purify the space and my thoughts.",
    duration: "About 30–45 seconds.",
    completeWhen: "The incense is safely placed in its holder after the offering.",
    note: "If smoke affects anyone, do not light incense; offer a flower or simply visualize fragrance.",
  },
  deepa: {
    meaning: "Deepa means offering the light of a lamp.",
    purpose: "The flame represents knowledge, clarity, and the removal of inner darkness.",
    materials: "A small diya or candle on a stable fire-safe plate; a battery lamp is also suitable.",
    actions: [
      "Place the lamp on a stable surface with clear space around it.",
      "Light it carefully, or switch on a battery lamp.",
      "Join your palms for a moment and press and hold the on-screen button.",
    ],
    say: "May this light awaken wisdom, clarity, and kindness.",
    duration: "About 30 seconds.",
    completeWhen: "The lamp is glowing safely in front of the deity.",
    note: "Never leave a flame unattended. Keep water nearby and use a battery lamp whenever fire is unsafe.",
  },
  naivedya: {
    meaning: "Naivedya and Tambula mean offering food, water, and a respectful after-meal offering.",
    purpose: "You express gratitude for nourishment before receiving it as prasada.",
    materials: "A small portion of fresh vegetarian food or fruit and a cup of drinking water; betel is optional.",
    actions: [
      "Place the food and water in clean dishes before the deity.",
      "Pause quietly and imagine offering the meal with gratitude.",
      "Tap Offer now and leave the food undisturbed for a few minutes.",
    ],
    say: "Please accept this food and water, offered with gratitude.",
    duration: "About 1 minute, followed by a short quiet pause.",
    completeWhen: "The food and water have been placed and the prayer has been said.",
    note: "After the puja, treat the offering as prasada and share it respectfully. Follow your family dietary customs.",
  },
  nirajana: {
    meaning: "Nirajana or Aarti means circling a light before the deity; Mantrapushpa is the concluding mantra and flower.",
    purpose: "It gathers the worship into a final offering of light, praise, and gratitude.",
    materials: "A lit diya on an aarti plate, or a safe battery lamp; one flower is optional.",
    actions: [
      "Hold the plate steadily with your right hand supported by your left.",
      "Move the light clockwise in two slow, complete circles before the deity.",
      "On screen, drag the lamp around the deity until the progress reaches 100%.",
      "Place the lamp safely down and offer the final flower if available.",
    ],
    say: "May this light and prayer be accepted. May there be peace and wellbeing for all.",
    duration: "About 1–2 minutes.",
    completeWhen: "Two clockwise circles are complete and the lamp is safely placed down.",
    note: "Keep the flame away from hair, clothing, decorations, children, and pets.",
  },
  samarpana: {
    meaning: "Pradakshina, Namaskara, and Samarpana mean circumambulation, bowing, and offering the entire worship.",
    purpose: "You conclude with humility, gratitude, and surrender of the results.",
    materials: "No additional material is required.",
    actions: [
      "Join your palms and mentally circle the deity clockwise, or walk one careful circle if space permits.",
      "Bow your head and thank the deity for accepting the worship.",
      "Ask forgiveness for any mistakes made unknowingly.",
      "Press and hold the on-screen button, then sit quietly for a few breaths.",
    ],
    say: "Whatever I offered with devotion, I place before you. Please forgive my mistakes and bless everyone with peace.",
    duration: "About 1 minute.",
    completeWhen: "You have bowed, expressed gratitude, and rested quietly for a moment.",
    note: "There is no need to worry about perfect pronunciation; sincerity and respectful attention are the focus of this beginner guide.",
  },
};
