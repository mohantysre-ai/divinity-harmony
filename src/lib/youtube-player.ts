/**
 * Minimal wrapper around YouTube's own IFrame Player API.
 *
 * This loads YouTube's `iframe_api` script and controls YouTube's own
 * embedded player (play/pause/seek/volume). It does not download, extract,
 * or proxy YouTube media in any way — same "embed, don't rip" approach the
 * live-darshan feature already uses for temple streams.
 *
 * Docs: https://developers.google.com/youtube/iframe_api_reference
 */

export type YTPlayerState = -1 | 0 | 1 | 2 | 3 | 5;

export interface YTPlayerInstance {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  setVolume(volume: number): void;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): YTPlayerState;
  loadVideoById(videoId: string): void;
  destroy(): void;
}

interface YTPlayerEvent {
  target: YTPlayerInstance;
}

interface YTPlayerStateChangeEvent extends YTPlayerEvent {
  data: YTPlayerState;
}

export interface YTNamespace {
  Player: new (
    element: HTMLElement | string,
    options: {
      videoId: string;
      height?: string | number;
      width?: string | number;
      playerVars?: Record<string, number | string>;
      events?: {
        onReady?: (event: YTPlayerEvent) => void;
        onStateChange?: (event: YTPlayerStateChangeEvent) => void;
        onError?: (event: { data: number }) => void;
      };
    },
  ) => YTPlayerInstance;
  PlayerState: {
    ENDED: 0;
    PLAYING: 1;
    PAUSED: 2;
    BUFFERING: 3;
    CUED: 5;
  };
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiLoadPromise: Promise<YTNamespace> | null = null;

/** Loads the YouTube IFrame API script once and resolves when window.YT is ready. */
export function loadYouTubeIframeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiLoadPromise) return apiLoadPromise;

  apiLoadPromise = new Promise((resolve, reject) => {
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve(window.YT as YTNamespace);
    };
    if (!document.getElementById('youtube-iframe-api')) {
      const script = document.createElement('script');
      script.id = 'youtube-iframe-api';
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.onerror = () => {
        apiLoadPromise = null;
        reject(new Error('YouTube IFrame API failed to load'));
      };
      document.head.appendChild(script);
    }
  });

  return apiLoadPromise;
}
