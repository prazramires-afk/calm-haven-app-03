import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function PageContainer({ children, className, noPadding }: PageContainerProps) {
  return (
    <div 
      className={cn(
        "min-h-screen pb-24 safe-area-top",
        !noPadding && "px-5 pt-6",
        className
      )}
    >
      {children}
    </div>
  );
}

export default PageContainer;
