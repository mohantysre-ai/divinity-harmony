import { useEffect, useMemo, useState } from "react";
import {
  BookMarked,
  ExternalLink,
  Mic2,
  Search,
  Youtube,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { ThemeProvider } from "@/hooks/use-theme";
import { useLocale } from "@/hooks/use-locale";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ResilientCoverImage from "@/components/ResilientCoverImage";
import {
  localizeComposite,
  wisdomImageCandidates,
  wisdomImageSearchQuery,
} from "@/lib/wisdom-art";

type PravachanThumbnail = {
  name: string;
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  url: string;
};

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
  const [pravachanThumbnails, setPravachanThumbnails] = useState<Record<string, PravachanThumbnail>>({});

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/pravachan-thumbnails", { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error()))
      .then((payload) => {
        const items = Array.isArray(payload.items) ? payload.items as PravachanThumbnail[] : [];
        setPravachanThumbnails(Object.fromEntries(items.map((item) => [item.name, item])));
      })
      .catch((error) => {
        if (error.name !== "AbortError") setPravachanThumbnails({});
      });
    return () => controller.abort();
  }, []);
  const talks = useMemo(
    () =>
      pravachans.filter((x) => {
        const haystack = [
          x.name,
          localizeComposite(x.language, lc),
          localizeComposite(x.topic, lc),
          x.language,
          x.topic,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q.toLowerCase());
      }),
    [q, lc],
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
              {talks.map((x) => {
                const youtubePreview = pravachanThumbnails[x.name];
                return (
                <a
                  key={x.name}
                  href={x.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col overflow-hidden rounded-3xl border bg-card shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                    <YouTubePravachanImage preview={youtubePreview} name={x.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <span className="absolute bottom-3 left-3 right-10 line-clamp-2 text-xs font-semibold leading-5 text-white/90">
                      {youtubePreview?.title || lc(x.name)}
                    </span>
                    <Youtube className="absolute left-3 top-3 h-5 w-5 fill-red-600 text-red-600 drop-shadow" />
                    <ExternalLink className="absolute right-3 top-3 h-4 w-4 text-white/80" />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-bold leading-snug">{lc(x.name)}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {localizeComposite(x.language, lc)}
                    </p>
                    <p className="mt-3 flex-1 text-sm leading-relaxed">
                      {localizeComposite(x.topic, lc)}
                    </p>
                    <Badge className="mt-4 self-start" variant="outline">
                      {tk("openScheduleLibrary")}
                    </Badge>
                  </div>
                </a>
                );
              })}
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
                  className="group flex overflow-hidden rounded-3xl border bg-card transition hover:border-orange-300 hover:shadow-lg"
                >
                  <div className="relative hidden w-28 shrink-0 overflow-hidden bg-muted sm:block">
                    <ResilientCoverImage
                      sources={wisdomImageCandidates(x.name, x.topic)}
                      searchQuery={wisdomImageSearchQuery(x.name, x.topic)}
                      objectPosition="50% 40%"
                    />
                  </div>
                  <div className="flex flex-1 items-start justify-between p-6">
                    <div>
                      <h3 className="text-xl font-bold">{lc(x.name)}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {lc(x.publisher)} · {lc(x.cadence)}
                      </p>
                      <p className="mt-4 text-sm">{localizeComposite(x.topic, lc)}</p>
                    </div>
                    <ExternalLink className="ml-3 h-4 w-4 shrink-0 text-muted-foreground" />
                  </div>
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

function YouTubePravachanImage({ preview, name }: { preview?: PravachanThumbnail; name: string }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [preview?.thumbnailUrl]);

  if (!preview?.thumbnailUrl || failed) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-red-950 via-stone-950 to-orange-950" role="img" aria-label={name}>
        <Youtube className="h-14 w-14 text-white/25" />
      </div>
    );
  }

  return (
    <img
      src={preview.thumbnailUrl}
      alt={preview.title || name}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
      onError={() => setFailed(true)}
    />
  );
}
