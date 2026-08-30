import { useState } from "react";
import { BookOpen, Compass, Info, Moon, Orbit, Save, Sun } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { ThemeProvider } from "@/hooks/use-theme";
import PanchangWidget from "@/components/home/PanchangWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
const grahas = [
  "Surya · vitality",
  "Chandra · mind",
  "Mangala · action",
  "Budha · intellect",
  "Guru · wisdom",
  "Shukra · harmony",
  "Shani · discipline",
  "Rahu · amplification",
  "Ketu · release",
];
const concepts = [
  ["Rashi", "The zodiac sign occupied by a graha."],
  ["Lagna", "The ascendant calculated from exact birth time and place."],
  ["Nakshatra", "One of 27 lunar mansions used in Panchang and Jyotisha."],
  ["Dasha", "A time-period framework; Vimshottari is one widely used system."],
  ["Gochara", "Current planetary transits relative to a natal reference."],
  [
    "Ayanamsha",
    "The chosen sidereal offset; calculation settings must name it.",
  ],
];
export default function VedicAstrologyPage() {
  const [details, setDetails] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("vedic:birth-profile") || "{}");
    } catch {
      return {};
    }
  });
  const save = () =>
    localStorage.setItem("vedic:birth-profile", JSON.stringify(details));
  return (
    <ThemeProvider>
      <Layout>
        <main>
          <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 p-8 text-white">
            <Orbit className="h-10 w-10 text-amber-300" />
            <h1 className="mt-3 text-4xl font-bold">
              Vedic Astrology Learning Centre
            </h1>
            <p className="mt-3 max-w-3xl text-indigo-100/75">
              Astronomical calculations and traditional interpretations must be
              distinguished. This area teaches the system without fear-based
              predictions or automatic sales remedies.
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
                  Private birth details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Field label="Date of birth">
                  <Input
                    type="date"
                    value={details.date || ""}
                    onChange={(e) =>
                      setDetails({ ...details, date: e.target.value })
                    }
                  />
                </Field>
                <Field label="Exact birth time">
                  <Input
                    type="time"
                    step="1"
                    value={details.time || ""}
                    onChange={(e) =>
                      setDetails({ ...details, time: e.target.value })
                    }
                  />
                </Field>
                <Field label="Birth place">
                  <Input
                    value={details.place || ""}
                    onChange={(e) =>
                      setDetails({ ...details, place: e.target.value })
                    }
                    placeholder="City, state, country"
                  />
                </Field>
                <Button onClick={save}>
                  <Save className="mr-2 h-4 w-4" />
                  Save privately on this device
                </Button>
                <p className="flex gap-2 text-xs text-muted-foreground">
                  <Info className="h-4 w-4 shrink-0" />A natal chart is not
                  generated until an ephemeris-grade backend and place/time-zone
                  resolver are enabled. The app will not fabricate one.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="text-indigo-600" />
                  Core calculation vocabulary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {concepts.map(([name, text]) => (
                  <div key={name} className="rounded-2xl border p-4">
                    <strong>{name}</strong>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {text}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <section className="mt-8">
            <h2 className="text-2xl font-bold">Navagraha study map</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {grahas.map((x, i) => (
                <div
                  key={x}
                  className="flex items-center gap-3 rounded-2xl border bg-card p-4"
                >
                  {i === 0 ? (
                    <Sun className="text-orange-500" />
                  ) : i === 1 ? (
                    <Moon className="text-indigo-500" />
                  ) : (
                    <Orbit className="text-violet-500" />
                  )}
                  <span>{x}</span>
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
