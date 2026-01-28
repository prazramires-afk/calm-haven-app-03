import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { MoodPicker } from '@/components/MoodPicker';
import { useCheckIns, CheckIn as CheckInType } from '@/hooks/useCheckIns';
import { cn } from '@/lib/utils';

export function CheckIn() {
  const navigate = useNavigate();
  const { addCheckIn } = useCheckIns();
  const [mood, setMood] = useState<CheckInType['mood'] | null>(null);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (mood) {
      addCheckIn(mood, note.trim() || undefined);
      setSaved(true);
      setTimeout(() => navigate('/'), 1500);
    }
  };

  if (saved) {
    return (
      <PageContainer className="flex flex-col items-center justify-center">
        <div className="text-center animate-fade-up">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <p className="text-xl font-serif text-foreground">
            Check-in saved
          </p>
          <p className="text-muted-foreground mt-2">
            Thank you for checking in
          </p>
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
      <div className="text-center mb-10 animate-fade-up">
        <h1 className="text-2xl font-serif text-foreground mb-2">
          How are you feeling?
        </h1>
        <p className="text-muted-foreground">
          This is just for you
        </p>
      </div>

      {/* Mood picker */}
      <div className="mb-10 animate-fade-up delay-100">
        <MoodPicker value={mood} onChange={setMood} />
      </div>

      {/* Optional note */}
      {mood && (
        <div className="mb-8 animate-fade-up">
          <label className="block text-sm text-muted-foreground mb-2">
            Anything else you'd like to note? (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="A few words..."
            rows={3}
            className={cn(
              "w-full p-4 rounded-2xl resize-none",
              "bg-secondary/50 border border-border/50",
              "text-foreground placeholder:text-muted-foreground/50",
              "focus:outline-none focus:ring-2 focus:ring-ring/30"
            )}
          />
        </div>
      )}

      {/* Save button */}
      {mood && (
        <button
          onClick={handleSave}
          className="calm-button-primary w-full animate-fade-up"
        >
          Save check-in
        </button>
      )}
    </PageContainer>
  );
}

export default CheckIn;
