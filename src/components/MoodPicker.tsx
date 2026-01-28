import { cn } from '@/lib/utils';

interface MoodPickerProps {
  value: 1 | 2 | 3 | 4 | 5 | null;
  onChange: (mood: 1 | 2 | 3 | 4 | 5) => void;
}

const moods = [
  { value: 1 as const, emoji: '😌', label: 'Calm' },
  { value: 2 as const, emoji: '😐', label: 'Okay' },
  { value: 3 as const, emoji: '😟', label: 'Uneasy' },
  { value: 4 as const, emoji: '😣', label: 'Anxious' },
  { value: 5 as const, emoji: '😰', label: 'Very anxious' },
];

export function MoodPicker({ value, onChange }: MoodPickerProps) {
  return (
    <div className="flex justify-center gap-3">
      {moods.map((mood) => (
        <button
          key={mood.value}
          onClick={() => onChange(mood.value)}
          className={cn(
            "flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300",
            "active:scale-95 focus:outline-none focus:ring-2 focus:ring-ring/50",
            value === mood.value
              ? "bg-primary/20 scale-110 shadow-soft"
              : "bg-secondary/50 hover:bg-secondary"
          )}
          aria-label={mood.label}
        >
          <span className="text-3xl" role="img" aria-hidden="true">
            {mood.emoji}
          </span>
          <span className={cn(
            "text-xs transition-opacity",
            value === mood.value ? "text-foreground opacity-100" : "text-muted-foreground opacity-0"
          )}>
            {mood.label}
          </span>
        </button>
      ))}
    </div>
  );
}

export default MoodPicker;
