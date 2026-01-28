import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Heart, Waves, AlertTriangle, Zap } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { cn } from '@/lib/utils';

type Symptom = 'racing-thoughts' | 'chest' | 'overwhelmed' | 'fear' | 'restless';

const symptoms = [
  { 
    id: 'racing-thoughts' as const, 
    icon: Brain, 
    label: 'Racing thoughts',
    description: "Can't stop thinking"
  },
  { 
    id: 'chest' as const, 
    icon: Heart, 
    label: 'Tight chest / Fast heartbeat',
    description: 'Physical tension'
  },
  { 
    id: 'overwhelmed' as const, 
    icon: Waves, 
    label: 'Overwhelmed',
    description: 'Too much at once'
  },
  { 
    id: 'fear' as const, 
    icon: AlertTriangle, 
    label: 'Fear or worry',
    description: 'Anxious anticipation'
  },
  { 
    id: 'restless' as const, 
    icon: Zap, 
    label: 'Restless',
    description: "Can't sit still"
  },
];

export function QuickCalm() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Symptom | null>(null);

  const handleSelect = (symptom: Symptom) => {
    setSelected(symptom);
    
    // Auto-navigate after brief delay for visual feedback
    setTimeout(() => {
      // Route to appropriate exercise based on symptom
      const routes: Record<Symptom, string> = {
        'racing-thoughts': '/breathing?pattern=long-exhale&duration=3',
        'chest': '/breathing?pattern=box&duration=3',
        'overwhelmed': '/grounding',
        'fear': '/breathing?pattern=box&duration=5',
        'restless': '/breathing?pattern=long-exhale&duration=2',
      };
      navigate(routes[symptom]);
    }, 300);
  };

  return (
    <PageContainer>
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm">Back</span>
      </button>

      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <h1 className="text-2xl font-serif text-foreground mb-2">
          What feels strongest right now?
        </h1>
        <p className="text-muted-foreground">
          Tap one to begin
        </p>
      </div>

      {/* Symptom options */}
      <div className="space-y-3">
        {symptoms.map((symptom, index) => {
          const Icon = symptom.icon;
          const isSelected = selected === symptom.id;
          
          return (
            <button
              key={symptom.id}
              onClick={() => handleSelect(symptom.id)}
              className={cn(
                "w-full p-5 rounded-2xl border transition-all duration-300",
                "active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-ring/50",
                "animate-fade-up",
                isSelected
                  ? "bg-primary/20 border-primary/30 scale-[1.02]"
                  : "bg-secondary/50 border-border/50 hover:bg-secondary"
              )}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-3 rounded-xl transition-colors",
                  isSelected ? "bg-primary/30" : "bg-muted"
                )}>
                  <Icon className={cn(
                    "w-6 h-6 transition-colors",
                    isSelected ? "text-primary" : "text-foreground/70"
                  )} />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-foreground">
                    {symptom.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {symptom.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </PageContainer>
  );
}

export default QuickCalm;
