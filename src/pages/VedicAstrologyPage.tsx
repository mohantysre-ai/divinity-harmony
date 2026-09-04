import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Compass,
  Info,
  Loader2,
  LocateFixed,
  Save,
  Sparkles,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { ThemeProvider } from "@/hooks/use-theme";
import { useLocale } from "@/hooks/use-locale";
import type { UiKey } from "@/lib/ui-keys";
import PanchangWidget from "@/components/home/PanchangWidget";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { localizeBirthChart, localizePlanetTable } from "@/lib/panchang-i18n";

type BirthDetails = {
  date?: string;
  time?: string;
  place?: string;
};

type DharmaProfile = {
  currentState?: string;
  homeTradition?: string;
};

type PlanetRow = {
  name: string;
  rashi: string;
  rashi_index: number;
  nakshatra: string;
  nakshatra_index: number;
  pada: number;
  house: number;
  retrograde: boolean;
};

type BirthChart = {
  nakshatra_index: number;
  nakshatra: string;
  nakshatra_pada?: number;
  rashi_index: number;
  rashi: string;
  sun_rashi?: string;
  sun_rashi_index?: number;
  lagna_index: number;
  lagna: string;
  tithi_index: number;
  tithi: string;
  yoga?: string;
  yoga_index?: number;
  karana?: string;
  paksha: string;
  precision: string;
  engine?: string;
  timezone?: string;
  ayanamsha?: string;
  latitude?: number;
  longitude?: number;
  planets?: PlanetRow[];
  dasha_at_birth?: {
    mahadasha: string;
    balance_years: number;
    balance_days: number;
  };
  dasha_current?: {
    current_mahadasha: string;
    years_remaining: number;
  };
};

const STORAGE_KEY = "vedic:birth-profile";
const DHARMA_KEY = "my-dharma:profile";

const GRAHA_LABEL_KEYS: Partial<Record<string, UiKey>> = {
  Sun: "grahaSuryaVitality",
  Moon: "grahaChandraMind",
  Mars: "grahaMangalaAction",
  Mercury: "grahaBudhaIntellect",
  Jupiter: "grahaGuruWisdom",
  Venus: "grahaShukraHarmony",
  Saturn: "grahaShaniDiscipline",
  Rahu: "grahaRahuAmplification",
  Ketu: "grahaKetuRelease",
};

function readJson<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "") as T;
  } catch {
    return fallback;
  }
}

function grahaLabel(name: string, tk: (key: UiKey) => string): string {
  const key = GRAHA_LABEL_KEYS[name];
  if (!key) return name;
  return tk(key).split(" · ")[0] ?? name;
}

function chartParams(
  details: BirthDetails,
  coords: { lat: number; lon: number },
): URLSearchParams | null {
  if (!details.date?.trim()) return null;
  const time = details.time?.trim() || "12:00";
  const params = new URLSearchParams({
    date: details.date,
    time: time.length === 5 ? `${time}:00` : time,
    lat: String(coords.lat),
    lon: String(coords.lon),
  });
  if (details.place?.trim()) {
    params.set("place", details.place.trim());
  }
  return params;
}

