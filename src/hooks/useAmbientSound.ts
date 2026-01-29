import { useRef, useCallback, useEffect } from 'react';
import { usePreferences } from './usePreferences';

type AmbientSound = 'rain' | 'brown-noise' | 'wind-chime' | 'singing-bowl' | 'silence';

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

  // Generate wind chime sound buffer
  const generateWindChime = useCallback((context: AudioContext): AudioBuffer => {
    const bufferSize = context.sampleRate * 10;
    const buffer = context.createBuffer(2, bufferSize, context.sampleRate);
    
    // Wind chime frequencies (pentatonic scale for pleasant harmonics)
    const chimeFreqs = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
    
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      
      // Create multiple chime hits throughout the buffer
      const numChimes = 15;
      for (let c = 0; c < numChimes; c++) {
        const startSample = Math.floor(Math.random() * (bufferSize - context.sampleRate));
        const freq = chimeFreqs[Math.floor(Math.random() * chimeFreqs.length)];
        const duration = context.sampleRate * (0.8 + Math.random() * 1.5);
        
        for (let i = 0; i < duration && (startSample + i) < bufferSize; i++) {
          const t = i / context.sampleRate;
          // Exponential decay envelope
          const envelope = Math.exp(-t * 3);
          // Sine wave with slight harmonics
          const sample = Math.sin(2 * Math.PI * freq * t) * 0.5 +
                        Math.sin(2 * Math.PI * freq * 2 * t) * 0.2 +
                        Math.sin(2 * Math.PI * freq * 3 * t) * 0.1;
          data[startSample + i] += sample * envelope * 0.15;
        }
      }
    }
    
    return buffer;
  }, []);

  // Generate singing bowl sound buffer
  const generateSingingBowl = useCallback((context: AudioContext): AudioBuffer => {
    const bufferSize = context.sampleRate * 10;
    const buffer = context.createBuffer(2, bufferSize, context.sampleRate);
    
    // Singing bowl fundamental frequency (around 200Hz for a deep bowl)
    const fundamental = 196; // G3
    
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      
      for (let i = 0; i < bufferSize; i++) {
        const t = i / context.sampleRate;
        
        // Slow amplitude modulation for "beating" effect
        const ampMod = 0.8 + 0.2 * Math.sin(2 * Math.PI * 0.5 * t);
        
        // Slight pitch wobble for organic feel
        const pitchMod = 1 + 0.002 * Math.sin(2 * Math.PI * 0.3 * t);
        
        // Rich harmonic content typical of singing bowls
        const sample = 
          Math.sin(2 * Math.PI * fundamental * pitchMod * t) * 0.4 +
          Math.sin(2 * Math.PI * fundamental * 2 * pitchMod * t) * 0.25 +
          Math.sin(2 * Math.PI * fundamental * 3 * pitchMod * t) * 0.15 +
          Math.sin(2 * Math.PI * fundamental * 4.2 * pitchMod * t) * 0.1 +
          Math.sin(2 * Math.PI * fundamental * 5.4 * pitchMod * t) * 0.05;
        
        data[i] = sample * ampMod * 0.4;
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
      
      switch (soundType) {
        case 'brown-noise':
          buffer = noiseBufferRef.current || generateBrownNoise(context);
          noiseBufferRef.current = buffer;
          break;
        case 'wind-chime':
          buffer = generateWindChime(context);
          break;
        case 'singing-bowl':
          buffer = generateSingingBowl(context);
          break;
        default:
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
  }, [preferences.soundEnabled, getAudioContext, generateBrownNoise, generateRainSound, generateWindChime, generateSingingBowl]);

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
