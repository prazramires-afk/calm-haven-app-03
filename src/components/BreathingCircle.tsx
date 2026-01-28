import { useState, useEffect, useCallback } from 'react';
import { usePreferences } from '@/hooks/usePreferences';

interface BreathingCircleProps {
  pattern: 'box' | 'long-exhale' | 'silent';
  duration: number; // in minutes
  onComplete: () => void;
  isActive: boolean;
}

type Phase = 'inhale' | 'hold-in' | 'exhale' | 'hold-out';

const patterns = {
  box: { inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 },
  'long-exhale': { inhale: 4, holdIn: 2, exhale: 8, holdOut: 0 },
  silent: { inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 },
};

const phaseLabels: Record<Phase, string> = {
  'inhale': 'Breathe in',
  'hold-in': 'Hold',
  'exhale': 'Breathe out',
  'hold-out': 'Rest',
};

export function BreathingCircle({ pattern, duration, onComplete, isActive }: BreathingCircleProps) {
  const { preferences, vibrate } = usePreferences();
  const [phase, setPhase] = useState<Phase>('inhale');
  const [secondsRemaining, setSecondsRemaining] = useState(duration * 60);
  const [phaseProgress, setPhaseProgress] = useState(0);

  const currentPattern = patterns[pattern];
  
  const getPhaseDuration = useCallback((p: Phase) => {
    switch (p) {
      case 'inhale': return currentPattern.inhale;
      case 'hold-in': return currentPattern.holdIn;
      case 'exhale': return currentPattern.exhale;
      case 'hold-out': return currentPattern.holdOut;
    }
  }, [currentPattern]);

  const getNextPhase = useCallback((currentPhase: Phase): Phase => {
    const order: Phase[] = ['inhale', 'hold-in', 'exhale', 'hold-out'];
    const currentIndex = order.indexOf(currentPhase);
    let nextIndex = (currentIndex + 1) % 4;
    
    // Skip phases with 0 duration
    while (getPhaseDuration(order[nextIndex]) === 0) {
      nextIndex = (nextIndex + 1) % 4;
    }
    
    return order[nextIndex];
  }, [getPhaseDuration]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setPhaseProgress(prev => {
        const phaseDuration = getPhaseDuration(phase);
        const newProgress = prev + (100 / (phaseDuration * 10));
        
        if (newProgress >= 100) {
          const nextPhase = getNextPhase(phase);
          setPhase(nextPhase);
          if (pattern !== 'silent') {
            vibrate([30]);
          } else {
            vibrate([50, 50, 50]);
          }
          return 0;
        }
        
        return newProgress;
      });

      setSecondsRemaining(prev => {
        if (prev <= 1) {
          onComplete();
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, phase, pattern, getPhaseDuration, getNextPhase, vibrate, onComplete]);

  const getCircleScale = () => {
    const progress = phaseProgress / 100;
    switch (phase) {
      case 'inhale':
        return 1 + 0.3 * progress;
      case 'hold-in':
        return 1.3;
      case 'exhale':
        return 1.3 - 0.3 * progress;
      case 'hold-out':
        return 1;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      {/* Breathing circle */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Outer glow rings */}
        <div 
          className="absolute inset-0 rounded-full bg-primary/10 blur-xl transition-transform duration-1000"
          style={{ transform: `scale(${getCircleScale() * 1.2})` }}
        />
        <div 
          className="absolute inset-4 rounded-full bg-primary/20 blur-lg transition-transform duration-1000"
          style={{ transform: `scale(${getCircleScale() * 1.1})` }}
        />
        
        {/* Main circle */}
        <div 
          className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/40 to-accent/30 shadow-glow transition-transform duration-1000 ease-in-out"
          style={{ transform: `scale(${getCircleScale()})` }}
        />
        
        {/* Center content */}
        <div className="relative z-10 text-center">
          <p className="text-2xl font-serif text-foreground/90 mb-1">
            {phaseLabels[phase]}
          </p>
          <p className="text-sm text-muted-foreground">
            {Math.ceil(getPhaseDuration(phase) * (1 - phaseProgress / 100))}s
          </p>
        </div>
      </div>

      {/* Time remaining */}
      <div className="text-center">
        <p className="text-3xl font-light text-foreground/80 tabular-nums">
          {formatTime(secondsRemaining)}
        </p>
        <p className="text-sm text-muted-foreground mt-1">remaining</p>
      </div>
    </div>
  );
}

export default BreathingCircle;
