# Temple, priest, ritual and culture platform phases

This document separates what the application now does from the work required
to become a trustworthy guide for every locality and tradition. Large coverage
must come from a dynamic data system plus review, not thousands of unverified
hard-coded cards.

## Product rule

Every discovery flow starts with a place, language or practice selected by the
visitor. Bundled content supplies high-quality starter guides; live discovery
handles the long tail. Ritual claims, contacts, schedules, fees and travel
inventory must display their source and freshness before they are treated as
verified.

## Phase 1 — delivered foundation

| Area | Delivered behavior |
| --- | --- |
| Mantras | Requested collection opens the in-page YouTube devotional player; TemplePurohit redirects were removed. Search clears conflicting deity filters and selected results scroll to the reader. |
| Temples | 24 detailed India/world starter guides, including four Indonesian Hindu sites; arbitrary worldwide search uses OpenStreetMap Nominatim and nearby geolocation uses Overpass. |
| Travel | Every temple guide supplies directions plus current searches for flights, stays, packages and local transport. International guides add passport/visa/currency/custom checks. |
| Priests | Any entered locality creates current Google Maps, contact/review and Justdial-result searches; bundled city cards are suggestions, not a limit. |
| Puja Vidhi | 24 guides cover daily worship, vrata, festivals, household puja and preparation for priest-led samskaras/rites. A modal provides material checks, one-step-at-a-time guidance, progress, flame motion and flower completion. |
| Culture | 36 state/UT packs now open into calendar, observance, household-tradition, sacred-journey and language cards. A locality/community explorer handles district-level questions. |
| Language | Eleven Indian regional locales use semantic packs first and native-script fallback for dynamic/unreviewed place content; manual English remains available. |

## Phase 2 — verified temple knowledge graph

Each temple record should support:

- canonical name, local-script names, aliases, deity, sampradaya and managing body;
- coordinates, official contacts, official website and last-verified date;
- ordinary/festival opening hours, aarti schedule, darshan types and queue rules;
- official seva/ticket/donation links and scam warnings;
- dress, footwear, photography, food, baggage, gender/age and non-Hindu entry rules;
- wheelchair route, lift/ramp, elder assistance, toilets, drinking water and medical aid;
- nearest airport/rail/bus, last-mile choices, parking and realistic transfer time;
- stays by budget, verified dharmashala contacts and live partner inventory;
- weather, best season, crowd pattern, festival calendar and closure risks;
- passport/visa/currency/SIM/insurance/local-law guidance for overseas journeys;
- history, architecture, associated texts, legends clearly labelled as tradition;
- citations, licence, reviewer, change history and community correction status.

Ingestion should combine official temple sites, government tourism authorities,
UNESCO/open museum sources and OpenStreetMap. Automated facts remain pending
until a reviewer accepts them.

## Phase 3 — consented priest marketplace

The public-directory bridge should become an opt-in marketplace with:

- priest identity, consent, service radius and supported languages;
- tradition, shakha/sutra/sampradaya and training claims with verification state;
- ceremonies offered, inclusions/exclusions, duration and transparent price range;
- availability calendar, travel fee, online/in-person mode and accessibility;
- verified phone/WhatsApp reveal, masked calling and anti-spam controls;
- booking, cancellation, payment, invoice, dispute and safeguarding workflows;
- reviews only from completed bookings, with moderation and right of reply;
- emergency removal, fraud reporting and periodic re-verification.

Personal numbers must not be scraped and republished. Until the consent layer
exists, the app opens current public result pages where users verify details.

## Phase 4 — reviewed ritual engine

Every Puja Vidhi record needs a structured, versioned definition:

- purpose, eligibility, region, language, family/sampradaya variation and difficulty;
- calendar rule, time window, fasting and health/accessibility alternatives;
- preparation, cleanliness, altar direction and complete materials with substitutes;
- sankalpa fields kept private on-device;
- ordered steps with timer, image/animation, mantra text, transliteration, meaning and licensed audio;
- explicit branches such as “if a kalasha is unavailable” or “if performed in a flat”;
- fire, smoke, water, food/allergy, child, elder, animal and electrical safety;
- completion, prasada, donation, cleanup and respectful disposal;
- “household-safe,” “priest recommended” or “qualified priest required” classification;
- named reviewer, reference tradition, review date and correction history.

The animation system should remain instructional: lamp/flame motion, bell/timer,
offering placement and completion petals. It must not simulate initiation,
tantric practice, Vedic fire procedure or lineage-specific ancestral rites as a
self-service game.

## Phase 5 — district and community culture atlas

State summaries become an index into district/community pages covering:

- local language/dialect, script, calendar and pronunciation;
- temple traditions, village deities, pilgrimage circuits and festival routes;
- home rituals, lifecycle customs and regional variations without presenting one
  caste, community or family form as universal;
- music, dance, theatre, storytelling, crafts, textiles, food and seasonal work;
- oral histories with consent, contributor attribution and withdrawal controls;
- museums, archives, cultural institutions, artisans and responsible local guides;
- accessibility, photography etiquette, sacred/private boundaries and visitor conduct;
- multilingual articles reviewed by local practitioners and subject experts.

## Phase 6 — trip builder and packages

A real trip plan requires live inventory rather than static prices:

1. visitor selects origin, dates, travellers, elders/children, budget and language;
2. system checks temple opening/festival rules and builds a feasible route;
3. partner APIs return transport, rooms and authorised package availability;
4. plan shows walking/queue load, rest, food, medicine and accessibility breaks;
5. every charge identifies the seller, cancellation rule and support contact;
6. saved itinerary works offline and refreshes changed timings before departure.

Until commercial partner agreements exist, current-search links are safer than
fabricated package cards or copied prices.

## Acceptance gates

- A search for an unknown village returns live map/directory options or an honest
  no-result state; it never silently substitutes a different city.
- A temple guide identifies which details are official, community-mapped or
  editorial and displays freshness.
- Regional mode shows no accidental Latin UI copy; third-party iframe controls
  are clearly outside app control.
- A ritual cannot enter a hazardous/lineage-only sequence without the correct
  priest-required boundary.
- No private contact, copyrighted full text, recording or image is copied without
  consent or a compatible licence.
- Builds, lint, Python tests and API compilation pass before deployment.
