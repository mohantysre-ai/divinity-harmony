import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Languages,
  LocateFixed,
  Map,
  MapPin,
  Search,
  ShieldCheck,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { ThemeProvider } from "@/hooks/use-theme";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

type Priest = {
  id: number;
  city: string;
  state: string;
  languages: string[];
  services: string[];
  google_maps_url: string;
  google_search_url: string;
  sulekha_url: string;
};
type Puja = {
  name: string;
  purpose: string;
  duration: string;
  materials: string[];
  steps: string[];
  note: string;
};
const pujas: Puja[] = [
  {
    name: "Griha Pravesh & Vastu Shanti",
    purpose: "Purification and auspicious entry into a new home.",
    duration: "2–4 hours",
    materials: [
      "Kalasha, coconut and mango leaves",
      "Turmeric, kumkum, flowers and fruits",
      "Havan samagri, ghee and new cloth",
    ],
    steps: [
      "Clean the home and prepare the northeast altar.",
      "Begin with achamana, sankalpa and Ganesha invocation.",
      "Perform kalasha sthapana, punya-vachana and Vastu worship.",
      "Conduct Navagraha prayer and the lineage-specific homa.",
      "Enter at the chosen muhurta, boil milk and offer naivedya.",
      "Perform aarti, distribute prasada and complete dakshina.",
    ],
    note: "Confirm exact muhurta, mantras and fire procedure with a qualified regional priest.",
  },
  {
    name: "Satyanarayan Puja",
    purpose:
      "A Vishnu observance commonly offered for gratitude and family welfare.",
    duration: "2–3 hours",
    materials: [
      "Vishnu image, kalasha and sacred thread",
      "Banana, tulasi, pancha-amrita and flowers",
      "Prasada ingredients and five lamps",
    ],
    steps: [
      "Purify the space and state the sankalpa.",
      "Invoke Ganesha, Navagrahas and kalasha deities.",
      "Offer shodashopachara worship to Shri Satyanarayan.",
      "Read or listen to the five traditional katha chapters.",
      "Offer naivedya and perform aarti.",
      "Make the closing prayer and share prasada.",
    ],
    note: "Regional katha order and offerings vary; follow the family sampradaya where known.",
  },
  {
    name: "Navagraha Homa",
    purpose:
      "Traditional worship of the nine grahas through mantra and fire offerings.",
    duration: "3–5 hours",
    materials: [
      "Nine grains and corresponding cloth/colors",
      "Homa kunda, wood, ghee and samagri",
      "Kalashas, flowers, fruits and sesame",
    ],
    steps: [
      "Perform purification, sankalpa and Ganesha puja.",
      "Establish the Navagraha mandala and kalashas.",
      "Invoke each graha with its prescribed mantra.",
      "Offer the required ahutis into the consecrated fire.",
      "Complete purnahuti, shanti patha and aarti.",
      "Receive guidance on any associated vrata or dana.",
    ],
    note: "Homa must be led by a trained priest; mantra counts and substances should not be improvised.",
  },
  {
    name: "Shraddha & Pitru Tarpana",
    purpose: "Ancestral remembrance according to family and regional custom.",
    duration: "1–3 hours",
    materials: [
      "Black sesame, darbha grass and clean water",
      "Cooked food or prescribed pindas",
      "Simple cloth, vessel and seasonal offerings",
    ],
    steps: [
      "Confirm tithi, family tradition and eligibility with the priest.",
      "Bathe, wear clean clothes and prepare a quiet place.",
      "Make the sankalpa naming the ancestral lineage as appropriate.",
      "Offer tila-tarpana and pindas under qualified guidance.",
      "Complete guest feeding or suitable dana.",
      "Conclude with prayers for peace and family welfare.",
    ],
    note: "This is lineage-sensitive. Consult a qualified purohit and do not publish private family details.",
  },
  {
    name: "Ganapati Puja",
    purpose: "Invocation of Shri Ganesha before new beginnings and ceremonies.",
    duration: "45–90 minutes",
    materials: [
      "Ganesha murti or image",
      "Durva grass, red flowers and modaka",
      "Lamp, incense, fruits and pancha-amrita",
    ],
    steps: [
      "Prepare the altar and perform achamana and sankalpa.",
      "Invoke Ganesha and offer ceremonial bathing.",
      "Offer vastra, sandal paste, durva, flowers and incense.",
      "Chant Ganesha mantras or Atharvashirsha as guided.",
      "Offer modaka/naivedya and perform aarti.",
      "Pray for removal of obstacles and share prasada.",
    ],
    note: "A household version may be devotional; formal prana-pratishtha requires guidance.",
  },
  {
    name: "Wedding Rituals",
    purpose:
      "Vivaha samskara joining the couple through sacred vows and tradition.",
    duration: "3–6 hours",
    materials: [
      "Regional wedding altar and sacred fire items",
      "Garlands, rice, turmeric, cloth and mangala items",
      "Offerings specified by both family traditions",
    ],
    steps: [
      "Confirm sampradaya and family customs in advance.",
      "Begin with Ganesha puja and protective rites.",
      "Complete welcoming and the corresponding family rite.",
      "Perform panigrahana, agni pradakshina and saptapadi.",
      "Exchange vows and complete mangala blessings.",
      "Conclude with aashirvada and family rites.",
    ],
    note: "Procedures vary significantly; coordinate both families and the officiating priest.",
  },
];

