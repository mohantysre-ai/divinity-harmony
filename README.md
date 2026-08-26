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

Live Darshan searches YouTube for streams that YouTube reports as live. Enable **YouTube Data API v3** in Google Cloud and either set `VITE_YOUTUBE_API_KEY` in the deployment environment or use the **Add key** control on the Live Darshan page. Restrict browser API keys to the app domain and do not commit keys to the repository.
