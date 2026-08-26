# Divinity Harmony

A devotional web application for reading and listening to sacred mantras, stotras and Vedic prayers.

## Development

```bash
npm ci
npm run dev
```

## Build

```bash
npm run lint
npm run build
```

Set `VITE_MANTRA_CATALOG_URL` to expand the built-in mantra catalog with a hosted, validated JSON source.

## Live temple darshan

Visitors do not need an API key. A GitHub Actions job refreshes `public/live-darshan-feed.json` every five minutes by discovering YouTube videos whose current status is live. The page reads that published feed at runtime. Run **Refresh live darshan feed** from the Actions tab to update it immediately.
