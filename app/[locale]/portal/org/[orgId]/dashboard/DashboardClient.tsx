'use client';

import { useDashboardData } from '@/lib/hooks/useDashboardData';
import { Clock, Plus, Loader2, AlertCircle } from 'lucide-react';
import { PortalCard } from '@/components/portal/ui/PortalCard';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import { useTranslations, NextIntlClientProvider } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ClientAnalytics } from '@/components/portal/ClientAnalytics';
import { ActivityTimeline } from '@/components/portal/ActivityTimeline';

function DashboardClientContent() {
  const t = useTranslations();

  // Use the new TanStack Query hook
  const {
    requests,
    activities,
    loading,
    error,
    orgId
  } = useDashboardData();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-bold font-outfit uppercase tracking-widest text-xs">
          {t('portal.dashboard.loading')}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">
          {t('portal.dashboard.error.title')}
        </h2>
        <p className="text-slate-500 max-w-sm">
          {error === 'access_denied' ? t('portal.access.restrictedMessage') : t('portal.common.error')}
        </p>
        <PortalButton onClick={() => window.location.reload()}>
          {t('portal.dashboard.error.retry')}
        </PortalButton>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-outfit">
            {t('portal.dashboard.title')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {t('portal.dashboard.subtitle')}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href={`/portal/org/${orgId}/requests/new/`}>
            <PortalButton className="flex items-center gap-2 font-outfit shadow-lg shadow-blue-500/20">
              <Plus size={18} />
              {t('portal.dashboard.actions.newRequest')}
            </PortalButton>
          </Link>
        </div>
      </div>

      {/* Analytics Grid */}
      <ClientAnalytics requests={requests} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">
              {t('portal.activity.title')}
            </h2>
          </div>

          <PortalCard
            noPadding
            className="border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden bg-white dark:bg-slate-950"
          >
            <ActivityTimeline activities={activities} orgId={orgId as string} />
          </PortalCard>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <PortalCard className="border-slate-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950">
            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 mb-6 flex items-center gap-2 uppercase tracking-widest">
              <Clock size={14} className="text-blue-500" />
              {t('portal.dashboard.serviceStatus.title')}
            </h4>
            <div className="space-y-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400 font-bold font-outfit">
                  {t('portal.dashboard.serviceStatus.design')}
                </span>
                <span className="text-emerald-500 font-black flex items-center gap-2 text-[10px] uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  {t('portal.dashboard.serviceStatus.active')}
                </span>
              </div>
              <PortalCard className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-200 dark:border-slate-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-600 dark:text-slate-400 font-bold font-outfit">
                    {t('portal.dashboard.serviceStatus.dev')}
                  </span>
                  <span className="text-amber-500 font-black flex items-center gap-2 text-[10px] uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                    {t('portal.dashboard.serviceStatus.peak')}
                  </span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[92%]" />
                </div>
                <p className="mt-3 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                  {t('portal.dashboard.serviceStatus.etaLabel')}: 4-6{' '}
                  {t('portal.dashboard.serviceStatus.days')}
                </p>
              </PortalCard>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400 font-bold font-outfit">
                  {t('portal.dashboard.serviceStatus.avgResponse')}
                </span>
                <span className="text-slate-900 dark:text-white font-black text-[10px] uppercase tracking-widest">
                  {t('portal.dashboard.serviceStatus.responseTime')}
                </span>
              </div>
            </div>
          </PortalCard>
        </div>
      </div>
    </div>
  );
}

export default function DashboardClient({
  messages,
  locale,
}: {
  messages: Record<string, any>;
  locale: string;
}) {
  if (!messages || !locale) {
    throw new Error('DashboardClient requires messages and locale props');
  }

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <DashboardClientContent />
    </NextIntlClientProvider>
  );
}
