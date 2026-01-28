import { useRef, useCallback, useEffect } from 'react';
import { usePreferences } from './usePreferences';

type AmbientSound = 'rain' | 'brown-noise' | 'silence';

export function useAmbientSound() {
  const { preferences } = usePreferences();
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const noiseBufferRef = useRef<AudioBuffer | null>(null);
  const isPlayingRef = useRef(false);

  // Generate brown noise buffer
  const generateBrownNoise = useCallback((context: AudioContext): AudioBuffer => {
    const bufferSize = context.sampleRate * 10; // 10 seconds of audio
    const buffer = context.createBuffer(2, bufferSize, context.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let lastOut = 0;
      
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brown noise filter
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; // Amplify
      }
    }
    
    return buffer;
  }, []);

  // Generate rain-like sound buffer
  const generateRainSound = useCallback((context: AudioContext): AudioBuffer => {
    const bufferSize = context.sampleRate * 10;
    const buffer = context.createBuffer(2, bufferSize, context.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      
      for (let i = 0; i < bufferSize; i++) {
        // Layered noise for rain effect
        const noise = Math.random() * 2 - 1;
        // Add some randomness to simulate rain drops
        const dropChance = Math.random();
        const drop = dropChance > 0.997 ? (Math.random() * 0.5) : 0;
        
        // Pink-ish noise filter for softer rain sound
        data[i] = (noise * 0.3 + drop) * 0.5;
        
        // Add gentle modulation
        data[i] *= 0.8 + Math.sin(i / (context.sampleRate * 0.5)) * 0.2;
      }
    }
    
    return buffer;
  }, []);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const play = useCallback((soundType: AmbientSound, fadeInDuration = 2) => {
    if (!preferences.soundEnabled || soundType === 'silence') {
      return;
    }

    try {
      const context = getAudioContext();
      
      // Resume context if suspended (needed for mobile)
      if (context.state === 'suspended') {
        context.resume();
      }

      // Stop any existing sound
      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.stop();
        } catch (e) {
          // Already stopped
        }
      }

      // Create gain node for volume control and fade
      const gainNode = context.createGain();
      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + fadeInDuration);
      gainNode.connect(context.destination);
      gainNodeRef.current = gainNode;

      // Generate and play the appropriate sound
      let buffer: AudioBuffer;
      
      if (soundType === 'brown-noise') {
        buffer = noiseBufferRef.current || generateBrownNoise(context);
        noiseBufferRef.current = buffer;
      } else {
        buffer = generateRainSound(context);
      }

      const source = context.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(gainNode);
      source.start();
      
      sourceNodeRef.current = source;
      isPlayingRef.current = true;
    } catch (error) {
      console.warn('Failed to play ambient sound:', error);
    }
  }, [preferences.soundEnabled, getAudioContext, generateBrownNoise, generateRainSound]);

  const stop = useCallback((fadeOutDuration = 1.5) => {
    if (!isPlayingRef.current) return;

    try {
      const context = audioContextRef.current;
      const gainNode = gainNodeRef.current;
      const source = sourceNodeRef.current;

      if (context && gainNode && source) {
        // Fade out
        gainNode.gain.linearRampToValueAtTime(0, context.currentTime + fadeOutDuration);
        
        // Stop after fade out
        setTimeout(() => {
          try {
            source.stop();
          } catch (e) {
            // Already stopped
          }
          sourceNodeRef.current = null;
          isPlayingRef.current = false;
        }, fadeOutDuration * 1000);
      }
    } catch (error) {
      console.warn('Failed to stop ambient sound:', error);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.stop();
        } catch (e) {
          // Already stopped
        }
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return { play, stop, isPlaying: isPlayingRef.current };
}

export default useAmbientSound;
