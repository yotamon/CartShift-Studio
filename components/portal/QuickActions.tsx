'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import {
  Plus,
  Calendar,
  Upload,
  Zap,
  ArrowRight,
  LucideIcon
} from 'lucide-react';
import { PortalCard } from './ui/PortalCard';
import { Link } from '@/i18n/navigation';
import { useResolvedOrgId } from '@/lib/hooks/useResolvedOrgId';

const quickActionVariants = cva(
  "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
  {
    variants: {
      intent: {
        blue: "bg-blue-50 dark:bg-blue-500/10 text-blue-500",
        purple: "bg-purple-50 dark:bg-purple-500/10 text-purple-500",
        emerald: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500",
      },
    },
    defaultVariants: {
      intent: "blue",
    },
  }
);

const quickCardVariants = cva(
  "h-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border-surface-100 dark:border-surface-800",
  {
    variants: {
      intent: {
        blue: "group-hover:border-blue-200 dark:group-hover:border-blue-800",
        purple: "group-hover:border-purple-200 dark:group-hover:border-purple-800",
        emerald: "group-hover:border-emerald-200 dark:group-hover:border-emerald-800",
      }
    }
  }
);

interface Action {
  icon: LucideIcon;
  label: string;
  href: string;
  intent: VariantProps<typeof quickActionVariants>['intent'];
}

export function QuickActions() {
  const t = useTranslations();
  const orgId = useResolvedOrgId();

  if (!orgId) return null;

  const actions: Action[] = [
    {
      icon: Plus,
      label: t('portal.quickActions.newRequest'),
      href: `/portal/org/${orgId}/requests/new/`,
      intent: 'blue',
    },
    {
      icon: Calendar,
      label: t('portal.quickActions.schedule'),
      href: `/portal/org/${orgId}/consultations?action=schedule`,
      intent: 'purple',
    },
    {
      icon: Upload,
      label: t('portal.quickActions.upload'),
      href: `/portal/org/${orgId}/requests?action=upload`,
      intent: 'emerald',
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
              className={cn(quickCardVariants({ intent: action.intent }))}
              noPadding
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(quickActionVariants({ intent: action.intent }))}>
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
