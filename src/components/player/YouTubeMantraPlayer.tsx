import { useCallback, useEffect, useMemo, useState } from "react";
import { ExternalLink, Loader2, Music2, Pause, Play, RefreshCw, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useLocale } from "@/hooks/use-locale";
import { useYouTubeAudio } from "@/hooks/use-youtube-audio";
import { curatedMantraAudio, searchMantraAudio, type MantraAudioCandidate } from "@/lib/mantra-audio";
import { formatTime } from "@/lib/utils";

type CuratedRecording = {
  videoId?: string;
  channelTitle?: string;
  durationText?: string;
};

export default function YouTubeMantraPlayer({ title, curated }: { title: string; curated?: CuratedRecording }) {
  const { tk } = useLocale();
  const pinned = useMemo(() => curatedMantraAudio(curated?.videoId, title, curated?.channelTitle, curated?.durationText), [curated?.channelTitle, curated?.durationText, curated?.videoId, title]);
  const [items, setItems] = useState<MantraAudioCandidate[]>(pinned ? [pinned] : []);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState("");
  const [volume, setVolume] = useState(0.8);
  const current = items[selected];
  const player = useYouTubeAudio({ videoId: expanded ? current?.videoId : undefined, autoplay: expanded });

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    setExpanded(false);
    void searchMantraAudio(title)
      .then((found) => {
        const next = pinned ? [pinned, ...found.filter((item) => item.videoId !== pinned.videoId)] : found;
        setItems(next);
        setSelected(0);
        if (!next.length) setError(tk("noRecordingFound"));
      })
      .catch(() => setError(tk("recordingsUnavailable")))
      .finally(() => setLoading(false));
  }, [pinned, title, tk]);

  useEffect(() => load(), [load]);

  const searchUrl = useMemo(() => `https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} devotional mantra full`)}`, [title]);
  const safeDuration = Number.isFinite(player.duration) ? player.duration : 0;

  return <section className="mt-6 overflow-hidden rounded-2xl border bg-card shadow-sm">
    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-lg"><Music2 className="h-6 w-6" /></div>
      <div className="min-w-0 flex-1"><p className="text-xs font-semibold uppercase tracking-[.18em] text-red-700">{tk("devotionalAudio")}</p><h3 className="truncate text-lg font-bold">{title}</h3>{current && <p className="truncate text-xs text-muted-foreground">{current.title} · {current.channelTitle}{current.durationText ? ` · ${current.durationText}` : ""}</p>}</div>
      {loading ? <Loader2 className="h-6 w-6 animate-spin text-orange-700" /> : current ? <Button onClick={() => setExpanded(true)} disabled={expanded}><Play className="mr-2 h-4 w-4" />{expanded ? tk("playingBelow") : tk("playRecording")}</Button> : <Button asChild><a href={searchUrl} target="_blank" rel="noopener noreferrer">{tk("searchYouTube")}<ExternalLink className="ml-2 h-4 w-4" /></a></Button>}
      <Button size="icon" variant="ghost" onClick={() => { if (items.length > 1) { setSelected((value) => (value + 1) % items.length); setExpanded(false); } else load(); }} disabled={loading} aria-label={tk("findAnotherRecording")}><RefreshCw className="h-4 w-4" /></Button>
    </div>
    {error && <p className="border-t px-5 py-3 text-sm text-muted-foreground">{error}</p>}
    {expanded && current && <div className="border-t bg-black text-white">
      <div className="mx-auto aspect-video w-full max-w-3xl"><div ref={player.containerRef} className="h-full w-full" /></div>
      <div className="mx-auto flex max-w-3xl flex-col gap-3 border-t border-white/15 p-4 sm:flex-row sm:items-center">
        <Button size="icon" variant="secondary" className="h-11 w-11 shrink-0 rounded-full" onClick={player.isPlaying ? player.pause : player.play} disabled={!player.ready} aria-label={player.isPlaying ? tk("pauseLabel") : tk("playLabel")}>{player.isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}</Button>
        <div className="flex min-w-0 flex-1 items-center gap-3"><span className="w-10 text-xs tabular-nums">{formatTime(player.currentTime)}</span><Slider value={[player.currentTime]} min={0} max={safeDuration || 1} step={1} disabled={!safeDuration} onValueChange={([time]) => player.seekTo(time)} aria-label={tk("seekAudio")} /><span className="w-10 text-right text-xs tabular-nums">{formatTime(safeDuration)}</span></div>
        <div className="flex items-center gap-2 sm:w-32"><Volume2 className="h-4 w-4 shrink-0" /><Slider value={[volume]} min={0} max={1} step={0.05} onValueChange={([next]) => { setVolume(next); player.setVolume(next); }} aria-label={tk("volumeLabel")} /></div>
      </div>
      {player.error && <p className="mx-auto max-w-3xl px-4 pb-4 text-sm text-amber-200">{tk("recordingsUnavailable")}</p>}
    </div>}
    {items.length > 1 && <div className="flex gap-2 overflow-x-auto border-t px-5 py-3">{items.map((item, index) => <button type="button" key={item.videoId} onClick={() => { setSelected(index); setExpanded(false); }} className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium ${index === selected ? "border-red-600 bg-red-50 text-red-700 dark:bg-red-950/20" : "hover:border-orange-300"}`}>{index + 1}. {item.channelTitle}</button>)}</div>}
    <p className="border-t px-5 py-2 text-[10px] text-muted-foreground">{tk("audioCompactViewNote")}</p>
  </section>;
}
