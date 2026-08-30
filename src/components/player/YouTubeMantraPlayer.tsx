import { useCallback, useEffect, useMemo, useState } from "react";
import { ExternalLink, Loader2, Music2, Play, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/use-locale";

type Recording = {
  videoId: string;
  title: string;
  channelTitle: string;
  duration: string;
  thumbnailUrl: string;
  url: string;
  embedUrl: string;
};
export default function YouTubeMantraPlayer({ title }: { title: string }) {
  const { locale } = useLocale();
  const [items, setItems] = useState<Recording[]>([]),
    [selected, setSelected] = useState(0),
    [loading, setLoading] = useState(true),
    [expanded, setExpanded] = useState(false),
    [error, setError] = useState("");
  const load = useCallback(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    setExpanded(false);
    fetch(`/api/mantra-recordings?title=${encodeURIComponent(title)}`, {
      signal: controller.signal,
    })
      .then((r) => r.json().then((data) => ({ ok: r.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || "Recording search failed");
        setItems(data.items || []);
        setSelected(0);
        if (!(data.items || []).length)
          setError("No matching devotional recording was found right now.");
      })
      .catch((e) => {
        if (e.name !== "AbortError")
          setError(
            e.message || "YouTube recordings are temporarily unavailable.",
          );
      })
      .finally(() => setLoading(false));
    return controller;
  }, [title]);
  useEffect(() => {
    const controller = load();
    return () => controller.abort();
  }, [load]);
  const current = items[selected],
    searchUrl = useMemo(
      () =>
        `https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} devotional mantra full`)}`,
      [title],
    ),
    playUrl = current
      ? `${current.embedUrl.replace("autoplay=0", "autoplay=1")}&hl=${locale}`
      : undefined;
  return (
    <section className="mt-6 overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-lg">
          <Music2 className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-red-700">
            Devotional audio
          </p>
          <h3 className="truncate text-lg font-bold">{title}</h3>
          {current && (
            <p className="truncate text-xs text-muted-foreground">
              {current.title} · {current.channelTitle}
              {current.duration ? ` · ${current.duration}` : ""}
            </p>
          )}
        </div>
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-orange-700" />
        ) : current ? (
          <Button onClick={() => setExpanded(true)} disabled={expanded}>
            <Play className="mr-2 h-4 w-4" />
            {expanded ? "Playing below" : "Play recording"}
          </Button>
        ) : (
          <Button asChild>
            <a href={searchUrl} target="_blank" rel="noopener noreferrer">
              Search YouTube
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        )}
        <Button
          size="icon"
          variant="ghost"
          onClick={() => load()}
          disabled={loading}
          aria-label="Find another recording"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      {error && (
        <p className="border-t px-5 py-3 text-sm text-muted-foreground">
          {error}
        </p>
      )}
      {expanded && current && (
        <div className="border-t bg-black">
          <iframe
            key={current.videoId}
            className="mx-auto aspect-video w-full max-w-2xl"
            src={playUrl}
            title={current.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      )}
      {items.length > 1 && (
        <div className="flex gap-2 overflow-x-auto border-t px-5 py-3">
          {items.map((item, index) => (
            <button
              type="button"
              key={item.videoId}
              onClick={() => {
                setSelected(index);
                setExpanded(false);
              }}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium ${index === selected ? "border-red-600 bg-red-50 text-red-700 dark:bg-red-950/20" : "hover:border-orange-300"}`}
            >
              {index + 1}. {item.channelTitle}
            </button>
          ))}
        </div>
      )}
      <p className="border-t px-5 py-2 text-[10px] text-muted-foreground">
        Audio-style compact view. The official YouTube player appears only after
        Play is pressed.
      </p>
    </section>
  );
}
