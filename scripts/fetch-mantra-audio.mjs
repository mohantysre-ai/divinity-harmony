/**
 * Find a real chanted recording on YouTube for each mantra and pin its
 * video ID into mantras.json, so playback uses an actual chant instead of
 * the browser's text-to-speech voice.
 *
 * Uses the same no-API-key technique as server/live_darshan_api.py (reads
 * YouTube's own search results page and decodes ytInitialData) but without
 * the "live now" filter, and explicitly skips anything currently live or
 * missing a duration — a mantra track should be a fixed recording.
 *
 * This is a *curation* step, not a live per-request search: it runs once
 * per mantra (or when --only-missing is skipped, re-checks everything),
 * prints its pick plus the runner-up so you can sanity-check the result,
 * and only writes to mantras.json after you're happy with it. Mantras this
 * script hasn't reached yet still get a best-effort live search at runtime
 * via /api/mantra-recordings — see src/lib/mantra-audio.ts.
 *
 * Run safely: node scripts/fetch-mantra-audio.mjs --only-missing --limit=10
 * Apply reviewed picks: node scripts/fetch-mantra-audio.mjs --only-missing --limit=10 --apply
 * Optional: --only-missing   skip mantras that already have a youtubeVideoId
 * Optional: --limit=N        inspect at most N unpinned mantras
 * Optional: --dry-run        force preview mode even when --apply is present
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const target = path.join(__dirname, '..', 'src', 'data', 'mantras.json');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36';
const onlyMissing = process.argv.includes('--only-missing');
const apply = process.argv.includes('--apply');
const dryRun = !apply || process.argv.includes('--dry-run');
const limitArg = process.argv.find((value) => value.startsWith('--limit='));
const limit = limitArg ? Math.max(1, Number(limitArg.split('=')[1]) || 1) : Infinity;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function textOf(value) {
  if (!value || typeof value !== 'object') return '';
  if (typeof value.simpleText === 'string') return value.simpleText.trim();
  if (Array.isArray(value.runs)) return value.runs.map((run) => run?.text ?? '').join('').trim();
  return '';
}

function* walk(value) {
  if (value && typeof value === 'object') {
    yield value;
    for (const child of Object.values(value)) yield* walk(child);
  } else if (Array.isArray(value)) {
    for (const child of value) yield* walk(child);
  }
}

function isLive(renderer) {
  const badges = Array.isArray(renderer.badges) ? renderer.badges : [];
  for (const badge of badges) {
    const meta = badge?.metadataBadgeRenderer ?? {};
    const style = String(meta.style ?? '').toUpperCase();
    const label = String(meta.label ?? '').toUpperCase();
    if (style.includes('LIVE_NOW') || label === 'LIVE') return true;
  }
  const overlays = Array.isArray(renderer.thumbnailOverlays) ? renderer.thumbnailOverlays : [];
  for (const overlay of overlays) {
    const status = overlay?.thumbnailOverlayTimeStatusRenderer ?? {};
    if (String(status.style ?? '').toUpperCase() === 'LIVE') return true;
    if (textOf(status.text).toUpperCase() === 'LIVE') return true;
  }
  return false;
}

function extractInitialData(html) {
  const markers = ['var ytInitialData = ', 'window["ytInitialData"] = ', 'ytInitialData = '];
  for (const marker of markers) {
    const start = html.indexOf(marker);
    if (start < 0) continue;
    const from = start + marker.length;
    // Find the end of the JSON object by tracking a semicolon at depth 0.
    let depth = 0;
    let inString = false;
    let escaped = false;
    for (let i = from; i < html.length; i += 1) {
      const ch = html[i];
      if (inString) {
        if (escaped) escaped = false;
        else if (ch === '\\') escaped = true;
        else if (ch === '"') inString = false;
        continue;
      }
      if (ch === '"') inString = true;
      else if (ch === '{') depth += 1;
      else if (ch === '}') {
        depth -= 1;
        if (depth === 0) {
          try {
            return JSON.parse(html.slice(from, i + 1));
          } catch {
            break;
          }
        }
      }
    }
  }
  throw new Error('ytInitialData not found');
}

async function searchYouTube(query, limit = 5) {
  const url = `https://www.youtube.com/results?${new URLSearchParams({ search_query: query, hl: 'en', gl: 'IN' })}`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': UA,
      'Accept-Language': 'en-IN,en;q=0.9,hi;q=0.8',
      Cookie: 'CONSENT=YES+cb.20210328-17-p0.en+FX+410',
    },
  });
  if (!response.ok) throw new Error(`YouTube search failed: ${response.status}`);
  const data = extractInitialData(await response.text());

  const results = [];
  const seen = new Set();
  for (const node of walk(data)) {
    const renderer = node.videoRenderer;
    if (!renderer || typeof renderer !== 'object') continue;
    const videoId = renderer.videoId;
    if (!videoId || seen.has(videoId) || isLive(renderer)) continue;
    const durationText = textOf(renderer.lengthText);
    if (!durationText) continue; // no duration usually means live/premiere/mix
    seen.add(videoId);
    results.push({
      videoId,
      title: textOf(renderer.title) || 'Untitled',
      channelTitle: textOf(renderer.ownerText) || textOf(renderer.longBylineText) || 'YouTube channel',
      durationText,
      viewCountText: textOf(renderer.viewCountText),
    });
    if (results.length >= limit) break;
  }
  return results;
}

const data = JSON.parse(fs.readFileSync(target, 'utf8'));
let updated = 0;
let skipped = 0;
let notFound = 0;

let inspected = 0;
for (const mantra of data.mantras) {
  if (inspected >= limit) break;
  if (onlyMissing && mantra.youtubeVideoId) {
    skipped += 1;
    continue;
  }
  inspected += 1;

  let candidates = [];
  try {
    candidates = await searchYouTube(`${mantra.title} chanting`);
    if (!candidates.length) candidates = await searchYouTube(`${mantra.title} mantra audio`);
  } catch (err) {
    console.log(`${mantra.id}: ${mantra.title} [search failed] ${err.message}`);
    await sleep(600);
    continue;
  }

  if (!candidates.length) {
    notFound += 1;
    console.log(`${mantra.id}: ${mantra.title} -> no recording found`);
    await sleep(600);
    continue;
  }

  const pick = candidates[0];
  const runnerUp = candidates[1];
  if (mantra.youtubeVideoId !== pick.videoId) {
    updated += 1;
    if (!dryRun) {
      mantra.youtubeVideoId = pick.videoId;
      mantra.youtubeChannelTitle = pick.channelTitle;
      mantra.youtubeDurationText = pick.durationText;
    }
  }
  console.log(
    `${mantra.id}: ${mantra.title} -> ${pick.videoId} "${pick.title}" by ${pick.channelTitle} (${pick.durationText})` +
      (runnerUp ? ` | runner-up: ${runnerUp.videoId} "${runnerUp.title}"` : ''),
  );
  await sleep(600);
}

if (apply && !dryRun) {
  fs.writeFileSync(target, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}
console.log(
  `${dryRun ? '[dry run] ' : ''}Updated ${updated}, skipped ${skipped} already-set, ${notFound} with no match, out of ${data.mantras.length}.`,
);
console.log('Spot-check a few picks against the actual mantra before trusting this for every entry — wrong audio on a sacred text is worse than none.');
