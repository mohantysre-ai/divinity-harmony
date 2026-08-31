import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Compass,
  Info,
  Loader2,
  LocateFixed,
  Moon,
  Orbit,
  Save,
  Sparkles,
  Sun,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { ThemeProvider } from "@/hooks/use-theme";
import { useLocale } from "@/hooks/use-locale";
import type { UiKey } from "@/lib/ui-keys";
import PanchangWidget from "@/components/home/PanchangWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { localizeBirthChart } from "@/lib/panchang-i18n";

type BirthDetails = {
  date?: string;
  time?: string;
  place?: string;
};

type DharmaProfile = {
  currentState?: string;
  homeTradition?: string;
};

type BirthChart = {
  nakshatra_index: number;
  nakshatra: string;
  rashi_index: number;
  rashi: string;
  lagna_index: number;
  lagna: string;
  tithi_index: number;
  tithi: string;
  paksha: string;
  precision: string;
};

const STORAGE_KEY = "vedic:birth-profile";
const DHARMA_KEY = "my-dharma:profile";

function readJson<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "") as T;
  } catch {
    return fallback;
  }
}

const conceptKeys = [
  ["conceptRashi", "conceptRashiDesc"],
  ["conceptLagna", "conceptLagnaDesc"],
  ["conceptNakshatraJyotisha", "conceptNakshatraJyotishaDesc"],
  ["conceptDasha", "conceptDashaDesc"],
  ["conceptGochara", "conceptGocharaDesc"],
  ["conceptAyanamsha", "conceptAyanamshaDesc"],
] as const satisfies readonly (readonly [UiKey, UiKey])[];

const grahaKeys = [
  "grahaSuryaVitality",
  "grahaChandraMind",
  "grahaMangalaAction",
  "grahaBudhaIntellect",
  "grahaGuruWisdom",
  "grahaShukraHarmony",
  "grahaShaniDiscipline",
  "grahaRahuAmplification",
  "grahaKetuRelease",
] as const satisfies readonly UiKey[];

