# Divinity Harmony implementation gap analysis

Reviewed against the attached architecture on 30 August 2026.

## Executive result

The platform foundation and most user-facing modules are implemented. The
largest remaining accuracy gap is ephemeris-grade Panchang calculation. The
largest distribution gap is signed Android/iOS packaging and store release.
Temple data ingestion, per-deity deep data relationships and full SEO
prerendering also remain partial.

| Architecture item | Status | Current implementation | Remaining gap |
| --- | --- | --- | --- |
| Panchang API/widget | Partial | Same-origin API, date/location inputs, animated responsive cards, tithi/nakshatra/yoga/karana and sunrise/sunset | Current calculation is an educational approximation. Add Swiss Ephemeris and boundary times before calling it muhurta-grade. TanStack daily caching is not yet used. |
| Deity encyclopedia | Partial | `/deities` and `/deities/:slug`, 10 deity profiles, iconography, festivals and links into mantras/scriptures | Expand structured deity-to-mantra and deity-to-Purana ID relationships; link individual darshan results to presiding deities. |
| Scripture reader | Implemented | `/scriptures` plus legacy alias, large categorized catalog, full source/chapter fetch, LRU cache, source URL and license display | Coverage depends on available licensed/public source editions; add more verified sources and optional persistent response cache. |
| Temple locator | Partial | `/temples`, 12 curated temples, OpenStreetMap, browser geolocation, search and distance ordering | Add repeatable Overpass build script and a much larger versioned OSM dataset. Current map is an iframe rather than react-leaflet. |
| Priest/Puja directory | Partial | 12 regional searches, supported Google Maps URLs, Sulekha city directories, location-based nearby search and six detailed Puja Vidhi guides | Individual priests are not directly verified or stored with consented phone/WhatsApp contacts; moderation/admin workflow is not built. |
| Japa/mala counter | Implemented | Local-first 108 counter, anonymous device identity and SQLite `POST /api/japa` synchronization | Streak/history visualization remains optional future work. |
| Multi-script mantra display | Implemented | Runtime Devanagari, IAST, Odia, Telugu, Tamil, Bengali, Gujarati, Punjabi, Kannada and Malayalam conversion; browser-locale default, user-approved location detection and persisted manual selection | Automated transliteration can be lossy in some scripts; authoritative reviewed variants should replace it for sensitive/complex texts. |
| Devotional mantra audio | Implemented | Per-mantra YouTube discovery, official privacy-enhanced iframe playback, alternate result selection and direct YouTube fallback | Search can be rate-limited by YouTube and some uploaders disable embedding. No YouTube content is downloaded or converted to MP3. Curated licensed recordings would be more deterministic. |
| AI shloka explainer | Implemented | Same-origin endpoint, SQLite cache, free glossary fallback and optional server-side Anthropic enhancement | Word-level tap selection in the scripture reader is not yet implemented. |
| Persistence/accounts | Implemented | SQLite guest state plus Supabase email auth, reset flow, sessions, profile metadata and avatar storage policies | Production requires Supabase URL/key configuration and execution of `supabase/setup.sql`. |
| PWA/mobile | Partial | Manifest, service worker, offline shell and Capacitor configuration | Native projects, signing, store privacy declarations and Play/App Store releases are not generated. |
| Monetization | Partial | Optional verified `VITE_SUPPORT_URL`; no fake payment destination | Razorpay/UPI production destination and affiliate agreements must be configured by the owner. Premium billing is not built. |
| SEO/discoverability | Partial | Route-specific HTML for six primary routes, metadata and readable content | Deity detail pages and all individual scripture/mantra pages are not individually prerendered. This is static route metadata, not full SSR. |
| Newsletter/legal/footer | Implemented | Persistent consented subscriptions, functioning legal routes, valid internal links and config-only contact/social links | Sending campaigns and unsubscribe-token processing require an email provider. |

## New mantra playback behavior

1. Selecting a mantra requests `/api/mantra-recordings?title=...`.
2. The server performs a tightly scoped YouTube devotional search and caches the
   result for 24 hours.
3. The page embeds the selected result using YouTube's official
   `youtube-nocookie.com` player.
4. Up to six alternate recordings can be selected.
5. If discovery or embedding is unavailable, the visitor can open the exact
   search on YouTube.
6. Synthetic spoken text remains collapsed as an accessibility/offline fallback,
   not the primary experience.

YouTube files are never downloaded, extracted or presented as MP3. This keeps
playback within the official embedded-player model.

## Recommended next sequence

1. Configure Supabase in production and validate registration, reset and avatar
   upload against the deployed domain.
2. Replace approximate Panchang calculations with Swiss Ephemeris and add exact
   tithi/nakshatra boundary times.
3. Create the Overpass temple build pipeline and expand the temple dataset.
4. Curate a stable, licensed recording ID for the most-used 100 mantras; retain
   dynamic YouTube discovery for the long tail.
5. Prerender deity details and stable scripture/mantra detail URLs.
6. Generate and test the signed Capacitor Android release.
