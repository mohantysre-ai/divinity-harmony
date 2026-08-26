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

Visitors do not need an API key. The production container runs a same-origin
`/api/live-darshan` service that reads YouTube's live-filtered temple/darshan
search results, keeps only videos carrying YouTube's current LIVE badge, and
caches the results for five minutes. It has no fixed channel list or result cap.

For local development, run the API and Vite in separate terminals:

```bash
python3 server/live_darshan_api.py
npm run dev
```
