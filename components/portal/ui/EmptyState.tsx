'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { PortalButton } from './PortalButton';
import { useTranslations } from 'next-intl';
import {
  FileQuestion,
  Users,
  FolderOpen,
  Bell,
  ClipboardList,
  Inbox,
  Calendar,
  DollarSign,
  MessageSquare,
  Plus
} from 'lucide-react';

type EmptyStateVariant =
  | 'requests'
  | 'team'
  | 'files'
  | 'notifications'
  | 'inbox'
  | 'calendar'
  | 'pricing'
  | 'messages'
  | 'generic';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
  compact?: boolean;
}

const getDefaultContent = (t: ReturnType<typeof useTranslations>): Record<EmptyStateVariant, { icon: ReactNode; title: string; description: string }> => ({
  requests: {
    icon: <ClipboardList size={32} />,
    title: t('portal.emptyState.requests.title'),
    description: t('portal.emptyState.requests.description'),
  },
  team: {
    icon: <Users size={32} />,
    title: t('portal.emptyState.team.title'),
    description: t('portal.emptyState.team.description'),
  },
  files: {
    icon: <FolderOpen size={32} />,
    title: t('portal.emptyState.files.title'),
    description: t('portal.emptyState.files.description'),
  },
  notifications: {
    icon: <Bell size={32} />,
    title: t('portal.emptyState.notifications.title'),
    description: t('portal.emptyState.notifications.description'),
  },
  inbox: {
    icon: <Inbox size={32} />,
    title: t('portal.emptyState.inbox.title'),
    description: t('portal.emptyState.inbox.description'),
  },
  calendar: {
    icon: <Calendar size={32} />,
    title: t('portal.emptyState.calendar.title'),
    description: t('portal.emptyState.calendar.description'),
  },
  pricing: {
    icon: <DollarSign size={32} />,
    title: t('portal.emptyState.pricing.title'),
    description: t('portal.emptyState.pricing.description'),
  },
  messages: {
    icon: <MessageSquare size={32} />,
    title: t('portal.emptyState.messages.title'),
    description: t('portal.emptyState.messages.description'),
  },
  generic: {
    icon: <FileQuestion size={32} />,
    title: t('portal.emptyState.generic.title'),
    description: t('portal.emptyState.generic.description'),
  },
});

export function EmptyState({
  variant = 'generic',
  title,
  description,
  icon,
  actionLabel,
  onAction,
  actionHref,
  secondaryActionLabel,
  onSecondaryAction,
  className,
  compact = false,
}: EmptyStateProps) {
  const t = useTranslations();
  const defaultContent = getDefaultContent(t);
  const content = defaultContent[variant];

  if (compact) {
    return (
      <div
        className={cn(
          'py-8 flex flex-col items-center justify-center text-center',
          className
        )}
      >
        <div className="w-12 h-12 bg-surface-100 dark:bg-surface-800 rounded-xl flex items-center justify-center mb-4 text-surface-400">
          {icon || content.icon}
        </div>
        <p className="text-sm font-bold text-surface-600 dark:text-surface-400 mb-1">
          {title || content.title}
        </p>
        <p className="text-xs text-surface-400 dark:text-surface-500 max-w-xs">
          {description || content.description}
        </p>
        {(actionLabel || onAction || actionHref) && (
          <PortalButton
            size="sm"
            className="mt-4"
            onClick={onAction}
            {...(actionHref && { as: 'a', href: actionHref })}
          >
            <Plus size={14} className="me-1.5" />
            {actionLabel || t('portal.common.getStarted')}
          </PortalButton>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'py-16 flex flex-col items-center justify-center text-center',
        className
      )}
    >
      {/* Icon with gradient background */}
      <div className="relative mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-surface-800 dark:to-surface-900 rounded-3xl flex items-center justify-center border border-surface-200 dark:border-surface-700 text-surface-400 dark:text-surface-500 shadow-lg shadow-surface-200/50 dark:shadow-none">
          {icon || content.icon}
        </div>
        {/* Decorative dots */}
        <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-400 rounded-full opacity-60" />
        <div className="absolute -bottom-1 -left-3 w-2 h-2 bg-purple-400 rounded-full opacity-40" />
      </div>

      <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">
        {title || content.title}
      </h3>
      <p className="text-sm text-surface-500 dark:text-surface-400 max-w-sm mb-8 leading-relaxed">
        {description || content.description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {(actionLabel || onAction || actionHref) && (
          <PortalButton
            onClick={onAction}
            className="shadow-lg shadow-blue-500/20"
            {...(actionHref && { as: 'a', href: actionHref })}
          >
            <Plus size={16} className="me-2" />
            {actionLabel || t('portal.common.getStarted')}
          </PortalButton>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <PortalButton variant="outline" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </PortalButton>
        )}
      </div>
    </div>
  );
}

// Column-specific empty state for Kanban boards
export function EmptyColumnState({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'py-12 border-2 border-dashed border-surface-200 dark:border-surface-800 rounded-2xl flex flex-col items-center justify-center text-center opacity-50 hover:opacity-70 transition-opacity',
        className
      )}
    >
      <div className="w-10 h-10 bg-surface-100 dark:bg-surface-800 rounded-xl flex items-center justify-center mb-3 text-surface-400">
        <Plus size={20} />
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-surface-400">
        No items
      </span>
    </div>
  );
}
