import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'accent';
  size?: 'default' | 'large';
}

export function ActionCard({ 
  icon: Icon, 
  title, 
  description, 
  onClick, 
  variant = 'default',
  size = 'default'
}: ActionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-2xl transition-all duration-300",
        "active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-ring/50",
        size === 'large' ? "p-6" : "p-4",
        variant === 'primary' && "bg-primary/15 hover:bg-primary/20 border border-primary/20",
        variant === 'accent' && "bg-accent/15 hover:bg-accent/20 border border-accent/20",
        variant === 'default' && "bg-secondary/50 hover:bg-secondary border border-border/50"
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          "p-3 rounded-xl",
          variant === 'primary' && "bg-primary/20",
          variant === 'accent' && "bg-accent/20",
          variant === 'default' && "bg-muted"
        )}>
          <Icon className={cn(
            "w-5 h-5",
            variant === 'primary' && "text-primary",
            variant === 'accent' && "text-accent",
            variant === 'default' && "text-foreground/70"
          )} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-medium text-foreground",
            size === 'large' && "text-lg"
          )}>
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

export default ActionCard;
