import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, Music, Pause, Play, SkipBack, SkipForward, Volume1, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { formatTime } from '@/lib/utils';

interface AudioPlayerProps {
  audioUrl?: string;
  text: string;
  title: string;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  autoplay?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, text, title, onNext, onPrevious, hasNext = false, hasPrevious = false, autoplay = false }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    window.speechSynthesis?.cancel();
    audio.load();
    setCurrentTime(0); setDuration(0); setIsPlaying(false); setIsSpeaking(false); setError('');
    if (autoplay && audioUrl) {
      void audio.play().then(() => setIsPlaying(true)).catch(() => {
        setIsPlaying(false);
        speakText();
      });
    }
  // Browser speech is the reliable playback fallback when a third-party recording disappears.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioUrl, autoplay]);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : volume;
  }, [muted, volume]);

  const speakText = (notice = 'Playing with your device voice.') => {
    if (!('speechSynthesis' in window)) {
      setError('Voice playback is not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.8;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => { setIsSpeaking(false); setError('Device voice playback could not start.'); };
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setError(notice);
  };
  const play = async () => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) { speakText(); return; }
    setError('');
    try { await audio.play(); setIsPlaying(true); }
    catch { setIsPlaying(false); speakText(); }
  };
  const togglePlay = () => {
    if (isPlaying) { audioRef.current?.pause(); setIsPlaying(false); return; }
    if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); return; }
    void play();
  };
  const safeDuration = Number.isFinite(duration) ? duration : 0;
  const progress = safeDuration ? Math.min(100, (currentTime / safeDuration) * 100) : 0;

  return <section className="audio-player mt-6 rounded-xl border bg-card p-5 shadow-sm" aria-label="Audio player">
    <audio ref={audioRef} preload="metadata" src={audioUrl}
      onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
      onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
      onEnded={() => { setIsPlaying(false); setCurrentTime(0); if (hasNext) onNext?.(); }}
      onError={() => { setIsPlaying(false); speakText(); }} />
    <div className="mb-4 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-hindu-orange/20"><Music className="w-5 text-hindu-orange" /></div>
      <div className="min-w-0 flex-1"><h3 className="truncate font-medium">{title}</h3><p className="text-xs text-muted-foreground">{formatTime(currentTime)} / {formatTime(safeDuration)}</p></div></div>
    {error && <p role="status" className={`mb-3 flex items-center gap-2 rounded-md p-2 text-sm ${error.includes('could not') || error.includes('not supported') ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'}`}><AlertCircle className="h-4 w-4 shrink-0" />{error}</p>}
    <Slider value={[currentTime]} min={0} max={safeDuration || 0} step={0.1} disabled={!safeDuration}
      onValueChange={([time]) => { if (audioRef.current) { audioRef.current.currentTime = time; setCurrentTime(time); } }} aria-label="Seek audio" />
    <div className="mt-4 flex items-center justify-between"><div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" disabled={!hasPrevious} onClick={onPrevious}><SkipBack /><span className="sr-only">Previous</span></Button>
      <Button variant="outline" size="icon" className="h-12 w-12 rounded-full" onClick={togglePlay}>{isPlaying || isSpeaking ? <Pause /> : <Play className="ml-0.5" />}<span className="sr-only">{isPlaying || isSpeaking ? 'Pause' : 'Play'}</span></Button>
      <Button variant="ghost" size="icon" disabled={!hasNext} onClick={onNext}><SkipForward /><span className="sr-only">Next</span></Button>
    </div><div className="flex w-1/3 items-center gap-2"><Button variant="ghost" size="icon" onClick={() => setMuted(!muted)}>{muted || volume === 0 ? <VolumeX /> : volume < 0.5 ? <Volume1 /> : <Volume2 />}<span className="sr-only">{muted ? 'Unmute' : 'Mute'}</span></Button>
      <Slider value={[muted ? 0 : volume]} min={0} max={1} step={0.01} onValueChange={([next]) => { setVolume(next); setMuted(next === 0); }} aria-label="Volume" /></div></div>
  </section>;
};

export default AudioPlayer;
