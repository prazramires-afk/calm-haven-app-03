import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Check, CloudRain, Volume2, VolumeX, Wind, Music } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { BreathingCircle } from '@/components/BreathingCircle';
import { usePreferences } from '@/hooks/usePreferences';
import { useAmbientSound } from '@/hooks/useAmbientSound';
import { cn } from '@/lib/utils';

type Pattern = 'box' | 'long-exhale' | 'silent';
type AmbientSound = 'rain' | 'brown-noise' | 'wind-chime' | 'singing-bowl' | 'silence';

const patterns: { id: Pattern; label: string; description: string }[] = [
  { id: 'box', label: 'Box Calm', description: '4-4-4-4 pattern' },
  { id: 'long-exhale', label: 'Long Exhale', description: 'Extended out-breath' },
  { id: 'silent', label: 'Silent Mode', description: 'Vibration only' },
];

const ambientSounds: { id: AmbientSound; label: string; icon: typeof CloudRain }[] = [
  { id: 'silence', label: 'Silence', icon: VolumeX },
  { id: 'rain', label: 'Rain', icon: CloudRain },
  { id: 'brown-noise', label: 'Brown', icon: Volume2 },
  { id: 'wind-chime', label: 'Chime', icon: Wind },
  { id: 'singing-bowl', label: 'Bowl', icon: Music },
];

const durations = [2, 3, 5];

export function Breathing() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { preferences, updatePreference } = usePreferences();
  const { play: playAmbient, stop: stopAmbient } = useAmbientSound();

  const initialPattern = (searchParams.get('pattern') as Pattern) || 'box';
  const initialDuration = parseInt(searchParams.get('duration') || String(preferences.preferredDuration)) || 3;

  const [pattern, setPattern] = useState<Pattern>(initialPattern);
  const [duration, setDuration] = useState(initialDuration);
  const [ambientSound, setAmbientSound] = useState<AmbientSound>(preferences.ambientSound);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Auto-start if coming from Quick Calm
  useEffect(() => {
    if (searchParams.get('pattern')) {
      const timer = setTimeout(() => setIsActive(true), 500);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  // Start/stop ambient sound based on session state
  useEffect(() => {
    if (isActive && ambientSound !== 'silence') {
      playAmbient(ambientSound);
    } else {
      stopAmbient();
    }
    
    return () => {
      stopAmbient();
    };
  }, [isActive, ambientSound, playAmbient, stopAmbient]);

  const handleAmbientChange = (sound: AmbientSound) => {
    setAmbientSound(sound);
    updatePreference('ambientSound', sound);
  };

  const handleComplete = () => {
    setIsActive(false);
    setIsComplete(true);
    stopAmbient();
  };

  const handleReset = () => {
    setIsActive(false);
    setIsComplete(false);
  };

  const handlePause = () => {
    setIsActive(false);
    stopAmbient();
  };

  if (isComplete) {
    return (
      <PageContainer className="flex flex-col items-center justify-center">
        <div className="text-center animate-fade-up">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-serif text-foreground mb-3">
            Well done
          </h1>
          <p className="text-muted-foreground mb-8 max-w-xs mx-auto">
            Take a moment to notice how you feel. There's no rush.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleReset}
              className="calm-button-primary w-full max-w-xs"
            >
              Another session
            </button>
            <button
              onClick={() => navigate('/')}
              className="calm-button-ghost w-full max-w-xs"
            >
              Return home
            </button>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (isActive) {
    return (
      <PageContainer className="flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handlePause}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Pause className="w-5 h-5" />
            <span className="text-sm">Pause</span>
          </button>
          
          {/* Ambient sound indicator */}
          {ambientSound !== 'silence' && (
            <div className="flex items-center gap-2 text-muted-foreground">
              {ambientSound === 'rain' && <CloudRain className="w-4 h-4" />}
              {ambientSound === 'brown-noise' && <Volume2 className="w-4 h-4" />}
              {ambientSound === 'wind-chime' && <Wind className="w-4 h-4" />}
              {ambientSound === 'singing-bowl' && <Music className="w-4 h-4" />}
              <span className="text-xs capitalize">{ambientSound.replace('-', ' ')}</span>
            </div>
          )}
        </div>

        <div className="flex-1 flex items-center justify-center">
          <BreathingCircle
            pattern={pattern}
            duration={duration}
            onComplete={handleComplete}
            isActive={isActive}
          />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm">Back</span>
      </button>

      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <h1 className="text-2xl font-serif text-foreground mb-2">
          Breathing Exercise
        </h1>
        <p className="text-muted-foreground">
          Choose your style and duration
        </p>
      </div>

      {/* Pattern selection */}
      <div className="mb-6 animate-fade-up delay-100">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
          Breathing Pattern
        </h3>
        <div className="space-y-2">
          {patterns.map((p) => (
            <button
              key={p.id}
              onClick={() => setPattern(p.id)}
              className={cn(
                "w-full p-4 rounded-2xl border text-left transition-all duration-300",
                "active:scale-[0.98] focus:outline-none",
                pattern === p.id
                  ? "bg-primary/15 border-primary/30"
                  : "bg-secondary/50 border-border/50 hover:bg-secondary"
              )}
            >
              <h4 className="font-medium text-foreground">{p.label}</h4>
              <p className="text-sm text-muted-foreground">{p.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Ambient Sound selection */}
      <div className="mb-6 animate-fade-up delay-150">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
          Ambient Sound
        </h3>
        <div className="flex gap-2">
          {ambientSounds.map((sound) => {
            const Icon = sound.icon;
            return (
              <button
                key={sound.id}
                onClick={() => handleAmbientChange(sound.id)}
                className={cn(
                  "flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl border transition-all duration-300",
                  "active:scale-[0.98] focus:outline-none",
                  ambientSound === sound.id
                    ? "bg-accent/15 border-accent/30"
                    : "bg-secondary/50 border-border/50 hover:bg-secondary"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5",
                  ambientSound === sound.id ? "text-accent" : "text-muted-foreground"
                )} />
                <span className={cn(
                  "text-xs",
                  ambientSound === sound.id ? "text-accent" : "text-muted-foreground"
                )}>
                  {sound.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration selection */}
      <div className="mb-10 animate-fade-up delay-200">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
          Duration
        </h3>
        <div className="flex gap-3">
          {durations.map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={cn(
                "flex-1 py-4 rounded-2xl border text-center transition-all duration-300",
                "active:scale-[0.98] focus:outline-none",
                duration === d
                  ? "bg-primary/15 border-primary/30 text-primary"
                  : "bg-secondary/50 border-border/50 text-foreground hover:bg-secondary"
              )}
            >
              <span className="text-lg font-medium">{d}</span>
              <span className="text-sm text-muted-foreground ml-1">min</span>
            </button>
          ))}
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={() => setIsActive(true)}
        className="calm-button-primary w-full flex items-center justify-center gap-3 animate-fade-up delay-300"
      >
        <Play className="w-5 h-5" />
        Begin Session
      </button>
    </PageContainer>
  );
}

export default Breathing;