export default function VedicAstrologyPage() {
  const { tk, locale, detectedState } = useLocale();
  const { toast } = useToast();
  const [details, setDetails] = useState<BirthDetails>(() =>
    readJson(STORAGE_KEY, {}),
  );
  const [locating, setLocating] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const [chart, setChart] = useState<BirthChart | null>(null);
  const [chartError, setChartError] = useState<string | null>(null);
  const [coords, setCoords] = useState({ lat: 20.5937, lon: 78.9629 });
  const [geoReady, setGeoReady] = useState(false);
  const autoFetchedRef = useRef(false);
  const coordsRef = useRef(coords);

  const localizedChart = useMemo(
    () => (chart ? localizeBirthChart(locale, chart) : null),
    [chart, locale],
  );

  const localizedPlanets = useMemo(
    () =>
      chart?.planets?.length
        ? localizePlanetTable(locale, chart.planets)
        : null,
    [chart, locale],
  );

  const fetchChart = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!details.date?.trim()) {
        if (!opts?.silent) {
          toast({ description: tk("birthChartNeedsDateTime") });
        }
        return;
      }
      if (!details.place?.trim()) {
        if (!opts?.silent) {
          toast({ description: tk("kundliPlaceRequired") });
        }
        return;
      }

      const params = chartParams(details, coords);
      if (!params) return;

      setChartLoading(true);
      setChartError(null);
      try {
        const res = await fetch(`/api/birth-chart?${params}`);
        const data = (await res.json()) as BirthChart & { error?: string };
        if (!res.ok) {
          throw new Error(data.error || tk("pleaseTryAgain"));
        }
        setChart(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : tk("pleaseTryAgain");
        setChart(null);
        setChartError(message);
        if (!opts?.silent) {
          toast({ title: message, variant: "destructive" });
        }
      } finally {
        setChartLoading(false);
      }
    },
    [coords, details, toast, tk],
  );

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
      if (!navigator.geolocation) {
        setGeoReady(true);
        return;
      }
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
            setGeoReady(true);
          }
        },
        () => {
          setLocating(false);
          setGeoReady(true);
        },
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
    } else {
      setGeoReady(true);
    }
  }, [detectedState, fillPlaceFromLocation]);

  useEffect(() => {
    if (!geoReady || autoFetchedRef.current) return;
    if (!details.date?.trim() || !details.place?.trim()) return;
    autoFetchedRef.current = true;
    void fetchChart({ silent: true });
  }, [details.date, details.place, fetchChart, geoReady]);

  useEffect(() => {
    if (!geoReady || !details.date?.trim() || !details.place?.trim()) return;
    const prev = coordsRef.current;
    if (prev.lat === coords.lat && prev.lon === coords.lon) return;
    coordsRef.current = { lat: coords.lat, lon: coords.lon };
    if (autoFetchedRef.current) {
      void fetchChart({ silent: true });
    }
  }, [coords.lat, coords.lon, details.date, details.place, fetchChart, geoReady]);

  return (
    <ThemeProvider>
      <Layout>
        <main>
          <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 p-8 text-white">
            <Sparkles className="h-10 w-10 text-amber-300" />
            <h1 className="mt-3 text-4xl font-bold">
              {tk("vedicAstrologyCentre")}
            </h1>
            <p className="mt-3 max-w-3xl text-indigo-100/75">
              {tk("astrologyIntro")}
            </p>
          </section>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,.95fr)_minmax(0,1.05fr)]">
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
                  size="lg"
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

            <KundliResultsPanel
              chart={chart}
              chartError={chartError}
              chartLoading={chartLoading}
              localizedChart={localizedChart}
              localizedPlanets={localizedPlanets}
              tk={tk}
            />
          </div>

          <div className="mt-8">
            <PanchangWidget />
          </div>
        </main>
      </Layout>
    </ThemeProvider>
  );
}

