import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle, Music, Pause, Play, SkipBack, SkipForward, Volume1, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { formatTime } from '@/lib/utils';
import { useLocale } from '@/hooks/use-locale';

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

function pickVoice(voices: SpeechSynthesisVoice[]) {
  const hindi = voices.find((voice) => voice.lang.toLowerCase().startsWith('hi'));
  if (hindi) return hindi;
  const indianEnglish = voices.find((voice) => voice.lang.toLowerCase().startsWith('en-in'));
  if (indianEnglish) return indianEnglish;
  return voices.find((voice) => voice.default) ?? voices[0];
}

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve([]);
      return;
    }
    const voices = window.speechSynthesis.getVoices();
    if (voices.length) {
      resolve(voices);
      return;
    }
    const handleChange = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handleChange);
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.addEventListener('voiceschanged', handleChange);
    window.setTimeout(() => {
      window.speechSynthesis.removeEventListener('voiceschanged', handleChange);
      resolve(window.speechSynthesis.getVoices());
    }, 500);
  });
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  text,
  title,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false,
  autoplay = false,
}) => {
  const { tk } = useLocale();
  const audioRef = useRef<HTMLAudioElement>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const usesVoice = !audioUrl;

  const stopVoice = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
    setIsSpeaking(false);
  }, []);

  const speakText = useCallback(async () => {
    if (!text.trim()) {
      setError(tk('noMantraText'));
      return;
    }
    if (!('speechSynthesis' in window)) {
      setError(tk('voiceUnsupported'));
      return;
    }

    stopVoice();
    setError('');
    setNotice(tk('loadingVoice'));

    const voices = await loadVoices();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.volume = muted ? 0 : volume;

    const voice = pickVoice(voices);
    if (voice) utterance.voice = voice;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setNotice(voice ? tk('playingWithVoiceTemplate', { name: voice.name }) : tk('playingWithDeviceVoice'));
    };
    utterance.onend = () => {
      utteranceRef.current = null;
      setIsSpeaking(false);
      setNotice('');
    };
    utterance.onerror = () => {
      utteranceRef.current = null;
      setIsSpeaking(false);
      setNotice('');
      setError(tk('voicePlaybackFailed'));
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);

    // Chrome sometimes queues speech without starting until the queue is nudged.
    window.setTimeout(() => {
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
    }, 250);
  }, [muted, stopVoice, text, volume, tk]);

  useEffect(() => {
    stopVoice();
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setNotice('');
    setError('');

    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    audio.pause();
    audio.load();
    if (autoplay) {
      void audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
          void speakText();
        });
    }
  }, [audioUrl, autoplay, stopVoice, text, title, speakText]);

  useEffect(() => () => stopVoice(), [stopVoice]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : volume;
  }, [muted, volume]);

  const play = async () => {
    if (usesVoice) {
      await speakText();
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    setNotice('');
    setError('');
    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
      await speakText();
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }
    if (isSpeaking) {
      stopVoice();
      setNotice('');
      return;
    }
    void play();
  };

  const safeDuration = Number.isFinite(duration) ? duration : 0;

  return (
    <section className="audio-player mt-6 rounded-xl border bg-card p-5 shadow-sm" aria-label={tk('audioPlayerLabel')}>
      {audioUrl && (
        <audio
          ref={audioRef}
          preload="metadata"
          src={audioUrl}
          onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
          onEnded={() => {
            setIsPlaying(false);
            setCurrentTime(0);
            if (hasNext) onNext?.();
          }}
          onError={() => {
            setIsPlaying(false);
            void speakText();
          }}
        />
      )}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-hindu-orange/20">
          <Music className="w-5 text-hindu-orange" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium">{title}</h3>
          <p className="text-xs text-muted-foreground">
            {usesVoice
              ? isSpeaking
                ? tk('deviceVoice')
                : tk('tapPlayToHear')
              : `${formatTime(currentTime)} / ${formatTime(safeDuration)}`}
          </p>
        </div>
      </div>
      {notice && (
        <p role="status" className="mb-3 flex items-center gap-2 rounded-md bg-muted p-2 text-sm text-muted-foreground">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="mb-3 flex items-center gap-2 rounded-md bg-destructive/10 p-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
      {!usesVoice && (
        <Slider
          value={[currentTime]}
          min={0}
          max={safeDuration || 0}
          step={0.1}
          disabled={!safeDuration}
          onValueChange={([time]) => {
            if (audioRef.current) {
              audioRef.current.currentTime = time;
              setCurrentTime(time);
            }
          }}
          aria-label={tk('seekAudio')}
        />
      )}
      <div className={`flex items-center justify-between ${usesVoice ? 'mt-2' : 'mt-4'}`}>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" disabled={!hasPrevious} onClick={onPrevious}>
            <SkipBack />
            <span className="sr-only">{tk('previousTrack')}</span>
          </Button>
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-full" onClick={togglePlay}>
            {isPlaying || isSpeaking ? <Pause /> : <Play className="ml-0.5" />}
            <span className="sr-only">{isPlaying || isSpeaking ? tk('pauseLabel') : tk('playLabel')}</span>
          </Button>
          <Button variant="ghost" size="icon" disabled={!hasNext} onClick={onNext}>
            <SkipForward />
            <span className="sr-only">{tk('nextTrack')}</span>
          </Button>
        </div>
        <div className="flex w-1/3 items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setMuted(!muted)}>
            {muted || volume === 0 ? <VolumeX /> : volume < 0.5 ? <Volume1 /> : <Volume2 />}
            <span className="sr-only">{muted ? tk('unmute') : tk('mute')}</span>
          </Button>
          <Slider
            value={[muted ? 0 : volume]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={([next]) => {
              setVolume(next);
              setMuted(next === 0);
            }}
            aria-label={tk('volumeLabel')}
          />
        </div>
      </div>
    </section>
  );
};

export default AudioPlayer;
