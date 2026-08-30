import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Compass,
  Info,
  LocateFixed,
  Moon,
  Orbit,
  Save,
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

type BirthDetails = {
  date?: string;
  time?: string;
  place?: string;
};

type DharmaProfile = {
  currentState?: string;
  homeTradition?: string;
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
  const { tk, detectedState } = useLocale();
  const { toast } = useToast();
  const [details, setDetails] = useState<BirthDetails>(() =>
    readJson(STORAGE_KEY, {}),
  );
  const [locating, setLocating] = useState(false);

  const concepts = useMemo(
    () =>
      conceptKeys.map(([nameKey, descKey]) => ({
        nameKey,
        descKey,
      })),
    [],
  );

  const save = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(details));
      toast({
        title: tk("birthDetailsSaved"),
        description: tk("birthDetailsSavedDesc"),
      });
    } catch {
      toast({
        title: tk("pleaseTryAgain"),
        variant: "destructive",
      });
    }
  }, [details, toast, tk]);

  const fillPlaceFromLocation = useCallback(
    (showToast: boolean) => {
      if (!navigator.geolocation) return;
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
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
  }, [detectedState, fillPlaceFromLocation]);

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
