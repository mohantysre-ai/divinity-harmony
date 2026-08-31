import type { AppLocale } from "@/hooks/use-locale";
import terms from "@/lib/panchang-terms.json";

type PanchangTermPack = (typeof terms)["en"];

type PanchangData = {
  tithi_index: number;
  nakshatra_index: number;
  yoga_index?: number;
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  moon_phase: string;
  paksha: string;
  weekday: string;
};

const YOGA_EN = terms.en.yogas;

function packFor(locale: AppLocale): PanchangTermPack {
  if (locale === "en") return terms.en;
  return (terms as Record<string, PanchangTermPack>)[locale] ?? terms.en;
}

export function localizePanchang(locale: AppLocale, data: PanchangData) {
  const pack = packFor(locale);
  const yogaIndex =
    data.yoga_index ??
    Math.max(0, YOGA_EN.indexOf(data.yoga));
  const karanaIndex = data.tithi_index % 7;

  return {
    tithi: pack.tithis[data.tithi_index] ?? data.tithi,
    nakshatra: pack.nakshatras[data.nakshatra_index] ?? data.nakshatra,
    yoga: pack.yogas[yogaIndex] ?? data.yoga,
    karana: pack.karanas[karanaIndex] ?? data.karana,
    moon_phase: pack.moonPhases[data.moon_phase] ?? data.moon_phase,
    paksha: pack.paksha[data.paksha] ?? data.paksha,
    weekday: pack.weekdays[data.weekday] ?? data.weekday,
  };
}

export function formatPanchangDate(
  locale: AppLocale,
  dateIso: string,
): string {
  const date = new Date(`${dateIso}T12:00:00`);
  return date.toLocaleDateString(
    locale === "en" ? undefined : `${locale}-IN`,
    { day: "numeric", month: "long", year: "numeric" },
  );
}

const RASHIS_EN = [
  "Mesha",
  "Vrishabha",
  "Mithuna",
  "Karka",
  "Simha",
  "Kanya",
  "Tula",
  "Vrishchika",
  "Dhanu",
  "Makara",
  "Kumbha",
  "Meena",
];

const RASHIS_BY_LOCALE: Partial<Record<AppLocale, string[]>> = {
  hi: [
    "मेष",
    "वृषभ",
    "मिथुन",
    "कर्क",
    "सिंह",
    "कन्या",
    "तुला",
    "वृश्चिक",
    "धनु",
    "मकर",
    "कुम्भ",
    "मीन",
  ],
  te: [
    "మేషం",
    "వృషభం",
    "మిథునం",
    "కర్కాటకం",
    "సిమ్మం",
    "కన్యా",
    "తులా",
    "వృశ్చికం",
    "ధనుస్సు",
    "మకరం",
    "కుంభం",
    "మీనం",
  ],
  ta: [
    "மேஷம்",
    "ரிஷபம்",
    "மிதுனம்",
    "கர்க்கடம்",
    "சிம்மம்",
    "கன்னி",
    "துலாம்",
    "விருச்சிகம்",
    "தனுசு",
    "மகரம்",
    "கும்பம்",
    "மீனம்",
  ],
  kn: [
    "ಮೇಷ",
    "ವೃಷಭ",
    "ಮಿಥುನ",
    "ಕರ್ಕಾಟಕ",
    "ಸಿಂಹ",
    "ಕನ್ಯಾ",
    "ತುಲಾ",
    "ವೃಶ್ಚಿಕ",
    "ಧನು",
    "ಮಕರ",
    "ಕುಂಭ",
    "ಮೀನ",
  ],
  ml: [
    "മേഷം",
    "വൃഷഭം",
    "മിഥുനം",
    "കർക്കടകം",
    "സിംഹം",
    "കന്യ",
    "തുലാ",
    "വൃശ്ചികം",
    "ധനു",
    "മകരം",
    "കുംഭം",
    "മീനം",
  ],
  bn: [
    "মেষ",
    "বৃষ",
    "মিথুন",
    "কর্কট",
    "সিংহ",
    "কন্যা",
    "তুলা",
    "বৃশ্চিক",
    "ধনু",
    "মকর",
    "কুম্ভ",
    "মীন",
  ],
  gu: [
    "મેષ",
    "વૃષભ",
    "મિથુન",
    "કર્ક",
    "સિંહ",
    "કન્યા",
    "તુલા",
    "વૃશ્ચિક",
    "ધનુ",
    "મકર",
    "કુંભ",
    "મીન",
  ],
  mr: [
    "मेष",
    "वृषभ",
    "मिथुन",
    "कर्क",
    "सिंह",
    "कन्या",
    "तुला",
    "वृश्चिक",
    "धनु",
    "मकर",
    "कुम्भ",
    "मीन",
  ],
  or: [
    "ମେଷ",
    "ବୃଷ",
    "ମିଥୁନ",
    "କର୍କଟ",
    "ସିଂହ",
    "କନ୍ୟା",
    "ତୁଳା",
    "ବୃଶ୍ଚିକ",
    "ଧନୁ",
    "ମକର",
    "କୁମ୍ଭ",
    "ମୀନ",
  ],
  pa: [
    "ਮੇਖ",
    "ਵ੍ਰਿਸ਼ਭ",
    "ਮਿਥੁਨ",
    "ਕਰਕ",
    "ਸਿੰਘ",
    "ਕੰਨਿਆ",
    "ਤੁਲਾ",
    "ਵ੍ਰਿਸ਼ਚਿਕ",
    "ਧਨੁ",
    "ਮਕਰ",
    "ਕੁੰਭ",
    "ਮੀਨ",
  ],
  as: [
    "মেষ",
    "বৃষ",
    "মিথুন",
    "কৰ্কট",
    "সিংহ",
    "কন্যা",
    "তুলা",
    "বৃশ্চিক",
    "ধনু",
    "মকৰ",
    "কুম্ভ",
    "মীন",
  ],
};

export function localizeRashi(locale: AppLocale, index: number, fallback: string): string {
  const list = RASHIS_BY_LOCALE[locale] ?? RASHIS_EN;
  return list[index] ?? fallback;
}

type BirthChartData = {
  nakshatra_index: number;
  nakshatra: string;
  rashi_index: number;
  rashi: string;
  lagna_index: number;
  lagna: string;
  tithi_index: number;
  tithi: string;
  paksha: string;
};

export function localizeBirthChart(locale: AppLocale, data: BirthChartData) {
  const panchang = localizePanchang(locale, {
    tithi_index: data.tithi_index,
    nakshatra_index: data.nakshatra_index,
    tithi: data.tithi,
    nakshatra: data.nakshatra,
    yoga: "",
    karana: "",
    moon_phase: "",
    paksha: data.paksha,
    weekday: "",
  });
  return {
    nakshatra: panchang.nakshatra,
    tithi: panchang.tithi,
    paksha: panchang.paksha,
    rashi: localizeRashi(locale, data.rashi_index, data.rashi),
    lagna: localizeRashi(locale, data.lagna_index, data.lagna),
  };
}