export default function PriestDirectoryPage() {
  const [items, setItems] = useState<Priest[]>([]);
  const [q, setQ] = useState("");
  const [nearbyUrl, setNearbyUrl] = useState("");
  const [locationError, setLocationError] = useState("");
  useEffect(() => {
    void fetch("/api/priests")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => setItems(d.items || []))
      .catch(() => setItems([]));
  }, []);
  const shown = useMemo(
    () =>
      items.filter((x) =>
        `${x.city} ${x.state} ${x.languages} ${x.services}`
          .toLowerCase()
          .includes(q.toLowerCase()),
      ),
    [items, q],
  );
  const locate = () => {
    setLocationError("");
    if (!navigator.geolocation) {
      setLocationError("Location is unavailable in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const query = encodeURIComponent(
          `pandit priest puja near ${p.coords.latitude.toFixed(5)},${p.coords.longitude.toFixed(5)}`,
        );
        setNearbyUrl(
          `https://www.google.com/maps/search/?api=1&query=${query}`,
        );
      },
      () => setLocationError("Allow location access to search near you."),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 3600000 },
    );
  };
  return (
    <ThemeProvider>
      <Layout>
        <main>
          <section className="border-b bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 py-14 dark:from-orange-950/30 dark:via-background dark:to-rose-950/20">
            <div className="container mx-auto px-4">
              <p className="text-sm font-semibold uppercase tracking-[.2em] text-orange-700">
                Regional ritual guidance
              </p>
              <h1 className="mt-2 max-w-3xl text-4xl font-bold md:text-5xl">
                Find a priest and understand the puja before you book
              </h1>
              <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
                Search live local directories for current phone numbers, reviews
                and availability. Divinity Harmony does not copy unverified
                personal numbers.
              </p>
              <div className="mt-7 flex max-w-2xl flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="h-11 bg-background pl-9"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search city, language, or puja"
                  />
                </div>
                <Button onClick={locate}>
                  <LocateFixed className="mr-2 h-4 w-4" />
                  Find near me
                </Button>
              </div>
              {nearbyUrl && (
                <a
                  href={nearbyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex text-sm font-semibold text-orange-700 hover:underline"
                >
                  Open priests near my current location
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              )}
              {locationError && (
                <p className="mt-2 text-sm text-destructive">{locationError}</p>
              )}
            </div>
          </section>
          <div className="container mx-auto px-4 py-10">
            <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Links open live Google Maps or Sulekha results so you can verify
              reviews and contact details.
            </div>
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {shown.map((x, i) => (
                <article
                  key={x.id}
                  style={{ animationDelay: `${i * 55}ms` }}
                  className="group animate-fade-in rounded-3xl border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-orange-300 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 dark:bg-orange-950/50">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Public directory
                    </span>
                  </div>
                  <h2 className="mt-4 text-xl font-bold">
                    {x.city} Priest Search
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {x.state}
                  </p>
                  <p className="mt-3 flex items-start text-sm text-muted-foreground">
                    <Languages className="mr-2 mt-0.5 h-4 w-4 shrink-0" />
                    {x.languages.join(", ")}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {x.services.map((s) => (
                      <Badge key={s} variant="secondary">
                        {s}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-2">
                    <a
                      href={x.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-orange-700"
                    >
                      <Map className="mr-2 h-4 w-4" />
                      Google Maps
                    </a>
                    <a
                      href={x.sulekha_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-xl border px-3 py-2.5 text-sm font-semibold hover:bg-muted"
                    >
                      Sulekha
                      <ExternalLink className="ml-2 h-3.5 w-3.5" />
                    </a>
                  </div>
                  <a
                    href={x.google_search_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex text-xs font-medium text-orange-700 hover:underline"
                  >
                    Search current contact details
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </article>
              ))}
            </section>
            {!shown.length && (
              <div className="rounded-3xl border border-dashed p-10 text-center text-muted-foreground">
                No directory matches that search. Try a nearby city or puja
                name.
              </div>
            )}
            <section className="mt-16">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-orange-100 p-3 text-orange-700">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[.18em] text-orange-700">
                    Puja Vidhi Library
                  </p>
                  <h2 className="text-3xl font-bold">
                    Materials, steps and completion
                  </h2>
                </div>
              </div>
              <p className="mt-3 max-w-3xl text-muted-foreground">
                Prepare properly and ask the right questions. Fire rites,
                samskaras, muhurta and lineage-specific procedures still require
                a qualified priest.
              </p>
              <Accordion
                type="single"
                collapsible
                className="mt-7 grid gap-4 lg:grid-cols-2"
              >
                {pujas.map((p) => (
                  <AccordionItem
                    key={p.name}
                    value={p.name}
                    className="rounded-2xl border bg-card px-5 shadow-sm"
                  >
                    <AccordionTrigger className="text-left hover:no-underline">
                      <div>
                        <span className="text-lg font-bold">{p.name}</span>
                        <span className="mt-1 block text-xs font-normal text-muted-foreground">
                          Typical duration: {p.duration}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="leading-6 text-muted-foreground">
                        {p.purpose}
                      </p>
                      <h3 className="mt-5 font-semibold">Prepare</h3>
                      <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                        {p.materials.map((m) => (
                          <li key={m} className="flex gap-2">
                            <span className="text-orange-600">◆</span>
                            {m}
                          </li>
                        ))}
                      </ul>
                      <h3 className="mt-5 font-semibold">
                        Traditional sequence
                      </h3>
                      <ol className="mt-2 space-y-3 text-sm text-muted-foreground">
                        {p.steps.map((s, i) => (
                          <li key={s} className="flex gap-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700 dark:bg-orange-950/50">
                              {i + 1}
                            </span>
                            <span className="pt-0.5">{s}</span>
                          </li>
                        ))}
                      </ol>
                      <p className="mt-5 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                        {p.note}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </div>
        </main>
      </Layout>
    </ThemeProvider>
  );
}