export default function VedicAstrologyPage() {
  const { tk, locale, detectedState } = useLocale();
  const { toast } = useToast();
  const [details, setDetails] = useState<BirthDetails>(() =>
    readJson(STORAGE_KEY, {}),
  );
  const [locating, setLocating] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const [chart, setChart] = useState<BirthChart | null>(null);
  const [coords, setCoords] = useState({ lat: 20.5937, lon: 78.9629 });

  const concepts = useMemo(
    () =>
      conceptKeys.map(([nameKey, descKey]) => ({
        nameKey,
        descKey,
      })),
    [],
  );

  const localizedChart = useMemo(
    () => (chart ? localizeBirthChart(locale, chart) : null),
    [chart, locale],
  );

  const fetchChart = useCallback(async () => {
    if (!details.date?.trim()) {
      toast({ description: tk("birthChartNeedsDateTime") });
      return;
    }
    const time = details.time?.trim() || "12:00";
    setChartLoading(true);
    try {
      const params = new URLSearchParams({
        date: details.date,
        time: time.length === 5 ? `${time}:00` : time,
        lat: String(coords.lat),
        lon: String(coords.lon),
      });
      const res = await fetch(`/api/birth-chart?${params}`);
      if (!res.ok) throw new Error();
      const data = (await res.json()) as BirthChart;
      setChart(data);
    } catch {
      toast({ title: tk("pleaseTryAgain"), variant: "destructive" });
      setChart(null);
    } finally {
      setChartLoading(false);
    }
  }, [coords.lat, coords.lon, details.date, details.time, toast, tk]);

  const save = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(details));
      toast({
        title: tk("birthDetailsSaved"),
        description: tk("birthDetailsSavedDesc"),
      });
      void fetchChart();
    } catch {
      toast({
        title: tk("pleaseTryAgain"),
        variant: "destructive",
      });
    }
  }, [details, fetchChart, toast, tk]);

  const fillPlaceFromLocation = useCallback(
    (showToast: boolean) => {
      if (!navigator.geolocation) return;
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            setCoords({
              lat: pos.coords.latitude,
              lon: pos.coords.longitude,
            });
            const res = await fetch(
              `/api/location-preference?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`,
            );
            if (!res.ok) return;
            const data = (await res.json()) as {
              place?: string;
              state?: string;
            };
            const suggested =
              data.place?.trim() || data.state?.trim() || "";
            if (!suggested) return;
            setDetails((prev) => {
              if (prev.place?.trim()) return prev;
              return { ...prev, place: suggested };
            });
            if (showToast) {
              toast({ description: tk("birthDetailsAutoFilled") });
            }
          } catch {
            /* ignore */
          } finally {
            setLocating(false);
          }
        },
        () => setLocating(false),
        { timeout: 12000, maximumAge: 300000 },
      );
    },
    [toast, tk],
  );

  useEffect(() => {
    const saved = readJson<BirthDetails>(STORAGE_KEY, {});
    const dharma = readJson<DharmaProfile>(DHARMA_KEY, {});
    const profilePlace =
      dharma.currentState?.trim() || dharma.homeTradition?.trim() || "";
    const regionPlace = detectedState?.trim() || "";

    setDetails((prev) => {
      const next = { ...prev, ...saved };
      if (!next.place?.trim()) {
        next.place = profilePlace || regionPlace;
      }
      return next;
    });

    if (!saved.place?.trim()) {
      fillPlaceFromLocation(false);
    }
    if (saved.date?.trim()) {
      const time = saved.time?.trim() || "12:00";
      const params = new URLSearchParams({
        date: saved.date,
        time: time.length === 5 ? `${time}:00` : time,
        lat: String(coords.lat),
        lon: String(coords.lon),
      });
      void fetch(`/api/birth-chart?${params}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => data && setChart(data as BirthChart))
        .catch(() => undefined);
    }
  }, [detectedState, fillPlaceFromLocation, coords.lat, coords.lon]);

  return (
    <ThemeProvider>
      <Layout>
        <main>
          <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 p-8 text-white">
            <Orbit className="h-10 w-10 text-amber-300" />
            <h1 className="mt-3 text-4xl font-bold">
              {tk("vedicAstrologyCentre")}
            </h1>
            <p className="mt-3 max-w-3xl text-indigo-100/75">
              {tk("astrologyIntro")}
            </p>
          </section>
          <div className="mt-8">
            <PanchangWidget />
          </div>
          {localizedChart && (
            <Card className="mt-8 border-indigo-200/60 bg-gradient-to-br from-indigo-50/80 to-violet-50/50 dark:from-indigo-950/40 dark:to-violet-950/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="text-indigo-600" />
                  {tk("personalBirthSnapshot")}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Snapshot label={tk("moonSignAtBirth")} value={localizedChart.rashi} />
                <Snapshot label={tk("conceptNakshatraJyotisha")} value={localizedChart.nakshatra} />
                <Snapshot label={tk("lagnaAtBirth")} value={localizedChart.lagna} />
                <Snapshot label={tk("birthTithiAtBirth")} value={`${localizedChart.tithi} · ${localizedChart.paksha}`} />
              </CardContent>
              <p className="px-6 pb-6 text-xs text-muted-foreground">
                {tk("birthChartApproxNote")}
              </p>
            </Card>
          )}
          <div className="mt-8 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Compass className="text-indigo-600" />
                  {tk("privateBirthDetails")}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Field label={tk("dateOfBirth")}>
                  <Input
                    type="date"
                    value={details.date || ""}
                    onChange={(e) =>
                      setDetails({ ...details, date: e.target.value })
                    }
                  />
                </Field>
                <Field label={tk("exactBirthTime")}>
                  <Input
                    type="time"
                    step="1"
                    value={details.time || ""}
                    onChange={(e) =>
                      setDetails({ ...details, time: e.target.value })
                    }
                  />
                </Field>
                <Field label={tk("birthPlace")}>
                  <Input
                    value={details.place || ""}
                    onChange={(e) =>
                      setDetails({ ...details, place: e.target.value })
                    }
                    placeholder={tk("birthPlacePlaceholder")}
                  />
                </Field>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={locating}
                    onClick={() => fillPlaceFromLocation(true)}
                  >
                    <LocateFixed className="mr-2 h-4 w-4" />
                    {tk("useMyLocationBirth")}
                  </Button>
                  <Button type="button" onClick={save}>
                    <Save className="mr-2 h-4 w-4" />
                    {tk("savePrivatelyOnDevice")}
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={chartLoading}
                  onClick={() => void fetchChart()}
                >
                  {chartLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  {tk("generatePersonalChart")}
                </Button>
                <p className="flex gap-2 text-xs text-muted-foreground">
                  <Info className="h-4 w-4 shrink-0" />
                  {tk("natalChartDisclaimer")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="text-indigo-600" />
                  {tk("coreCalculationVocabulary")}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {concepts.map(({ nameKey, descKey }) => (
                  <div key={nameKey} className="rounded-2xl border p-4">
                    <strong>{tk(nameKey)}</strong>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {tk(descKey)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <section className="mt-8">
            <h2 className="text-2xl font-bold">{tk("navagrahaStudyMap")}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {grahaKeys.map((key, i) => (
                <div
                  key={key}
                  className="flex items-center gap-3 rounded-2xl border bg-card p-4"
                >
                  {i === 0 ? (
                    <Sun className="text-orange-500" />
                  ) : i === 1 ? (
                    <Moon className="text-indigo-500" />
                  ) : (
                    <Orbit className="text-violet-500" />
                  )}
                  <span>{tk(key)}</span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </Layout>
    </ThemeProvider>
  );
}

function Snapshot({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-card/80 p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-lg font-bold">{value}</p>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
