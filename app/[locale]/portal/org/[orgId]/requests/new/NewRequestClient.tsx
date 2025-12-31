'use client';

import { ArrowLeft, Info } from 'lucide-react';
import { PortalCard } from '@/components/portal/ui/PortalCard';
import { CreateRequestForm } from '@/components/portal/forms/CreateRequestForm';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useResolvedOrgId } from '@/lib/hooks/useResolvedOrgId';

export default function NewRequestClient() {
  const orgId = useResolvedOrgId();
  const t = useTranslations();

  if (!orgId || typeof orgId !== 'string') {
    return <div className="text-center py-20 text-slate-500">Invalid organization ID</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link
          href={`/portal/org/${orgId}/requests/`}
          className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-sm bg-white dark:bg-slate-950"
        >
          <ArrowLeft size={20} className="text-slate-500" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {t('portal.requests.new.title')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {t('portal.requests.new.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PortalCard className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CreateRequestForm orgId={orgId} />
          </PortalCard>
        </div>

        <div className="space-y-6">
          <PortalCard className="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20 shadow-sm">
            <h3 className="font-bold text-blue-900 dark:text-blue-400 mb-2 flex items-center gap-2">
              <Info size={18} /> {t('portal.requests.new.tips.title')}
            </h3>
            <ul className="text-xs text-blue-800/80 dark:text-blue-300/80 space-y-2 list-disc ps-4 leading-relaxed">
              <li>{t('portal.requests.new.tips.tip1')}</li>
              <li>{t('portal.requests.new.tips.tip2')}</li>
              <li>{t('portal.requests.new.tips.tip3')}</li>
              <li>{t('portal.requests.new.tips.tip4')}</li>
            </ul>
          </PortalCard>
        </div>
      </div>
    </div>
  );
}
