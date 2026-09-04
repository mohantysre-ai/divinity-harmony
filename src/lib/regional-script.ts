import type { MantraScript } from "@/lib/transliterate";
const localeScripts: Record<string, MantraScript> = {
  or: "oriya",
  te: "telugu",
  ta: "tamil",
  bn: "bengali",
  as: "bengali",
  gu: "gujarati",
  pa: "gurmukhi",
  kn: "kannada",
  ml: "malayalam",
  hi: "devanagari",
  mr: "devanagari",
};
export function scriptFromBrowser(): MantraScript {
  const locale = (navigator.languages?.[0] || navigator.language || "en")
    .toLowerCase()
    .split("-")[0];
  return localeScripts[locale] || "devanagari";
}
export async function detectRegionalScript(): Promise<{
  script: MantraScript;
  label: string;
}> {
  if (!navigator.geolocation)
    return { script: scriptFromBrowser(), label: "browser language" };
  const position = await new Promise<GeolocationPosition>((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 86400000,
    }),
  );
  const params = new URLSearchParams({
    lat: String(position.coords.latitude),
    lon: String(position.coords.longitude),
  });
  const response = await fetch(`/api/location-preference?${params}`);
  if (!response.ok) throw new Error("Regional detection failed");
  const data = await response.json();
  return {
    script: data.script as MantraScript,
    label: data.state || data.language || "your region",
  };
}
