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

function playWoodKnock(context: AudioContext, volume = 0.05, startAt = 0, accent = 1) {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  const filter = context.createBiquadFilter();
  const bufferSize = Math.max(1, Math.floor(context.sampleRate * 0.04));
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const channel = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i += 1) {
    channel[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const noiseSource = context.createBufferSource();
  noiseSource.buffer = buffer;

  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1200 + accent * 250, context.currentTime + startAt);
  filter.Q.setValueAtTime(1.4, context.currentTime + startAt);

  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(180 + accent * 28, context.currentTime + startAt);
  oscillator.frequency.exponentialRampToValueAtTime(70 + accent * 8, context.currentTime + startAt + 0.07);

  gainNode.gain.setValueAtTime(0.0001, context.currentTime + startAt);
  gainNode.gain.exponentialRampToValueAtTime(volume, context.currentTime + startAt + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + startAt + 0.08);

  oscillator.connect(gainNode);
  noiseSource.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(context.currentTime + startAt);
  oscillator.stop(context.currentTime + startAt + 0.09);
  noiseSource.start(context.currentTime + startAt);
  noiseSource.stop(context.currentTime + startAt + 0.05);
}

function playSound(context: AudioContext, kind: SoundKind) {
  switch (kind) {
    case 'move':
      playWoodKnock(context, 0.045, 0, 1);
      break;
    case 'capture':
      playWoodKnock(context, 0.055, 0, 1.4);
      playTone(context, 240, 0.08, 0.02, 'triangle', 0.01);
      break;
    case 'check':
      playWoodKnock(context, 0.05, 0, 1.2);
      playTone(context, 880, 0.05, 0.02, 'square', 0.025);
      break;
    case 'castle':
      playWoodKnock(context, 0.04, 0, 0.8);
      playWoodKnock(context, 0.04, 0.045, 1.1);
      break;
    case 'promotion':
      playWoodKnock(context, 0.045, 0, 1);
      playTone(context, 660, 0.05, 0.02, 'triangle', 0.03);
      playTone(context, 920, 0.06, 0.018, 'triangle', 0.06);
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
