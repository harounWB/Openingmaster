'use client';

import { useCallback, useEffect, useRef } from 'react';

type SoundKind = 'move' | 'capture' | 'check' | 'castle' | 'promotion';

function createAudioContext() {
  const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  return AudioContextCtor ? new AudioContextCtor() : null;
}

function playTone(
  context: AudioContext,
  frequency: number,
  duration: number,
  volume: number,
  type: OscillatorType = 'sine',
  startAt = 0
) {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, context.currentTime + startAt);

  gainNode.gain.setValueAtTime(0.0001, context.currentTime + startAt);
  gainNode.gain.exponentialRampToValueAtTime(volume, context.currentTime + startAt + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + startAt + duration);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(context.currentTime + startAt);
  oscillator.stop(context.currentTime + startAt + duration + 0.03);
}

function playSound(context: AudioContext, kind: SoundKind) {
  switch (kind) {
    case 'move':
      playTone(context, 620, 0.08, 0.04, 'triangle');
      break;
    case 'capture':
      playTone(context, 520, 0.07, 0.05, 'triangle');
      playTone(context, 360, 0.12, 0.035, 'sine', 0.03);
      break;
    case 'check':
      playTone(context, 740, 0.06, 0.05, 'square');
      playTone(context, 980, 0.08, 0.03, 'square', 0.05);
      break;
    case 'castle':
      playTone(context, 480, 0.06, 0.04, 'triangle');
      playTone(context, 680, 0.09, 0.04, 'triangle', 0.05);
      break;
    case 'promotion':
      playTone(context, 440, 0.06, 0.04, 'sine');
      playTone(context, 660, 0.06, 0.04, 'sine', 0.04);
      playTone(context, 880, 0.08, 0.035, 'sine', 0.08);
      break;
  }
}

export function useChessSound(enabled = true) {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      audioContextRef.current?.close().catch(() => {
        // Ignore shutdown errors.
      });
      audioContextRef.current = null;
    };
  }, []);

  const ensureContext = useCallback(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = createAudioContext();
    }

    const context = audioContextRef.current;
    if (!context) {
      return null;
    }

    if (context.state === 'suspended') {
      void context.resume().catch(() => {
        // Ignore resume failures.
      });
    }

    return context;
  }, []);

  const playMoveSound = useCallback((isCapture: boolean = false, isCheck: boolean = false, isCastle: boolean = false, isPromotion: boolean = false) => {
    if (!enabled) {
      return;
    }

    try {
      const context = ensureContext();
      if (!context) {
        return;
      }

      const kind: SoundKind = isPromotion
        ? 'promotion'
        : isCastle
          ? 'castle'
          : isCheck
            ? 'check'
            : isCapture
              ? 'capture'
              : 'move';

      playSound(context, kind);
    } catch {
      // Ignore audio errors so move handling is never blocked.
    }
  }, [enabled, ensureContext]);

  return { playMoveSound };
}
