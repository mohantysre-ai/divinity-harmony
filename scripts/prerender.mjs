import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const routes = {
  mantras: [
    "Sacred Mantras | DharmDisha",
    "Read, listen and count japa with a growing Hindu mantra library.",
  ],
  darshan: [
    "Live Temple Darshan | DharmDisha",
    "Watch dynamically discovered Hindu temple streams currently marked live.",
  ],
  scriptures: [
    "Hindu Scriptures | DharmDisha",
    "Read Vedas, Upanishads, Puranas, Gitas and Hindu heritage articles.",
  ],
  deities: [
    "Hindu Deity Encyclopedia | DharmDisha",
    "Explore Hindu deity stories, symbols, festivals and related mantras.",
  ],
  temples: [
    "Hindu Temple Locator | DharmDisha",
    "Discover important Hindu temples by deity, city, state and distance.",
  ],
  priests: [
    "Priest and Puja Directory | DharmDisha",
    "Explore verified regional priest specializations and common puja guides.",
  ],
  "my-dharma": [
    "My Dharma | DharmDisha",
    "Create a private regional tradition profile, daily practice and family ritual reminders.",
  ],
  culture: [
    "Culture of India | DharmDisha",
    "Explore calendars, festivals, living traditions and temples across every Indian state and union territory.",
  ],
  wisdom: [
    "Pravachan and Cultural Reading | DharmDisha",
    "Find official pravachan sources and publisher-direct spiritual magazines and books.",
  ],
  astrology: [
    "Vedic Astrology Learning | DharmDisha",
    "Learn Panchang and Jyotisha concepts with transparent calculation boundaries.",
  ],
};
const template = await readFile("dist/index.html", "utf8");
for (const [route, [title, description]] of Object.entries(routes)) {
  const directory = join("dist", route);
  await mkdir(directory, { recursive: true });
  const html = template
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta name="description" content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${description}" />`,
    );
  await writeFile(join(directory, "index.html"), html);
}
