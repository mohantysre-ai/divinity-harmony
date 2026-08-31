import { ART_POOL } from "@/lib/sacred-text-art";

const W = "https://upload.wikimedia.org/wikipedia/commons";

const TOPIC_ART: Record<string, string> = {
  Krishna: ART_POOL[4],
  Gita: ART_POOL[1],
  Bhagavad: ART_POOL[1],
  Bhagavatam: ART_POOL[2],
  Bhakti: ART_POOL[4],
  Vedanta: ART_POOL[3],
  Ram: ART_POOL[4],
  Yoga: `${W}/5/5e/Yoga_meditation%2C_India%2C_1906.jpg`,
  Meditation: `${W}/5/5e/Yoga_meditation%2C_India%2C_1906.jpg`,
  Kirtan: ART_POOL[4],
  Bhajan: ART_POOL[0],
  Scripture: ART_POOL[10],
  Temple: ART_POOL[12],
};

export function wisdomImageCandidates(name: string, topic: string): string[] {
  const out: string[] = [];
  const haystack = `${name} ${topic}`.toLowerCase();
  for (const [key, url] of Object.entries(TOPIC_ART)) {
    if (haystack.includes(key.toLowerCase())) out.push(url);
  }
  out.push(...ART_POOL.slice(0, 8));
  return [...new Set(out)];
}

export function wisdomImageSearchQuery(name: string, topic: string): string {
  return `Hindu ${name} ${topic.split("·")[0]?.trim() || "pravachan"} India`;
}

/** Localize composite strings like "Hindi · English" or "Bhakti · Krishna Katha". */
export function localizeComposite(text: string, lc: (s: string) => string): string {
  return text
    .split("·")
    .map((segment) =>
      segment
        .split(",")
        .map((part) => lc(part.trim()))
        .join(", "),
    )
    .join(" · ");
}
