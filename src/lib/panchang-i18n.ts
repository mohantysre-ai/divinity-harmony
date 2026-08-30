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
