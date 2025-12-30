import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface PortalEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  variant?: 'default' | 'plain';
  className?: string;
}

export const PortalEmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  variant = 'default',
  className,
}: PortalEmptyStateProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8',
        variant === 'default' &&
          'bg-slate-50/50 dark:bg-slate-900/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl',
        className
      )}
    >
      <div className="relative group mb-6">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:scale-110 transition-transform duration-500" />
        <div className="relative w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-300">
          <Icon className="w-8 h-8 text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 dark:text-white font-outfit mb-2">
        {title}
      </h3>

      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium max-w-sm leading-relaxed mb-6">
        {description}
      </p>

      {action && (
        <div className="flex animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
          {action}
        </div>
      )}
    </div>
  );
};
