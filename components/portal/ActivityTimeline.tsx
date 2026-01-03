import React from 'react';
import { motion } from "@/lib/motion";
import { timelineItem, timelineItemRTL } from "@/lib/animation-variants";
import { useLocale, useTranslations } from 'next-intl';
import {
  CheckCircle2,
  Clock,
  DollarSign,
  MessageSquare,
  UserPlus,
  Zap,
  Play,
  RotateCcw,
  Plus,
} from 'lucide-react';
import { PortalEmptyState } from '@/components/portal/ui/PortalEmptyState';
import { cn } from '@/lib/utils';
import { ActivityLog } from '@/lib/types/portal';
import { Timestamp } from 'firebase/firestore';
import { Link } from '@/i18n/navigation';
import { formatDistanceToNow } from 'date-fns';
import { getDateLocale, isRTLLocale } from '@/lib/locale-config';

interface ActivityTimelineProps {
  activities: ActivityLog[];
  orgId: string;
  maxItems?: number;
  className?: string;
}

const formatTimeAgo = (timestamp: Timestamp, locale: string): string => {
  if (!timestamp) return '';
  return formatDistanceToNow(timestamp.toDate(), {
    addSuffix: true,
    locale: getDateLocale(locale),
  });
};

const getActionConfig = (action: string): { icon: React.ComponentType<any>; color: string } => {
  switch (action) {
    case 'CREATED_REQUEST':
      return {
        icon: Plus,
        color: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
      };
    case 'ASSIGNED_REQUEST':
      return {
        icon: UserPlus,
        color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30',
      };
    case 'ADDED_PRICING':
      return {
        icon: DollarSign,
        color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30',
      };
    case 'ACCEPTED_QUOTE':
      return {
        icon: CheckCircle2,
        color: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
      };
    case 'DECLINED_QUOTE':
      return {
        icon: RotateCcw,
        color: 'text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/30',
      };
    case 'STARTED_WORK':
      return {
        icon: Play,
        color: 'text-blue-500 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20',
      };
    case 'PAID_REQUEST':
      return {
        icon: Zap,
        color: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30',
      };
    case 'ADDED_COMMENT':
      return {
        icon: MessageSquare,
        color: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/30',
      };
    default:
      return {
        icon: Clock,
        color: 'text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-900/30',
      };
  }
};

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities,
  orgId,
  maxItems = 10,
  className,
}) => {
  const locale = useLocale();
  const t = useTranslations('portal.activity.actions');
  const tActivity = useTranslations('portal.activity');
  const isHe = isRTLLocale(locale);

  const visibleActivities = React.useMemo(() => {
    return activities.slice(0, maxItems);
  }, [activities, maxItems]);

  if (visibleActivities.length === 0) {
    return (
      <PortalEmptyState
        icon={Clock}
        title={tActivity('noActivity')}
        description={tActivity('noActivityDescription')}
        variant="plain"
        className={cn("bg-transparent border-0 py-8 opacity-60", className)}
      />
    );
  }

  return (
    <div className={cn('space-y-1', className)}>
      {visibleActivities.map((activity, index) => {
        const config = getActionConfig(activity.action);
        const Icon = config.icon;

        return (
          <motion.div
            key={activity.id}
            variants={isHe ? timelineItemRTL : timelineItem}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.05 }}
            className="relative"
          >
            {/* Connector line */}
            {index < visibleActivities.length - 1 && (
              <div
                className={cn(
                  'absolute top-9 -bottom-10 w-0.5 bg-surface-100 dark:bg-surface-800',
                  isHe ? 'end-9' : 'start-9'
                )}
              />
            )}

            <Link
              href={
                activity.requestId ? `/portal/org/${orgId}/requests/${activity.requestId}` : '#'
              }
              className={cn(
                'flex items-start gap-4 p-4 rounded-2xl hover:bg-surface-50 dark:hover:bg-surface-900/50 transition-all cursor-pointer group hover-lift-sm',
                isHe && 'flex-row-reverse text-end'
              )}
            >
              {/* Icon Container */}
              <div
                className={cn(
                  'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center z-10 border border-transparent group-hover:border-surface-200 dark:group-hover:border-surface-700 transition-all',
                  config.color
                )}
              >
                <Icon size={18} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 py-0.5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-bold text-surface-900 dark:text-white truncate font-outfit">
                    {t(activity.action.toLowerCase() as any) ||
                      String(activity.action).replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] font-black text-surface-400 uppercase tracking-tight whitespace-nowrap">
                    {formatTimeAgo(activity.createdAt, locale)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-surface-500 font-medium">
                    {String(activity.userName)}
                  </span>
                  {activity.details?.title ? (
                    <>
                      <span className="w-1 h-1 rounded-full bg-surface-300" />
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-bold truncate">
                        {String(activity.details.title)}
                      </span>
                    </>
                  ) : null}
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};
