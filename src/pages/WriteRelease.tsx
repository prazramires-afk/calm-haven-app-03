import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Save, HelpCircle } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { cn } from '@/lib/utils';

type Stage = 'write' | 'reflect' | 'releasing' | 'saved';

export function WriteRelease() {
  const navigate = useNavigate();
  const { saveEntry } = useJournalEntries();
  const [content, setContent] = useState('');
  const [stage, setStage] = useState<Stage>('write');
  const [showReflection, setShowReflection] = useState(false);

  const handleRelease = () => {
    setStage('releasing');
    setTimeout(() => {
      setContent('');
      setStage('write');
      navigate('/');
    }, 1500);
  };

  const handleSave = () => {
    if (content.trim()) {
      saveEntry(content.trim());
      setStage('saved');
      setTimeout(() => {
        setContent('');
        setStage('write');
        navigate('/');
      }, 1500);
    }
  };

  if (stage === 'releasing') {
    return (
      <PageContainer className="flex flex-col items-center justify-center">
        <div className="text-center animate-fade-out-up">
          <p className="text-xl font-serif text-foreground/60 mb-4">
            Releasing...
          </p>
          <p className="text-muted-foreground max-w-xs mx-auto line-clamp-3 opacity-50">
            {content.substring(0, 100)}...
          </p>
        </div>
      </PageContainer>
    );
  }

  if (stage === 'saved') {
    return (
      <PageContainer className="flex flex-col items-center justify-center">
        <div className="text-center animate-fade-up">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Save className="w-8 h-8 text-primary" />
          </div>
          <p className="text-xl font-serif text-foreground">
            Saved privately
          </p>
          <p className="text-muted-foreground mt-2">
            Your thoughts are safe
          </p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex-shrink-0 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <h1 className="text-2xl font-serif text-foreground mb-1">
          Write & Release
        </h1>
        <p className="text-muted-foreground text-sm">
          Write everything that's on your mind. No judging.
        </p>
      </div>

      {/* Text area */}
      <div className="flex-1 min-h-0 mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing... anything that comes to mind. There's no right or wrong here."
          className={cn(
            "w-full h-full p-4 rounded-2xl resize-none",
            "bg-secondary/50 border border-border/50",
            "text-foreground placeholder:text-muted-foreground/50",
            "focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-transparent",
            "transition-all duration-300"
          )}
        />
      </div>

      {/* Reflection prompt */}
      {content.length > 50 && !showReflection && (
        <button
          onClick={() => setShowReflection(true)}
          className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-4 text-sm"
        >
          <HelpCircle className="w-4 h-4" />
          A gentle reflection
        </button>
      )}

      {showReflection && (
        <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20 mb-4 animate-fade-up">
          <p className="text-foreground/80 text-sm italic">
            "Is this something you can control right now?"
          </p>
          <button
            onClick={() => setShowReflection(false)}
            className="text-xs text-muted-foreground mt-2 hover:text-foreground"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Actions */}
      {content.trim() && (
        <div className="flex-shrink-0 flex gap-3 pb-4 animate-fade-up">
          <button
            onClick={handleRelease}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl",
              "bg-secondary/80 text-foreground border border-border/50",
              "transition-all duration-300 active:scale-[0.98]"
            )}
          >
            <Trash2 className="w-5 h-5" />
            Release
          </button>
          <button
            onClick={handleSave}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl",
              "bg-primary/20 text-primary border border-primary/30",
              "transition-all duration-300 active:scale-[0.98]"
            )}
          >
            <Save className="w-5 h-5" />
            Save privately
          </button>
        </div>
      )}
    </PageContainer>
  );
}

export default WriteRelease;
