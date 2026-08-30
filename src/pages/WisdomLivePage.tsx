import { useMemo, useState } from "react";
import {
  BookMarked,
  CalendarClock,
  ExternalLink,
  Mic2,
  Search,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { ThemeProvider } from "@/hooks/use-theme";
import { useLocale } from "@/hooks/use-locale";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const pravachans = [
  {
    name: "Premanand Ji Maharaj",
    language: "Hindi",
    topic: "Bhakti · Krishna Katha · Vrindavan",
    url: "https://www.youtube.com/@BhajanMarg/streams",
  },
  {
    name: "Aniruddhacharya Ji",
    language: "Hindi",
    topic: "Bhagavad Gita · Ram Katha · Bhakti",
    url: "https://www.youtube.com/@Aniruddhacharyaji/streams",
  },
  {
    name: "Sanatan Bhakti TV",
    language: "Hindi",
    topic: "Bhajan · Kirtan · Sanatana Dharma",
    url: "https://www.youtube.com/@SanatanBhaktiTV",
  },
  {
    name: "Swami Mukundananda",
    language: "Hindi · English",
    topic: "Bhagavad Gita · Vedanta · practical spirituality",
    url: "https://www.youtube.com/@SwamiMukundananda",
  },
  {
    name: "Chinmaya Mission",
    language: "Multiple languages",
    topic: "Vedanta · Bhagavad Gita · meditation",
    url: "https://www.chinmayamission.com/global/Video",
  },
  {
    name: "ISKCON Bangalore Daily Lectures",
    language: "English · Hindi · Kannada",
    topic: "Srimad Bhagavatam · Bhakti",
    url: "https://www.iskconbangalore.org/daily-lectures/",
  },
  {
    name: "ISKCON Mumbai Kirtan & Lectures",
    language: "English · Hindi",
    topic: "Bhagavatam · Chaitanya Charitamrita · Kirtan",
    url: "https://www.iskconmumbai.com/kirtan-lectures",
  },
  {
    name: "ISKCON Vrindavan Kirtan & Lectures",
    language: "Hindi · English",
    topic: "Bhagavatam · Krishna Katha · Kirtan",
    url: "https://iskconvrindavan.com/kirtan-lectures",
  },
  {
    name: "Chinmaya Channel",
    language: "Multiple languages",
    topic: "Gita · Upanishads · practical Vedanta",
    url: "https://www.youtube.com/@ChinmayaChannel",
  },
  {
    name: "Sri Sri Ravi Shankar",
    language: "Hindi · English",
    topic: "Meditation · wisdom · cultural talks",
    url: "https://www.youtube.com/@artofliving-official/streams",
  },
  {
    name: "Sadhguru",
    language: "English · Tamil · Hindi",
    topic: "Yoga · inner engineering · cultural wisdom",
    url: "https://www.youtube.com/@Sadhguru",
  },
];
const reading = [
  {
    name: "Kalyan",
    publisher: "Gita Press",
    cadence: "Monthly",
    topic: "Sanatana Dharma · saints · scripture",
    url: "https://gitapress.org/kalyan",
  },
  {
    name: "Hinduism Today",
    publisher: "Himalayan Academy",
    cadence: "Quarterly",
    topic: "Culture · temples · Hindu life worldwide",
    url: "https://www.hinduismtoday.com/",
  },
  {
    name: "Gita Press E-books",
    publisher: "Gita Press",
    cadence: "Library",
    topic: "Scriptures · commentaries · devotional books",
    url: "https://gitapress.org/",
  },
  {
    name: "Chinmaya Mission Resources",
    publisher: "Central Chinmaya Mission Trust",
    cadence: "Updated regularly",
    topic: "Vedanta · Gita · spiritual practice",
    url: "https://www.chinmayamission.com/global/Video",
  },
];

export default function WisdomLivePage() {
  const { tk, lc } = useLocale();
  const [q, setQ] = useState("");
  const talks = useMemo(
    () =>
      pravachans.filter((x) =>
        `${x.name} ${x.language} ${x.topic}`
          .toLowerCase()
          .includes(q.toLowerCase()),
      ),
    [q],
  );
  return (
    <ThemeProvider>
      <Layout>
        <main>
          <section className="rounded-[2rem] bg-gradient-to-br from-violet-950 via-red-950 to-orange-900 p-8 text-white">
            <p className="text-xs font-bold uppercase tracking-[.22em] text-amber-200">
              {tk("listenWithContext")}
            </p>
            <h1 className="mt-2 text-4xl font-bold">{tk("pravachanCulturalReading")}</h1>
            <p className="mt-3 max-w-3xl text-orange-100/75">{tk("publisherCopyrightNote")}</p>
            <div className="relative mt-6 max-w-xl">
              <Search className="absolute left-3 top-3 h-4 w-4 text-stone-500" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="border-white/20 bg-white pl-9 text-stone-900"
                placeholder={tk("searchCulturePlaceholder")}
              />
            </div>
          </section>
          <section className="mt-10">
            <div className="flex items-center gap-3">
              <Mic2 className="h-7 w-7 text-orange-600" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-orange-700">
                  {tk("officialSources")}
                </p>
                <h2 className="text-3xl font-bold">{tk("pravachanGuide")}</h2>
              </div>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {talks.map((x) => (
                <a
                  key={x.name}
                  href={x.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-3xl border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl"
                >
                  <div className="flex justify-between">
                    <CalendarClock className="h-6 w-6 text-orange-600" />
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{x.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{lc(x.language)}</p>
                  <p className="mt-4 text-sm">{lc(x.topic)}</p>
                  <Badge className="mt-4" variant="outline">
                    {tk("openScheduleLibrary")}
                  </Badge>
                </a>
              ))}
            </div>
          </section>
          <section className="mt-14">
            <div className="flex items-center gap-3">
              <BookMarked className="h-7 w-7 text-orange-600" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-orange-700">
                  {tk("publisherDirect")}
                </p>
                <h2 className="text-3xl font-bold">{tk("dharmicReadingRoom")}</h2>
              </div>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {reading.map((x) => (
                <a
                  key={x.name}
                  href={x.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start justify-between rounded-3xl border bg-card p-6 transition hover:border-orange-300 hover:shadow-lg"
                >
                  <div>
                    <h3 className="text-xl font-bold">{x.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {x.publisher} · {lc(x.cadence)}
                    </p>
                    <p className="mt-4 text-sm">{lc(x.topic)}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 shrink-0" />
                </a>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">{tk("publisherCopyrightNote")}</p>
          </section>
        </main>
      </Layout>
    </ThemeProvider>
  );
}
