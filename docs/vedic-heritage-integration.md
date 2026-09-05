# Vedic Heritage Portal integration

The Scriptures page contains a catalogue of the official Vedic Heritage Portal's
Samhita, Brahmana, Aranyaka, Upanishad, Vedanga, ritual, manuscript and published
book sections. It stores only titles, categories and destination URLs. It does not
copy the portal's article text, scans, PDFs, audio or video.

## Deployment status

IGNCA's published **Hyper linking Policy** says that prior permission is required
before another website links to the portal. Its **Copyright Policy** also says the
site's contents may not be reproduced partially or fully without written
permission from IGNCA or the contributor.

The metadata-only outbound cards are enabled by default at the project owner's
direction. This project setting is not a representation that IGNCA has granted
permission. The deployer remains responsible for obtaining any permission required
by the following published policies:

- Hyperlinking policy: https://vedicheritage.gov.in/hyper-linking-policy/
- Copyright policy: https://vedicheritage.gov.in/copyright-policy/
- Contact: https://vedicheritage.gov.in/contact-us/

The request should identify `https://mantra.sigq.in/scriptures`, explain that the
page is a non-misleading educational catalogue, and state the exact link label
(`Vedic Heritage Portal — IGNCA, Ministry of Culture`). Ask separately for
permission if scanned pages, article text, cover images or other portal content
will be reproduced inside Divinity Harmony.

To disable the outbound cards, set this build-time variable and redeploy:

```env
VITE_VEDIC_HERITAGE_LINKS_ENABLED=false
```

The catalogue is defined in `src/data/vedic-heritage-catalog.ts`. Each entry uses
an exact URL found in the official sitemap or an individually verified official
flipbook URL. New links must be checked against the official portal before being
added. Do not guess flipbook slugs.
