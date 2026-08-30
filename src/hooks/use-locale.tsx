import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRegionalUi } from "@/hooks/use-regional-ui";
import { translateUiText } from "@/lib/ui-translations";

export type AppLocale =
  | "en"
  | "hi"
  | "bn"
  | "gu"
  | "mr"
  | "ta"
  | "te"
  | "ml"
  | "kn"
  | "or"
  | "pa"
  | "as";
export const localeOptions: { id: AppLocale; label: string }[] = [
  { id: "en", label: "English" },
  { id: "hi", label: "हिन्दी" },
  { id: "bn", label: "বাংলা" },
  { id: "gu", label: "ગુજરાતી" },
  { id: "mr", label: "मराठी" },
  { id: "ta", label: "தமிழ்" },
  { id: "te", label: "తెలుగు" },
  { id: "ml", label: "മലയാളം" },
  { id: "kn", label: "ಕನ್ನಡ" },
  { id: "or", label: "ଓଡ଼ିଆ" },
  { id: "pa", label: "ਪੰਜਾਬੀ" },
  { id: "as", label: "অসমীয়া" },
];

export const profileLanguageToLocale: Record<string, AppLocale> = {
  english: "en",
  hindi: "hi",
  bengali: "bn",
  gujarati: "gu",
  marathi: "mr",
  tamil: "ta",
  telugu: "te",
  malayalam: "ml",
  kannada: "kn",
  odia: "or",
  punjabi: "pa",
  assamese: "as",
  sanskrit: "en",
};

export const localeToProfileLanguage: Record<AppLocale, string> = {
  en: "english",
  hi: "hindi",
  bn: "bengali",
  gu: "gujarati",
  mr: "marathi",
  ta: "tamil",
  te: "telugu",
  ml: "malayalam",
  kn: "kannada",
  or: "odia",
  pa: "punjabi",
  as: "assamese",
};
const copy: Partial<Record<AppLocale, Record<string, string>>> & {
  en: Record<string, string>;
} = {
  en: {
    home: "Home",
    mantras: "Mantras",
    darshan: "Live Darshan",
    scriptures: "Scriptures",
    deities: "Deities",
    temples: "Temples",
    priests: "Priests",
    settings: "Settings",
    login: "Login",
    language: "Language",
    library: "Mantra Library",
    matching: "matching prayers",
    search: "Search Shiva, Krishna, peace…",
    all: "All",
    sacred: "Sacred Mantras",
    living: "A living devotional library",
    explore:
      "Explore {count}+ prayers, Vedic hymns and stotras. Search by deity, text or intention.",
    notFound: "No mantra found. Try another spelling or deity.",
  },
};
type LocaleValue = {
  locale: AppLocale;
  setLocale: (value: AppLocale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  ui: (text: string) => string;
  detectedState: string;
  elderMode: boolean;
  setElderMode: (value: boolean) => void;
};
const LocaleContext = createContext<LocaleValue | undefined>(undefined);
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>(() =>
    localeOptions.some((x) => x.id === localStorage.getItem("app:locale"))
      ? (localStorage.getItem("app:locale") as AppLocale)
      : "en",
  );
  const [detectedState, setDetectedState] = useState("");
  useRegionalUi(locale);
  const [elderMode, setElderModeState] = useState(
    () => localStorage.getItem("app:elder-mode") === "true",
  );
  const setElderMode = (value: boolean) => {
    setElderModeState(value);
    localStorage.setItem("app:elder-mode", String(value));
  };
  const setLocale = (value: AppLocale) => {
    setLocaleState(value);
    localStorage.setItem("app:locale", value);
    localStorage.setItem("app:locale-manual", "true");
  };
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.setAttribute("data-app-locale", locale);
  }, [locale]);
  useEffect(() => {
    document.documentElement.classList.toggle("elder-mode", elderMode);
  }, [elderMode]);
  useEffect(() => {
    if (
      localStorage.getItem("app:locale-manual") === "true" ||
      !navigator.geolocation
    )
      return;
    navigator.geolocation.getCurrentPosition(
      async (p) => {
        try {
          const params = new URLSearchParams({
            lat: String(p.coords.latitude),
            lon: String(p.coords.longitude),
          });
          const response = await fetch(`/api/location-preference?${params}`);
          if (!response.ok) return;
          const data = await response.json();
          setDetectedState(data.state || "");
          if (localeOptions.some((x) => x.id === data.locale))
            setLocaleState(data.locale as AppLocale);
        } catch {
          /* English remains the safe fallback. */
        }
      },
      () => undefined,
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 86400000 },
    );
  }, []);
  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: (key: string, vars: Record<string, string | number> = {}) => {
        const english = Object.entries(vars).reduce(
          (text, [name, value]) => text.replace(`{${name}}`, String(value)),
          copy.en[key] || key,
        );
        return translateUiText(english, locale);
      },
      ui: (text: string) => translateUiText(text, locale),
      detectedState,
      elderMode,
      setElderMode,
    }),
    [locale, detectedState, elderMode],
  );
  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}
export function useLocale() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error("useLocale must be inside LocaleProvider");
  return value;
}
