/** Search Wikimedia Commons for a usable thumbnail (client-side, CORS-enabled). */

const API = "https://commons.wikimedia.org/w/api.php";

export async function searchWikimediaImage(
  query: string,
  limit = 5,
): Promise<string | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: trimmed,
    gsrnamespace: "6",
    gsrlimit: String(limit),
    prop: "imageinfo",
    iiurlwidth: "800",
    format: "json",
    origin: "*",
  });

  try {
    const res = await fetch(`${API}?${params}`);
    if (!res.ok) return null;
    const data = (await res.json()) as {
      query?: { pages?: Record<string, { imageinfo?: { thumburl?: string }[] }> };
    };
    const pages = data.query?.pages;
    if (!pages) return null;
    for (const page of Object.values(pages)) {
      const thumb = page.imageinfo?.[0]?.thumburl;
      if (thumb) return thumb;
    }
  } catch {
    return null;
  }
  return null;
}
