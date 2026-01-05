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

const quickActionIconVariants = cva(
  "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110",
  {
    variants: {
      intent: {
        blue: "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30",
        purple: "bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/30",
        emerald: "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30",
      },
    },
    defaultVariants: {
      intent: "blue",
    },
  }
);

interface Action {
  icon: LucideIcon;
  label: string;
  description: string;
  href: string;
  intent: VariantProps<typeof quickActionIconVariants>['intent'];
}

export function QuickActions() {
  const t = useTranslations();
  const orgId = useResolvedOrgId();

  if (!orgId) return null;

  const actions: Action[] = [
    {
      icon: Plus,
      label: t('portal.quickActions.newRequest'),
      description: t('portal.quickActions.newRequestDesc' as never) || 'Submit a new design request',
      href: `/portal/org/${orgId}/requests/new/`,
      intent: 'blue',
    },
    {
      icon: Calendar,
      label: t('portal.quickActions.schedule'),
      description: t('portal.quickActions.scheduleDesc' as never) || 'Book a consultation call',
      href: `/portal/org/${orgId}/consultations?action=schedule`,
      intent: 'purple',
    },
    {
      icon: Upload,
      label: t('portal.quickActions.upload'),
      description: t('portal.quickActions.uploadDesc' as never) || 'Share files and assets',
      href: `/portal/org/${orgId}/requests?action=upload`,
      intent: 'emerald',
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="md:col-span-1 flex items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/30">
              <Zap size={16} className="text-white fill-white" />
            </div>
            <h2 className="text-lg font-bold text-surface-900 dark:text-white font-outfit">
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
              variant="interactive"
              hoverEffect="lift"
              className="h-full border-glow"
              noPadding
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={cn(quickActionIconVariants({ intent: action.intent }))}>
                    <action.icon size={20} className="stroke-[2.5]" />
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-surface-300 dark:text-surface-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 mt-1"
                  />
                </div>
                <span className="font-bold text-sm text-surface-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors block">
                  {action.label}
                </span>
                <span className="text-xs text-surface-500 dark:text-surface-400 mt-1 block">
                  {action.description}
                </span>
              </div>
            </PortalCard>
          </Link>
        ))}
      </div>
    </div>
  );
}

