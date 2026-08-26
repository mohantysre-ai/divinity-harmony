# Remote mantra catalog

The Mantra Library has a built-in catalog and can merge an unlimited external catalog at runtime.

1. Host a JSON file using the schema in `public/mantra-catalog.example.json`.
2. Ensure the host allows browser CORS requests.
3. Set `VITE_MANTRA_CATALOG_URL=https://your-domain.example/mantras.json` at build time.
4. Use only public-domain text, properly licensed images and recordings, and source URLs you have independently checked.

Entries without the required id, title, description, text, or translation fields are rejected. Exact duplicate title/text pairs are removed automatically. Audio failures remain non-blocking: users can still read the text and select another recording.
