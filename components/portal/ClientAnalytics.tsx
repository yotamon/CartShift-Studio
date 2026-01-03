'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import React, { useMemo } from 'react';
import { motion } from "@/lib/motion";
import { analyticsCard, staggerContainer } from "@/lib/animation-variants";
import { AnimatedNumber } from "@/components/portal/ui/AnimatedNumber";
import { useLocale, useTranslations } from 'next-intl';
import { FileText, Clock, CheckCircle2, DollarSign, TrendingUp, Activity, LucideIcon } from 'lucide-react';
import { isRTLLocale } from '@/lib/locale-config';
import { PortalEmptyState } from '@/components/portal/ui/PortalEmptyState';
import { Request, REQUEST_STATUS, RequestStatus } from '@/lib/types/portal';
import { Timestamp } from 'firebase/firestore';

const analyticCardVariants = cva(
  "relative p-5 rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 overflow-hidden group hover:shadow-lg transition-shadow hover-lift",
  {
    variants: {
      intent: {
        blue: "text-blue-600 dark:text-blue-400 [--icon-bg:from-blue-500_to-indigo-600] [--bg-hover:blue-500/5]",
        amber: "text-amber-600 dark:text-amber-400 [--icon-bg:from-amber-500_to-orange-600] [--bg-hover:amber-500/5]",
        green: "text-green-600 dark:text-green-400 [--icon-bg:from-green-500_to-emerald-600] [--bg-hover:green-500/5]",
        purple: "text-purple-600 dark:text-purple-400 [--icon-bg:from-purple-500_to-pink-600] [--bg-hover:purple-500/5]",
        emerald: "text-emerald-600 dark:text-emerald-400 [--icon-bg:from-emerald-500_to-teal-600] [--bg-hover:emerald-500/5]",
      },
    },
    defaultVariants: {
      intent: "blue",
    },
  }
);

interface ClientAnalyticsProps {
  requests: Request[];
  className?: string;
}

interface AnalyticCard extends VariantProps<typeof analyticCardVariants> {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
}

// Calculate days between two timestamps
const daysBetween = (start: Timestamp, end: Timestamp): number => {
  const startDate = start.toDate();
  const endDate = end.toDate();
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Calculate average resolution time in days
const calculateAvgResolutionTime = (requests: Request[]): number => {
  const completedRequests = requests.filter(
    r =>
      r.closedAt &&
      (r.status === REQUEST_STATUS.CLOSED ||
        r.status === REQUEST_STATUS.DELIVERED ||
        r.status === REQUEST_STATUS.PAID)
  );

  if (completedRequests.length === 0) return 0;

  const totalDays = completedRequests.reduce((sum, r) => {
    return sum + daysBetween(r.createdAt, r.closedAt!);
  }, 0);

  return Math.round(totalDays / completedRequests.length);
};

// Format currency
const formatCurrency = (amountInCents: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountInCents / 100);
};

// Calculate total spend
const calculateTotalSpend = (requests: Request[]): number => {
  return requests
    .filter(r => r.paidAt && r.totalAmount)
    .reduce((sum, r) => sum + (r.totalAmount || 0), 0);
};

// Get active request count
const getActiveCount = (requests: Request[]): number => {
  const activeStatuses: RequestStatus[] = [
    REQUEST_STATUS.NEW,
    REQUEST_STATUS.QUEUED,
    REQUEST_STATUS.IN_PROGRESS,
    REQUEST_STATUS.IN_REVIEW,
    REQUEST_STATUS.NEEDS_INFO,
    REQUEST_STATUS.QUOTED,
    REQUEST_STATUS.ACCEPTED,
  ];
  return requests.filter(r => activeStatuses.includes(r.status)).length;
};

// Get completed count
const getCompletedCount = (requests: Request[]): number => {
  const completedStatuses: RequestStatus[] = [
    REQUEST_STATUS.DELIVERED,
    REQUEST_STATUS.CLOSED,
    REQUEST_STATUS.PAID,
  ];
  return requests.filter(r => completedStatuses.includes(r.status)).length;
};

// Get requests from last 30 days
const getRecentRequests = (requests: Request[]): Request[] => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return requests.filter(r => {
    const createdDate = r.createdAt.toDate();
    return createdDate >= thirtyDaysAgo;
  });
};

