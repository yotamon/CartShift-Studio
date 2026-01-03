'use client';

import { useTranslations } from 'next-intl';
import {
  Plus,
  Calendar,
  Upload,
  Zap,
  ArrowRight
} from 'lucide-react';
import { PortalCard } from './ui/PortalCard';
import { Link } from '@/i18n/navigation';
import { useResolvedOrgId } from '@/lib/hooks/useResolvedOrgId';

export function QuickActions() {
  const t = useTranslations();
  const orgId = useResolvedOrgId();

  if (!orgId) return null;

  const actions = [
    {
      icon: Plus,
      label: t('portal.quickActions.newRequest'),
      href: `/portal/org/${orgId}/requests/new/`,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-500/10',
      borderColor: 'group-hover:border-blue-200 dark:group-hover:border-blue-800'
    },
    {
      icon: Calendar,
      label: t('portal.quickActions.schedule'),
      href: `/portal/org/${orgId}/consultations?action=schedule`,
      color: 'text-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-500/10',
      borderColor: 'group-hover:border-purple-200 dark:group-hover:border-purple-800'
    },
    {
      icon: Upload,
      label: t('portal.quickActions.upload'),
      href: `/portal/org/${orgId}/requests?action=upload`,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      borderColor: 'group-hover:border-emerald-200 dark:group-hover:border-emerald-800'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="md:col-span-1 flex items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap size={20} className="text-amber-500 fill-amber-500" />
            <h2 className="text-lg font-bold text-surface-900 dark:text-white">
              {t('portal.quickActions.title')}
            </h2>
          </div>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            {t('portal.quickActions.subtitle')}
          </p>
        </div>
      </div>

      <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((action, idx) => (
          <Link key={idx} href={action.href} className="group">
            <PortalCard
              className={`
                h-full transition-all duration-200
                hover:shadow-md hover:-translate-y-0.5
                border-surface-100 dark:border-surface-800
                ${action.borderColor}
              `}
              noPadding
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.bg} ${action.color}`}>
                    <action.icon size={20} className="stroke-[2.5]" />
                  </div>
                  <span className="font-bold text-sm text-surface-700 dark:text-surface-200 group-hover:text-surface-900 dark:group-hover:text-white transition-colors">
                    {action.label}
                  </span>
                </div>
                <ArrowRight size={16} className="text-surface-300 dark:text-surface-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </div>
            </PortalCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