function KundliResultsPanel({
  chart,
  chartError,
  chartLoading,
  localizedChart,
  localizedPlanets,
  tk,
}: {
  chart: BirthChart | null;
  chartError: string | null;
  chartLoading: boolean;
  localizedChart: ReturnType<typeof localizeBirthChart> | null;
  localizedPlanets: ReturnType<typeof localizePlanetTable> | null;
  tk: (key: UiKey) => string;
}) {
  if (chartLoading) {
    return (
      <Card className="flex min-h-[420px] items-center justify-center border-indigo-200/60">
        <div className="flex flex-col items-center gap-3 p-8 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
          <p className="text-sm text-muted-foreground">
            {tk("generatePersonalChart")}…
          </p>
        </div>
      </Card>
    );
  }

  if (!chart || !localizedChart) {
    return (
      <Card className="flex min-h-[420px] items-center justify-center border-dashed">
        <div className="max-w-sm p-8 text-center">
          <Sparkles className="mx-auto h-10 w-10 text-indigo-400" />
          <h2 className="mt-4 text-xl font-bold">{tk("kundliResultsTitle")}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {chartError ?? tk("kundliEmptyState")}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-indigo-200/60 bg-gradient-to-br from-indigo-50/80 to-violet-50/50 dark:from-indigo-950/40 dark:to-violet-950/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-indigo-600" />
          {tk("kundliResultsTitle")}
        </CardTitle>
        {chart.timezone && (
          <p className="text-xs text-muted-foreground">
            {chart.timezone}
            {chart.ayanamsha ? ` · ${chart.ayanamsha}` : ""}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <Accordion
          type="multiple"
          defaultValue={["summary", "planets", "dasha"]}
          className="w-full"
        >
          <AccordionItem value="summary">
            <AccordionTrigger>{tk("kundliSummarySection")}</AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <Snapshot label={tk("lagnaAtBirth")} value={localizedChart.lagna} />
                <Snapshot
                  label={tk("moonSignAtBirth")}
                  value={localizedChart.rashi}
                />
                {localizedChart.sun_rashi && (
                  <Snapshot
                    label={tk("sunSignAtBirth")}
                    value={localizedChart.sun_rashi}
                  />
                )}
                <Snapshot
                  label={tk("conceptNakshatraJyotisha")}
                  value={
                    chart.nakshatra_pada
                      ? `${localizedChart.nakshatra} · ${chart.nakshatra_pada}`
                      : localizedChart.nakshatra
                  }
                />
                <Snapshot
                  label={tk("birthTithiAtBirth")}
                  value={`${localizedChart.tithi} · ${localizedChart.paksha}`}
                />
                {localizedChart.yoga && (
                  <Snapshot
                    label={tk("birthYogaAtBirth")}
                    value={localizedChart.yoga}
                  />
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {localizedPlanets && localizedPlanets.length > 0 && (
            <AccordionItem value="planets">
              <AccordionTrigger>{tk("planetPositionsTable")}</AccordionTrigger>
              <AccordionContent className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="py-2 pr-3">{tk("grahaColumn")}</th>
                      <th className="py-2 pr-3">{tk("conceptRashi")}</th>
                      <th className="py-2 pr-3">
                        {tk("conceptNakshatraJyotisha")}
                      </th>
                      <th className="py-2 pr-3">{tk("houseColumn")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localizedPlanets.map((row) => (
                      <tr
                        key={row.name}
                        className="border-b border-border/50"
                      >
                        <td className="py-2 pr-3 font-medium">
                          {grahaLabel(row.name, tk)}
                          {row.retrograde ? (
                            <span className="ml-1 text-xs text-amber-600">
                              ({tk("retrogradeLabel").charAt(0)})
                            </span>
                          ) : null}
                        </td>
                        <td className="py-2 pr-3">{row.rashi}</td>
                        <td className="py-2 pr-3">
                          {row.nakshatra} · {row.pada}
                        </td>
                        <td className="py-2 pr-3">{row.house}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </AccordionContent>
            </AccordionItem>
          )}

          {(chart.dasha_at_birth || chart.dasha_current) && (
            <AccordionItem value="dasha">
              <AccordionTrigger>{tk("kundliDashaSection")}</AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {chart.dasha_at_birth && (
                    <>
                      <Snapshot
                        label={tk("mahadashaAtBirth")}
                        value={grahaLabel(
                          chart.dasha_at_birth.mahadasha,
                          tk,
                        )}
                      />
                      <Snapshot
                        label={tk("dashaBalanceAtBirth")}
                        value={`${chart.dasha_at_birth.balance_years.toFixed(2)} ${tk("yearsRemaining").toLowerCase()}`}
                      />
                    </>
                  )}
                  {chart.dasha_current && (
                    <>
                      <Snapshot
                        label={tk("currentMahadasha")}
                        value={grahaLabel(
                          chart.dasha_current.current_mahadasha,
                          tk,
                        )}
                      />
                      <Snapshot
                        label={tk("yearsRemaining")}
                        value={chart.dasha_current.years_remaining.toFixed(2)}
                      />
                    </>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>

        <p className="mt-4 text-xs text-muted-foreground">
          {chart.engine === "swisseph"
            ? tk("birthChartEphemerisNote")
            : chart.precision}
        </p>
      </CardContent>
    </Card>
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
