import { useCallback, useEffect, useRef, useState } from 'react';
import { loadYouTubeIframeApi, type YTPlayerInstance } from '@/lib/youtube-player';

interface UseYouTubeAudioOptions {
  videoId?: string;
  autoplay?: boolean;
  onEnded?: () => void;
}

/**
 * Plays a specific YouTube video (a chanted mantra/stotra recording) and
 * exposes the same play/pause/seek/volume/time shape AudioPlayer already
 * uses for the native <audio> element, so the UI doesn't need two designs.
 */
export function useYouTubeAudio({ videoId, autoplay = false, onEnded }: UseYouTubeAudioOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayerInstance | null>(null);
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;
  // Play can be tapped before the async iframe API finishes loading — remember
  // the request and honor it as soon as the player reports ready.
  const wantsPlayRef = useRef(false);

  const [ready, setReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!videoId || !containerRef.current) return;
    let cancelled = false;
    setReady(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setError('');
    wantsPlayRef.current = autoplay;

    loadYouTubeIframeApi()
      .then((YT) => {
        if (cancelled || !containerRef.current) return;
        playerRef.current?.destroy();
        playerRef.current = new YT.Player(containerRef.current, {
          videoId,
          height: '100%',
          width: '100%',
          playerVars: { autoplay: autoplay ? 1 : 0, playsinline: 1, rel: 0, modestbranding: 1, origin: window.location.origin },
          events: {
            onReady: () => {
              setReady(true);
              setDuration(playerRef.current?.getDuration() || 0);
              if (wantsPlayRef.current) playerRef.current?.playVideo();
            },
            onStateChange: (event) => {
              if (event.data === YT.PlayerState.PLAYING) setIsPlaying(true);
              else if (event.data === YT.PlayerState.PAUSED) setIsPlaying(false);
              else if (event.data === YT.PlayerState.ENDED) {
                setIsPlaying(false);
                onEndedRef.current?.();
              }
            },
            onError: () => setError('playback-error'),
          },
        });
      })
      .catch(() => {
        if (!cancelled) setError('load-error');
      });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [autoplay, videoId]);

  // The IFrame API doesn't push time updates — poll lightly while playing.
  useEffect(() => {
    if (!ready || !isPlaying) return;
    const id = window.setInterval(() => {
      const player = playerRef.current;
      if (!player) return;
      setCurrentTime(player.getCurrentTime() || 0);
      setDuration(player.getDuration() || 0);
    }, 250);
    return () => window.clearInterval(id);
  }, [ready, isPlaying]);

  const play = useCallback(() => {
    wantsPlayRef.current = true;
    playerRef.current?.playVideo();
  }, []);
  const pause = useCallback(() => {
    wantsPlayRef.current = false;
    playerRef.current?.pauseVideo();
  }, []);
  const seekTo = useCallback((seconds: number) => playerRef.current?.seekTo(seconds, true), []);
  const setVolume = useCallback((volume0to1: number) => {
    playerRef.current?.setVolume(Math.round(Math.max(0, Math.min(1, volume0to1)) * 100));
  }, []);

  return { containerRef, ready, isPlaying, currentTime, duration, error, play, pause, seekTo, setVolume };
}
