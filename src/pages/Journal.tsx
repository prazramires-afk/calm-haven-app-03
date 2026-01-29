import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { useJournalEntries, JournalEntry } from '@/hooks/useJournalEntries';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

function JournalEntryCard({ 
  entry, 
  onDelete 
}: { 
  entry: JournalEntry; 
  onDelete: (id: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isLongContent = entry.content.length > 150;
  const displayContent = isExpanded || !isLongContent 
    ? entry.content 
    : entry.content.slice(0, 150) + '...';

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(entry.id);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-secondary/50 border border-border/50 animate-fade-up">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="text-sm text-muted-foreground">
          {format(new Date(entry.timestamp), 'MMM d, yyyy')}
          <span className="mx-2">•</span>
          {format(new Date(entry.timestamp), 'h:mm a')}
        </div>
        <button
          onClick={handleDelete}
          className={cn(
            "p-2 -m-2 rounded-xl transition-all duration-300",
            showDeleteConfirm 
              ? "bg-destructive/20 text-destructive" 
              : "text-muted-foreground hover:text-destructive"
          )}
          aria-label={showDeleteConfirm ? "Confirm delete" : "Delete entry"}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <p className="text-foreground whitespace-pre-wrap leading-relaxed">
        {displayContent}
      </p>

      {/* Expand/Collapse */}
      {isLongContent && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 mt-3 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Read more
            </>
          )}
        </button>
      )}

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <p className="mt-3 text-xs text-destructive animate-fade-in">
          Tap again to permanently delete this entry
        </p>
      )}
    </div>
  );
}

export function Journal() {
  const navigate = useNavigate();
  const { entries, deleteEntry } = useJournalEntries();

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
          Your Journal
        </h1>
        <p className="text-muted-foreground">
          Private thoughts you've saved
        </p>
      </div>

      {/* Entries list */}
      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-up">
          <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No entries yet
          </h3>
          <p className="text-muted-foreground text-sm max-w-xs mb-6">
            When you save thoughts from Write & Release, they'll appear here
          </p>
          <button
            onClick={() => navigate('/write')}
            className="calm-button-primary"
          >
            Write something
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry, index) => (
            <div 
              key={entry.id} 
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <JournalEntryCard 
                entry={entry} 
                onDelete={deleteEntry} 
              />
            </div>
          ))}
        </div>
      )}

      {/* Footer note */}
      {entries.length > 0 && (
        <div className="mt-8 text-center animate-fade-up">
          <p className="text-xs text-muted-foreground/60">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'} saved privately on your device
          </p>
        </div>
      )}
    </PageContainer>
  );
}

export default Journal;
