'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import {
  Circle,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Milestone,
  MilestoneStatus,
  MILESTONE_STATUS,
  MILESTONE_STATUS_CONFIG
} from '@/lib/types/portal';
import { Timestamp } from 'firebase/firestore';

interface MilestoneTimelineProps {
  milestones: Milestone[];
  currentMilestoneId?: string;
  isAgency?: boolean;
  onMilestoneClick?: (milestone: Milestone) => void;
  className?: string;
}

const StatusIcon: React.FC<{ status: MilestoneStatus; size?: number }> = ({ status, size = 20 }) => {
  switch (status) {
    case MILESTONE_STATUS.COMPLETED:
      return <CheckCircle2 size={size} className="text-green-600 dark:text-green-400" />;
    case MILESTONE_STATUS.IN_PROGRESS:
      return <Loader2 size={size} className="text-blue-600 dark:text-blue-400 animate-spin" />;
    case MILESTONE_STATUS.BLOCKED:
      return <AlertCircle size={size} className="text-red-600 dark:text-red-400" />;
    default:
      return <Circle size={size} className="text-surface-400" />;
  }
};

const formatDate = (timestamp: Timestamp | undefined, locale: string): string => {
  if (!timestamp) return '';
  const date = timestamp.toDate();
  return date.toLocaleDateString(locale === 'he' ? 'he-IL' : 'en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({
  milestones,
  currentMilestoneId,
  isAgency = false,
  onMilestoneClick,
  className,
}) => {
  const locale = useLocale();
  const isHe = locale === 'he';

  // Sort milestones by order
  const sortedMilestones = [...milestones].sort((a, b) => a.order - b.order);

  // Calculate progress
  const completedCount = sortedMilestones.filter(m => m.status === MILESTONE_STATUS.COMPLETED).length;
  const progress = sortedMilestones.length > 0 ? (completedCount / sortedMilestones.length) * 100 : 0;

  if (sortedMilestones.length === 0) {
    return (
      <div className={cn('p-4 text-center text-surface-500', className)}>
        {isHe ? 'אין שלבי פרויקט מוגדרים' : 'No milestones defined yet'}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Progress Summary */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-surface-900 dark:text-white">
            {isHe ? 'התקדמות הפרויקט' : 'Project Progress'}
          </h3>
          <p className="text-sm text-surface-500">
            {completedCount} / {sortedMilestones.length} {isHe ? 'שלבים הושלמו' : 'milestones completed'}
          </p>
        </div>
        <div className="text-2xl font-bold text-accent-600 dark:text-accent-400">
          {Math.round(progress)}%
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>

      {/* Milestones List */}
      <div className="relative mt-8">
        {/* Vertical line connector */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-surface-200 dark:bg-surface-700"
          style={{ left: isHe ? 'auto' : '15px', right: isHe ? '15px' : 'auto' }}
        />

        <div className="space-y-4">
          {sortedMilestones.map((milestone, index) => {
            const config = MILESTONE_STATUS_CONFIG[milestone.status];
            const isCurrent = milestone.id === currentMilestoneId;
            const isClickable = isAgency && onMilestoneClick;

            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: isHe ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'relative flex items-start gap-4',
                  isHe ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                {/* Status Icon */}
                <div
                  className={cn(
                    'relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                    config.bgColor,
                    isCurrent && 'ring-2 ring-accent-500 ring-offset-2 ring-offset-white dark:ring-offset-surface-900'
                  )}
                >
                  <StatusIcon status={milestone.status} size={18} />
                </div>

                {/* Content */}
                <div
                  className={cn(
                    'flex-1 p-4 rounded-xl border transition-all',
                    isCurrent
                      ? 'bg-accent-50 dark:bg-accent-950/20 border-accent-200 dark:border-accent-800'
                      : 'bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700',
                    isClickable && 'cursor-pointer hover:border-accent-300 dark:hover:border-accent-700'
                  )}
                  onClick={() => isClickable && onMilestoneClick(milestone)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-surface-900 dark:text-white">
                          {milestone.title}
                        </h4>
                        {isCurrent && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent-500 text-white">
                            {isHe ? 'נוכחי' : 'Current'}
                          </span>
                        )}
                      </div>

                      {milestone.description && (
                        <p className="text-sm text-surface-600 dark:text-surface-400 mb-2">
                          {milestone.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-surface-500">
                        {milestone.dueDate && (
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {isHe ? 'יעד:' : 'Due:'} {formatDate(milestone.dueDate, locale)}
                          </span>
                        )}
                        {milestone.completedAt && (
                          <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <CheckCircle2 size={12} />
                            {formatDate(milestone.completedAt, locale)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={cn(
                        'text-xs font-medium px-2 py-1 rounded-lg flex-shrink-0',
                        config.bgColor,
                        config.color
                      )}
                    >
                      {isHe ? config.labelHe : config.label}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Compact version for cards/lists
export const MilestoneProgress: React.FC<{
  milestones: Milestone[];
  className?: string;
}> = ({ milestones, className }) => {
  const locale = useLocale();
  const isHe = locale === 'he';

  const completedCount = milestones.filter(m => m.status === MILESTONE_STATUS.COMPLETED).length;
  const inProgressCount = milestones.filter(m => m.status === MILESTONE_STATUS.IN_PROGRESS).length;
  const progress = milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0;

  if (milestones.length === 0) return null;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Mini progress bar */}
      <div className="flex-1 h-1.5 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent-500 to-primary-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Status dots */}
      <div className="flex items-center gap-1">
        {milestones.slice(0, 5).map((m, i) => (
          <div
            key={i}
            className={cn(
              'w-2 h-2 rounded-full',
              m.status === MILESTONE_STATUS.COMPLETED && 'bg-green-500',
              m.status === MILESTONE_STATUS.IN_PROGRESS && 'bg-blue-500',
              m.status === MILESTONE_STATUS.BLOCKED && 'bg-red-500',
              m.status === MILESTONE_STATUS.PENDING && 'bg-surface-300 dark:bg-surface-600'
            )}
          />
        ))}
        {milestones.length > 5 && (
          <span className="text-xs text-surface-400">+{milestones.length - 5}</span>
        )}
      </div>

      {/* Count */}
      <span className="text-xs text-surface-500 whitespace-nowrap">
        {completedCount}/{milestones.length}
      </span>
    </div>
  );
};
