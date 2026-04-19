'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';

type SoundKind = 'move' | 'capture' | 'notify';

const SOUND_URLS: Record<SoundKind, string> = {
  move: 'https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-self.mp3',
  capture: 'https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/capture.mp3',
  notify: 'https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/notify.mp3',
};

function createAudio(url: string) {
  const audio = new Audio(url);
  audio.preload = 'auto';
  audio.volume = 0.85;
  return audio;
}

export function useChessSound(enabled = true) {
  const audioRefs = useRef<Partial<Record<SoundKind, HTMLAudioElement>>>({});

  const kinds = useMemo<SoundKind[]>(() => ['move', 'capture', 'notify'], []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    kinds.forEach((kind) => {
      audioRefs.current[kind] = createAudio(SOUND_URLS[kind]);
    });

    return () => {
      kinds.forEach((kind) => {
        audioRefs.current[kind] = undefined;
      });
    };
  }, [kinds]);

  const playSound = useCallback((kind: SoundKind) => {
    if (!enabled) {
      return;
    }

    const audio = audioRefs.current[kind];
    if (!audio) {
      return;
    }

    try {
      audio.currentTime = 0;
      const maybePromise = audio.play();
      if (maybePromise) {
        void maybePromise.catch(() => {
          // Ignore autoplay/permission failures.
        });
      }
    } catch {
      // Ignore audio errors so move handling is never blocked.
    }
  }, [enabled]);

  const playMoveSound = useCallback((isCapture: boolean = false, isCheck: boolean = false, isCastle: boolean = false, isPromotion: boolean = false) => {
    const kind: SoundKind = isCapture ? 'capture' : (isCheck || isCastle || isPromotion ? 'notify' : 'move');
    playSound(kind);
  }, [playSound]);

  return { playMoveSound };
}
