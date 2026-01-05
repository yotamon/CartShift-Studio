'use client';

import React from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { Pin, ExternalLink, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Request } from '@/lib/types/portal';
import { PortalBadge } from '@/components/portal/ui/PortalBadge';
import { PortalCard } from '@/components/portal/ui/PortalCard';
import { getStatusBadgeVariant } from '@/lib/utils/portal-helpers';
import { usePinnedRequests } from '@/lib/hooks/usePinnedRequests';

interface PinnedRequestsProps {
  requests: Request[];
  orgId: string;
  locale: string;
  className?: string;
}

export const PinnedRequests: React.FC<PinnedRequestsProps> = ({
  requests,
  orgId,
  locale,
  className,
}) => {
  const t = useTranslations();
  const { pinnedIds, unpinRequest } = usePinnedRequests(orgId);

  // Filter to only show pinned requests that still exist
  const pinnedRequests = requests.filter(r => pinnedIds.includes(r.id));

  if (pinnedRequests.length === 0) {
    return null;
  }

  return (
    <PortalCard
      variant="glass"
      accent="warning"
      padding="sm"
      className={cn('overflow-hidden', className)}
    >
      <div className="flex items-center gap-2 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
          <Pin size={12} className="text-white" />
        </div>
        {t('portal.dashboard.pinned.title')}
        <PortalBadge variant="yellow" size="xs" className="ms-auto" glow>
          {pinnedRequests.length}
        </PortalBadge>
      </div>

      <AnimatePresence mode="popLayout">
        {pinnedRequests.map((request, index) => (
          <motion.div
            key={request.id}
            layout
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, x: -20 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="group relative p-3 rounded-xl bg-amber-50/50 dark:bg-amber-500/5 border border-amber-200/50 dark:border-amber-500/20 hover:border-amber-300 dark:hover:border-amber-500/30 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <Link
                  href={`/${locale}/portal/org/${orgId}/requests/${request.id}`}
                  className="group/link flex items-center gap-2"
                >
                  <span className="text-sm font-medium text-surface-900 dark:text-white truncate group-hover/link:text-primary-600 dark:group-hover/link:text-primary-400 transition-colors">
                    {request.title}
                  </span>
                  <ExternalLink
                    size={12}
                    className="flex-shrink-0 opacity-0 group-hover/link:opacity-100 text-primary-500 transition-opacity"
                  />
                </Link>
                <div className="mt-1 flex items-center gap-2">
                  <PortalBadge
                    variant={getStatusBadgeVariant(request.status)}
                    size="xs"
                    dot
                  >
                    {request.status}
                  </PortalBadge>
                  <span className="text-[10px] text-surface-400 font-mono">
                    #{request.id.slice(-6).toUpperCase()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => unpinRequest(request.id)}
                className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-amber-200/50 dark:hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 transition-all"
                aria-label={t('portal.dashboard.pinned.unpin')}
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </PortalCard>
  );
};

/**
 * Pin button to add to request cards/rows
 */
interface PinButtonProps {
  requestId: string;
  orgId: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const PinButton: React.FC<PinButtonProps> = ({
  requestId,
  orgId,
  size = 'sm',
  className,
}) => {
  const t = useTranslations();
  const { isPinned, togglePin } = usePinnedRequests(orgId);
  const pinned = isPinned(requestId);

  return (
    <button
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        togglePin(requestId);
      }}
      className={cn(
        'transition-all',
        size === 'sm' ? 'p-1.5 rounded-lg' : 'p-2.5 rounded-xl',
        pinned
          ? 'text-amber-500 bg-amber-100 dark:bg-amber-500/20 hover:bg-amber-200 dark:hover:bg-amber-500/30'
          : 'text-surface-400 hover:text-amber-500 hover:bg-surface-100 dark:hover:bg-surface-800',
        className
      )}
      aria-label={pinned ? t('portal.dashboard.pinned.unpin') : t('portal.dashboard.pinned.pin')}
      title={pinned ? t('portal.dashboard.pinned.unpin') : t('portal.dashboard.pinned.pin')}
    >
      <Pin size={size === 'sm' ? 14 : 18} className={cn(pinned && 'fill-current')} />
    </button>
  );
};

