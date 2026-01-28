import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Eye, Hand, Wind, ExternalLink } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { cn } from '@/lib/utils';

type Exercise = 'grounding' | 'breathing';

export function SOS() {
  const navigate = useNavigate();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [groundingStep, setGroundingStep] = useState(0);

  const groundingSteps = [
    { count: 5, sense: 'see', prompt: 'Name 5 things you can see right now' },
    { count: 4, sense: 'touch', prompt: 'Name 4 things you can touch' },
    { count: 3, sense: 'hear', prompt: 'Name 3 things you can hear' },
    { count: 2, sense: 'smell', prompt: 'Name 2 things you can smell' },
    { count: 1, sense: 'taste', prompt: 'Name 1 thing you can taste' },
  ];

  if (exercise === 'grounding') {
    const step = groundingSteps[groundingStep];
    const isComplete = groundingStep >= groundingSteps.length;

    if (isComplete) {
      return (
        <PageContainer className="flex flex-col items-center justify-center gradient-calm">
          <div className="text-center animate-fade-up">
            <h2 className="text-2xl font-serif text-foreground mb-4">
              You did it
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xs mx-auto">
              You've grounded yourself back to the present moment. Take your time.
            </p>
            <button
              onClick={() => navigate('/')}
              className="calm-button-primary"
            >
              Return home
            </button>
          </div>
        </PageContainer>
      );
    }

    return (
      <PageContainer className="flex flex-col gradient-calm">
        <button
          onClick={() => setExercise(null)}
          className="self-end p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-8 animate-pulse-gentle">
            <span className="text-4xl font-serif text-accent">{step.count}</span>
          </div>
          
          <h2 className="text-xl font-serif text-foreground mb-4 animate-fade-up">
            {step.prompt}
          </h2>
          
          <p className="text-muted-foreground mb-10">
            Take your time. There's no rush.
          </p>

          <button
            onClick={() => setGroundingStep(prev => prev + 1)}
            className="calm-button-primary px-10"
          >
            Done
          </button>

          {/* Progress dots */}
          <div className="flex gap-2 mt-10">
            {groundingSteps.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  i < groundingStep ? "bg-accent" : i === groundingStep ? "bg-accent/60" : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  if (exercise === 'breathing') {
    navigate('/breathing?pattern=box&duration=2');
    return null;
  }

  return (
    <PageContainer className="gradient-calm min-h-screen">
      {/* Close button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 right-5 p-2 text-muted-foreground hover:text-foreground transition-colors safe-area-top"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main message */}
      <div className="pt-20 pb-10 text-center animate-fade-up">
        <h1 className="text-3xl font-serif text-foreground mb-4">
          You are safe right now
        </h1>
        <p className="text-muted-foreground max-w-xs mx-auto">
          Whatever you're feeling will pass. Let's take this one step at a time.
        </p>
      </div>

      {/* Exercise options */}
      <div className="space-y-4 mb-10">
        <button
          onClick={() => setExercise('grounding')}
          className={cn(
            "w-full p-6 rounded-2xl bg-card/80 border border-border/50",
            "text-left transition-all duration-300 active:scale-[0.98]",
            "animate-fade-up delay-100"
          )}
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-accent/20">
              <Hand className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">5-4-3-2-1 Grounding</h3>
              <p className="text-sm text-muted-foreground">
                Connect with your senses to anchor yourself in the present
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setExercise('breathing')}
          className={cn(
            "w-full p-6 rounded-2xl bg-card/80 border border-border/50",
            "text-left transition-all duration-300 active:scale-[0.98]",
            "animate-fade-up delay-200"
          )}
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/20">
              <Wind className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">Quick Breathing</h3>
              <p className="text-sm text-muted-foreground">
                2-minute box breathing to calm your nervous system
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Emergency resources disclaimer */}
      <div className="p-5 rounded-2xl bg-secondary/50 border border-border/50 animate-fade-up delay-300">
        <p className="text-sm text-muted-foreground mb-3">
          If you're in crisis or need immediate support, please reach out to a professional.
        </p>
        <a
          href="https://findahelpline.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors"
        >
          Find a helpline near you
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Disclaimer */}
      <p className="mt-6 text-xs text-center text-muted-foreground/70 px-4">
        This app supports anxiety relief but does not replace professional care.
      </p>
    </PageContainer>
  );
}

export default SOS;
