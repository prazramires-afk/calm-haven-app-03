import { useNavigate } from 'react-router-dom';
import { Wind, PenLine, AlertCircle, Heart, BookOpen } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { ActionCard } from '@/components/ActionCard';
import { useCheckIns } from '@/hooks/useCheckIns';
import { useJournalEntries } from '@/hooks/useJournalEntries';

export function Home() {
  const navigate = useNavigate();
  const { getWeeklySummary } = useCheckIns();
  const { entries } = useJournalEntries();
  const summary = getWeeklySummary();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <p className="text-muted-foreground text-sm mb-1">{getGreeting()}</p>
        <h1 className="text-3xl font-serif text-foreground">
          How are you feeling?
        </h1>
      </div>

      {/* Main CTA */}
      <button
        onClick={() => navigate('/quick-calm')}
        className="w-full mb-8 p-8 rounded-3xl gradient-calm border border-primary/20 shadow-glow transition-all duration-500 active:scale-[0.98] focus:outline-none animate-fade-up delay-100"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 animate-pulse-gentle">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-serif text-foreground mb-2">
            I feel anxious
          </h2>
          <p className="text-sm text-muted-foreground">
            Tap for immediate support
          </p>
        </div>
      </button>

      {/* Quick Actions */}
      <div className="space-y-3 animate-fade-up delay-200">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
          Quick Actions
        </h3>
        
        <ActionCard
          icon={Wind}
          title="Breathing Exercise"
          description="Calm your nervous system"
          onClick={() => navigate('/breathing')}
          variant="primary"
        />
        
        <ActionCard
          icon={PenLine}
          title="Write & Release"
          description="Let your thoughts flow freely"
          onClick={() => navigate('/write')}
          variant="accent"
        />
        
        <ActionCard
          icon={AlertCircle}
          title="SOS - I need help now"
          description="Immediate grounding support"
          onClick={() => navigate('/sos')}
        />

        {entries.length > 0 && (
          <ActionCard
            icon={BookOpen}
            title="Your Journal"
            description={`${entries.length} saved ${entries.length === 1 ? 'entry' : 'entries'}`}
            onClick={() => navigate('/journal')}
          />
        )}
      </div>

      {/* Weekly Summary (if available) */}
      {summary && (
        <div className="mt-8 p-5 rounded-2xl bg-secondary/50 border border-border/50 animate-fade-up delay-300">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            This week
          </h3>
          <p className="text-calm">
            You've checked in <span className="text-primary font-medium">{summary.totalCheckIns} times</span> this week.
            {summary.moodTrend === 'calm' && " You've been feeling relatively calm. Keep nurturing yourself."}
            {summary.moodTrend === 'moderate' && " There have been some ups and downs. That's perfectly normal."}
            {summary.moodTrend === 'elevated' && " It's been a challenging week. Remember, you're doing your best."}
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <p className="mt-8 text-xs text-center text-muted-foreground/70 px-4">
        This app supports anxiety relief but does not replace professional care.
      </p>
    </PageContainer>
  );
}

export default Home;
