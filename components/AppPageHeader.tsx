import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type AppPageHeaderProps = {
  children: ReactNode;
  className?: string;
};

export default function AppPageHeader({ children, className }: AppPageHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-10 flex h-16 min-h-16 w-full min-w-0 shrink-0 items-center justify-between gap-4 border-b border-slate-200/70 bg-white/80 px-6 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80 sm:px-8',
        'shadow-[0_1px_0_0_rgba(15,23,42,0.06)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.04)]',
        className
      )}
    >
      {children}
    </header>
  );
}