export const ClientAnalytics: React.FC<ClientAnalyticsProps> = ({ requests, className }) => {
  const locale = useLocale();
  const t = useTranslations();
  const isHe = isRTLLocale(locale);

  const analytics = useMemo(() => {
    const recentRequests = getRecentRequests(requests);
    const activeCount = getActiveCount(requests);
    const completedCount = getCompletedCount(requests);
    const avgResolution = calculateAvgResolutionTime(requests);
    const totalSpend = calculateTotalSpend(requests);

    // Calculate trend (compare to previous period)
    const previousPeriodRequests = requests.filter(r => {
      const createdDate = r.createdAt.toDate();
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdDate >= sixtyDaysAgo && createdDate < thirtyDaysAgo;
    });

    const recentCount = recentRequests.length;
    const previousCount = previousPeriodRequests.length;
    const trend =
      previousCount > 0
        ? Math.round(((recentCount - previousCount) / previousCount) * 100)
        : recentCount > 0
          ? 100
          : 0;

    return {
      total: requests.length,
      active: activeCount,
      completed: completedCount,
      avgResolution,
      totalSpend,
      recent: recentCount,
      trend,
    };
  }, [requests]);

  const cards: AnalyticCard[] = [
    {
      title: t('portal.analytics.totalRequests'),
      value: analytics.total,
      subtitle: `${analytics.recent} ${t('portal.analytics.inLast30Days')}`,
      icon: FileText,
      trend:
        analytics.trend !== 0
          ? { value: Math.abs(analytics.trend), positive: analytics.trend > 0 }
          : undefined,
      intent: 'blue',
    },
    {
      title: t('portal.analytics.activeRequests'),
      value: analytics.active,
      subtitle: t('portal.analytics.activeRequestsSubtitle'),
      icon: Activity,
      intent: 'amber',
    },
    {
      title: t('portal.analytics.completed'),
      value: analytics.completed,
      subtitle: t('portal.analytics.completedSubtitle'),
      icon: CheckCircle2,
      intent: 'green',
    },
    {
      title: t('portal.analytics.avgResolution'),
      value: analytics.avgResolution > 0 ? `${analytics.avgResolution}` : '-',
      subtitle: t('portal.analytics.days'),
      icon: Clock,
      intent: 'purple',
    },
  ];

  // Add spend card if there's any spend data
  if (analytics.totalSpend > 0) {
    cards.push({
      title: t('portal.analytics.totalSpend'),
      value: formatCurrency(analytics.totalSpend),
      subtitle: t('portal.analytics.totalSpendSubtitle'),
      icon: DollarSign,
      intent: 'emerald',
    });
  }

  if (requests.length === 0) {
    return (
      <div className={cn('py-8', className)}>
        <PortalEmptyState
          icon={Activity}
          title={t('portal.analytics.noDataYet')}
          description={t('portal.analytics.noDataDescription')}
          variant="plain"
          className="bg-transparent border-0"
        />
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Main Stats Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {cards.slice(0, 4).map((card, index) => {
          const CardIcon = card.icon;
          return (
            <motion.div
              key={card.title}
              variants={analyticsCard}
              className={cn(analyticCardVariants({ intent: card.intent }))}
            >
              {/* Background gradient overlay on hover using CSS Variable from CVA */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-1 transition-opacity"
                style={{ backgroundColor: 'var(--bg-hover)' } as any}
              />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br var(--icon-bg) flex items-center justify-center" style={{ backgroundImage: 'linear-gradient(to bottom right, var(--icon-bg))' } as any}>
                    <CardIcon size={20} className="text-white" />
                  </div>
                  {card.trend && (
                    <div
                      className={cn(
                        'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
                        card.trend.positive
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      )}
                    >
                      <TrendingUp size={12} className={cn(!card.trend.positive && 'rotate-180')} />
                      <AnimatedNumber value={card.trend.value} duration={800} />%
                    </div>
                  )}
                </div>

                <div className="text-2xl font-bold text-surface-900 dark:text-white mb-1">
                  <AnimatedNumber value={card.value} duration={1200} />
                </div>

                <div className="text-xs text-surface-500 truncate">{card.title}</div>

                {card.subtitle && (
                  <div className="text-xs text-surface-400 mt-1 truncate">{card.subtitle}</div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Additional spend card if exists */}
      {cards.length > 4 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-emerald-100 text-sm mb-1">{cards[4].title}</div>
              <div className="text-2xl md:text-3xl font-bold">{cards[4].value}</div>
              <div className="text-emerald-100 text-sm mt-1">{cards[4].subtitle}</div>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <DollarSign size={32} className="text-white" />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Compact version for dashboard sidebar
export const ClientAnalyticsCompact: React.FC<{
  requests: Request[];
  className?: string;
}> = ({ requests, className }) => {
  const t = useTranslations();

  const analytics = useMemo(() => {
    return {
      total: requests.length,
      active: getActiveCount(requests),
      completed: getCompletedCount(requests),
    };
  }, [requests]);

  const items = [
    { label: t('portal.analytics.total'), value: analytics.total, color: 'bg-blue-500' },
    { label: t('portal.analytics.active'), value: analytics.active, color: 'bg-amber-500' },
    { label: t('portal.analytics.done'), value: analytics.completed, color: 'bg-green-500' },
  ];

  return (
    <div className={cn('flex items-center gap-4', className)}>
      {items.map(item => (
        <div key={item.label} className="flex items-center gap-2">
          <div className={cn('w-2 h-2 rounded-full', item.color)} />
          <span className="text-sm text-surface-500">{item.label}:</span>
          <span className="text-sm font-semibold text-surface-900 dark:text-white">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
};
