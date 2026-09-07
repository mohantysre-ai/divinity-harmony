/**
 * Deeper, sourced content for the six "meaning card" modules on a state's
 * culture page (see StateCultureGuide in CultureIndiaPage.tsx). culture-packs.ts
 * and state-culture-profiles.ts hold the compact facts shown on the card
 * itself; this file holds what appears once a card is clicked open — enough
 * to actually explain *why* something matters, not just name it.
 *
 * Only as accurate as the sources listed per item — corrections welcome.
 * Only andhra-pradesh is filled in so far. Other states fall back to the
 * card's existing summary until they get the same research pass; see
 * moduleDetailFor() in CultureIndiaPage.tsx for that fallback behaviour.
 */

export type DeepDiveItem = {
  name: string;
  detail: string;
  sourceUrl?: string;
};

export type DeepDiveModule = {
  /** A fuller paragraph than the module's one-line intro. */
  overview: string;
  items: DeepDiveItem[];
  sourceLabel?: string;
  sourceUrl?: string;
};

export type StateDeepDive = Partial<Record<
  "calendar" | "rituals" | "journeys" | "language" | "arts" | "food",
  DeepDiveModule
>>;

export const cultureDeepDives: Record<string, StateDeepDive> = {
  "andhra-pradesh": {
    calendar: {
      overview:
        "The Telugu year turns on Ugadi, and the day itself is built around accepting — not just celebrating — everything the year ahead might bring.",
      items: [
        {
          name: "Ugadi Pachadi",
          detail:
            "The first thing eaten on New Year's morning: a chutney combining six tastes — jaggery for sweetness, tamarind for sourness, neem flower for bitterness, green chilli for heat, salt, and raw mango for tang. Each stands in for a kind of experience life brings, eaten together as a reminder to meet the coming year whole, not just the good parts of it.",
          sourceUrl: "https://en.wikipedia.org/wiki/Ugadi",
        },
        {
          name: "Panchanga Sravanam",
          detail:
            "A priest or elder publicly reads the new year's almanac — rainfall, harvests, and forecasts for each zodiac sign — continuing a tradition that was purely oral before printed panchangams existed, which is why the act of listening (sravanam) still gives the ritual its name.",
        },
        {
          name: "Tirumala Brahmotsavam",
          detail:
            "A nine-day temple festival in which Lord Venkateswara is taken in procession on a sequence of vahanas. The official Tirumala schedule places Garuda Seva on the fifth day and treats it as one of the festival's most important gatherings.",
          sourceUrl: "https://www.tirumala.org/Utsavams.aspx",
        },
        {
          name: "Sankranti",
          detail:
            "A three-day harvest festival marked by muggu (rice-flour floor art) at the doorstep, Haridasu folk singers making rounds of the village at dawn, and Gangireddu — decorated bulls led house to house for blessings and small gifts.",
        },
      ],
      sourceLabel: "Read more about Ugadi",
      sourceUrl: "https://en.wikipedia.org/wiki/Ugadi",
    },
    rituals: {
      overview:
        "Two living devotional practices carry an outsized share of everyday Telugu Vaishnava life — one centred on a home shrine, the other on the state's most visited temple.",
      items: [
        {
          name: "Satyanarayana Vratham",
          detail:
            "A vow-and-worship ceremony to Vishnu performed at home, usually on a full moon or at a milestone (a housewarming, a birth, a recovery from illness). A priest leads the katha — the story of the vow's origin and what happens to those who honour or neglect it — and the ceremony ends with prasadam shared among everyone present.",
        },
        {
          name: "Venkateswara worship",
          detail:
            "Centred on Tirumala, where the deity is regarded as so continuously present that the temple performs unbroken daily rituals — from the pre-dawn Suprabhatam wake-up hymn to the night's Ekanta Seva. Pilgrims commonly undertake the barefoot climb up Tirumala hill and shave their hair as an offering (Kesa Khandanam) as an act of surrender.",
        },
        {
          name: "Annavaram Satyanarayana Swamy temple",
          detail:
            "A second major Satyanarayana shrine, on Ratnagiri hill in East Godavari district, where the vratham described above is performed at temple scale, drawing pilgrims specifically for it rather than for a different presiding deity.",
        },
      ],
    },
    journeys: {
      overview:
        "Three hill temples, three completely different reasons to make the climb — a shrine so central it needs no introduction, one so rare it holds two distinct sacred titles at once, and one that hides its own deity for all but twelve hours a year.",
      items: [
        {
          name: "Tirumala",
          detail:
            "Home to Lord Venkateswara and a major Vaishnava pilgrimage centre. During the annual Brahmotsavam, the deity is carried through Tirumala on different vahanas; the official temple account identifies the fifth-day Garuda Seva as especially significant.",
          sourceUrl: "https://www.tirumala.org/Utsavams.aspx",
        },
        {
          name: "Srisailam",
          detail:
            "The official Devasthanam identifies Mallikarjuna Swamy among the twelve Jyotirlingas and Bhramaramba Devi among the eighteen Maha Shakti Peethas. Their adjoining shrines make Srisailam important to both Shaiva and Shakta pilgrimage traditions.",
          sourceUrl: "https://www.srisailadevasthanam.org/en-in/about/the-temple/srisailam-devasthanam",
        },
        {
          name: "Simhachalam",
          detail:
            "The presiding deity, Varaha Narasimha, stays covered in sandalwood paste for 364 days a year, resembling a plain lingam. Only on Akshaya Tritiya (the Chandanotsavam festival) is the paste removed for twelve hours, giving pilgrims the one chance in the year to see the deity's actual form — a tradition the temple's own legend says began after Ramanuja once tried to remove the paste permanently.",
          sourceUrl: "https://en.wikipedia.org/wiki/Varaha_Lakshmi_Narasimha_temple,_Simhachalam",
        },
      ],
    },
    language: {
      overview:
        "Telugu carries the state's devotional life in more than conversation — its own script, its own centuries of devotional poetry, and the vocabulary of ritual and season that this whole page is written in translation of.",
      items: [
        {
          name: "Telugu script",
          detail:
            "A Brahmic writing system with distinctive rounded letterforms, used for Telugu literature, inscriptions, devotional poetry and contemporary communication.",
        },
        {
          name: "Annamacharya's padams",
          detail:
            "The 15th-century Tirumala poet-composer created thousands of Telugu devotional songs to Venkateswara. Their language links literary memory, music and continuing temple devotion.",
        },
        {
          name: "\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41 \u2014 \u201cItalian of the East\u201d",
          detail:
            "Telugu is often described as having a flowing sound because many words end in vowels. The familiar comparison is a historical nickname, not a linguistic classification.",
        },
      ],
    },
    arts: {
      overview:
        "Andhra's two best-known art forms both grew out of temple devotion rather than a stage or a court — one performed as an act of worship, the other painted as scripture you could hang on a wall.",
      items: [
        {
          name: "Kuchipudi",
          detail:
            "Named after Kuchipudi village in Krishna district, this classical dance-drama joins expressive movement, music, dialogue and sacred storytelling. The Krishna district's official cultural guide identifies the village as the form's place of origin.",
          sourceUrl: "https://krishna.ap.gov.in/cultural-tourism/",
        },
        {
          name: "Kalamkari",
          detail:
            "Practised in two distinct, GI-tagged styles that both happen to sit inside Andhra Pradesh: Srikalahasti's hand-painted style, made with a bamboo pen (kalam) mostly for mythological temple hangings, and Machilipatnam/Pedana's block-printed style, using carved wooden blocks and vegetable dyes.",
          sourceUrl: "https://en.wikipedia.org/wiki/Kalamkari",
        },
        {
          name: "Tholu Bommalata",
          detail:
            "Leather shadow-puppet theatre, performed at night with painted, translucent hide puppets held up against an oil-lit screen — traditionally used to narrate the Ramayana and Mahabharata to audiences who could not read them.",
        },
      ],
    },
    food: {
      overview:
        "Andhra food's reputation for heat is real, but its most distinctive dishes are less about chilli and more about a handful of ingredients — tamarind, roselle leaf, and rice — turned into something specific to one town or temple.",
      items: [
        {
          name: "Pulihora",
          detail:
            "Tamarind rice, tempered with mustard seed, curry leaf and peanuts — one of the standard prasadam offerings at Tirumala alongside the more famous laddu, precisely because it keeps well without refrigeration for temple-scale distribution.",
        },
        {
          name: "Pootharekulu",
          detail:
            "A wafer-thin rice-starch \"paper sweet\" made almost exclusively in Atreyapuram, a village on the Godavari that earned a Geographical Indication tag for it in 2023. Roughly 400 families in the village still make it by hand, spreading batter over an upturned clay pot to get sheets thin enough to see through.",
          sourceUrl: "https://en.wikipedia.org/wiki/Pootharekulu",
        },
        {
          name: "Gongura",
          detail:
            "Sour roselle (sorrel) leaves, most often made into a pungent pachadi — closer to the state's everyday food identity than any single festival dish, showing up on the table well outside festival season.",
        },
      ],
    },
  },
};

export function deepDiveFor(stateId: string, moduleId: keyof StateDeepDive): DeepDiveModule | undefined {
  return cultureDeepDives[stateId]?.[moduleId];
}
