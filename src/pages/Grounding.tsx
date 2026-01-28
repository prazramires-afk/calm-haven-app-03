import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Check } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { cn } from '@/lib/utils';

const groundingSteps = [
  { count: 5, sense: 'see', prompt: 'Name 5 things you can see', icon: '👁️' },
  { count: 4, sense: 'touch', prompt: 'Name 4 things you can touch', icon: '✋' },
  { count: 3, sense: 'hear', prompt: 'Name 3 things you can hear', icon: '👂' },
  { count: 2, sense: 'smell', prompt: 'Name 2 things you can smell', icon: '👃' },
  { count: 1, sense: 'taste', prompt: 'Name 1 thing you can taste', icon: '👅' },
];

export function Grounding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  
  const step = groundingSteps[currentStep];
  const isComplete = currentStep >= groundingSteps.length;

  if (isComplete) {
    return (
      <PageContainer className="flex flex-col items-center justify-center gradient-calm">
        <div className="text-center animate-fade-up">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-serif text-foreground mb-4">
            You're grounded
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xs mx-auto">
            You've reconnected with the present moment. Take your time before moving on.
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
    <PageContainer className="flex flex-col gradient-calm min-h-screen">
      {/* Close button */}
      <button
        onClick={() => navigate('/')}
        className="self-end p-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        {/* Icon/Count display */}
        <div className="relative mb-8">
          <div className="w-28 h-28 rounded-full bg-accent/15 flex items-center justify-center animate-pulse-gentle">
            <span className="text-5xl">{step.icon}</span>
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-accent/30 flex items-center justify-center">
            <span className="text-lg font-serif text-accent">{step.count}</span>
          </div>
        </div>
        
        <h2 className="text-2xl font-serif text-foreground mb-3 animate-fade-up">
          {step.prompt}
        </h2>
        
        <p className="text-muted-foreground mb-10 max-w-xs">
          Look around you. Take your time to notice each one.
        </p>

        <button
          onClick={() => setCurrentStep(prev => prev + 1)}
          className="calm-button-primary px-12"
        >
          I'm ready
        </button>

        {/* Progress indicator */}
        <div className="flex gap-3 mt-12">
          {groundingSteps.map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-500",
                i < currentStep 
                  ? "bg-accent" 
                  : i === currentStep 
                    ? "bg-accent/60 scale-125" 
                    : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>
    </PageContainer>
  );
}

export default Grounding;
