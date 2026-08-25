import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, Music, Pause, Play, SkipBack, SkipForward, Volume1, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { formatTime } from '@/lib/utils';

interface AudioPlayerProps {
  audioUrl?: string;
  title: string;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  autoplay?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, title, onNext, onPrevious, hasNext = false, hasPrevious = false, autoplay = false }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.load();
    setCurrentTime(0); setDuration(0); setIsPlaying(false); setError('');
    if (autoplay && audioUrl) {
      void audio.play().then(() => setIsPlaying(true)).catch(() => {
        setIsPlaying(false);
        setError('This recording is not available in your browser. Please select another mantra.');
      });
    }
  }, [audioUrl, autoplay]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : volume;
  }, [muted, volume]);

  const play = async () => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;
    setError('');
    try { await audio.play(); setIsPlaying(true); }
    catch { setIsPlaying(false); setError('This recording is not available in your browser. Please select another mantra.'); }
  };
  const togglePlay = () => { if (isPlaying) { audioRef.current?.pause(); setIsPlaying(false); } else void play(); };
  const safeDuration = Number.isFinite(duration) ? duration : 0;
  const progress = safeDuration ? Math.min(100, (currentTime / safeDuration) * 100) : 0;

  return <section className="audio-player mt-6 rounded-xl border bg-card p-5 shadow-sm" aria-label="Audio player">
    <audio ref={audioRef} preload="metadata" src={audioUrl}
      onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
      onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
      onEnded={() => { setIsPlaying(false); setCurrentTime(0); if (hasNext) onNext?.(); }}
      onError={() => { setIsPlaying(false); setError('Audio link is unavailable. The mantra text remains available to read.'); }} />
    <div className="mb-4 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-hindu-orange/20"><Music className="w-5 text-hindu-orange" /></div>
      <div className="min-w-0 flex-1"><h3 className="truncate font-medium">{title}</h3><p className="text-xs text-muted-foreground">{formatTime(currentTime)} / {formatTime(safeDuration)}</p></div></div>
    {error && <p role="status" className="mb-3 flex items-center gap-2 rounded-md bg-destructive/10 p-2 text-sm text-destructive"><AlertCircle className="h-4 w-4" />{error}</p>}
    <Slider value={[currentTime]} min={0} max={safeDuration || 0} step={0.1} disabled={!safeDuration}
      onValueChange={([time]) => { if (audioRef.current) { audioRef.current.currentTime = time; setCurrentTime(time); } }} aria-label="Seek audio" />
    <div className="mt-4 flex items-center justify-between"><div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" disabled={!hasPrevious} onClick={onPrevious}><SkipBack /><span className="sr-only">Previous</span></Button>
      <Button variant="outline" size="icon" className="h-12 w-12 rounded-full" disabled={!audioUrl} onClick={togglePlay}>{isPlaying ? <Pause /> : <Play className="ml-0.5" />}<span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span></Button>
      <Button variant="ghost" size="icon" disabled={!hasNext} onClick={onNext}><SkipForward /><span className="sr-only">Next</span></Button>
    </div><div className="flex w-1/3 items-center gap-2"><Button variant="ghost" size="icon" onClick={() => setMuted(!muted)}>{muted || volume === 0 ? <VolumeX /> : volume < 0.5 ? <Volume1 /> : <Volume2 />}<span className="sr-only">{muted ? 'Unmute' : 'Mute'}</span></Button>
      <Slider value={[muted ? 0 : volume]} min={0} max={1} step={0.01} onValueChange={([next]) => { setVolume(next); setMuted(next === 0); }} aria-label="Volume" /></div></div>
  </section>;
};

export default AudioPlayer;
