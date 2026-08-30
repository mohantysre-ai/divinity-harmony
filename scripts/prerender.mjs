import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const routes = {
  mantras: [
    "Sacred Mantras | Divinity Harmony",
    "Read, listen and count japa with a growing Hindu mantra library.",
  ],
  darshan: [
    "Live Temple Darshan | Divinity Harmony",
    "Watch dynamically discovered Hindu temple streams currently marked live.",
  ],
  scriptures: [
    "Hindu Scriptures | Divinity Harmony",
    "Read Vedas, Upanishads, Puranas, Gitas and Hindu heritage articles.",
  ],
  deities: [
    "Hindu Deity Encyclopedia | Divinity Harmony",
    "Explore Hindu deity stories, symbols, festivals and related mantras.",
  ],
  temples: [
    "Hindu Temple Locator | Divinity Harmony",
    "Discover important Hindu temples by deity, city, state and distance.",
  ],
  priests: [
    "Priest and Puja Directory | Divinity Harmony",
    "Explore verified regional priest specializations and common puja guides.",
  ],
  "my-dharma": [
    "My Dharma | Divinity Harmony",
    "Create a private regional tradition profile, daily practice and family ritual reminders.",
  ],
  culture: [
    "Culture of India | Divinity Harmony",
    "Explore calendars, festivals, living traditions and temples across every Indian state and union territory.",
  ],
  wisdom: [
    "Pravachan and Cultural Reading | Divinity Harmony",
    "Find official pravachan sources and publisher-direct spiritual magazines and books.",
  ],
  astrology: [
    "Vedic Astrology Learning | Divinity Harmony",
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
