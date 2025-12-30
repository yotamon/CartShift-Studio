'use client';

import { useState, useEffect } from 'react';
import { PortalCard } from '@/components/portal/ui/PortalCard';
import { PortalBadge } from '@/components/portal/ui/PortalBadge';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import {
  Plus,
  MessageSquare,
  Paperclip,
  Clock,
  Loader2,
  MoreHorizontal,
  PlusCircle,
} from 'lucide-react';
import { PortalAvatar, PortalAvatarGroup } from '@/components/portal/ui/PortalAvatar';
import { getAllRequests } from '@/lib/services/portal-requests';
import { Request } from '@/lib/types/portal';
import { Link } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { formatDistanceToNow } from 'date-fns';
import { enUS, he } from 'date-fns/locale';

export default function AgencyWorkboardClient() {
  const t = useTranslations('portal');
  const locale = useLocale();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getAllRequests();
        setRequests(data);
      } catch (error) {
        console.error('Error fetching workboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const columns = [
    {
      title: t('agency.workboard.columns.backlog'),
      status: ['NEW', 'QUEUED', 'NEEDS_INFO'],
      color: 'slate',
    },
    {
      title: t('agency.workboard.columns.inProgress'),
      status: ['IN_PROGRESS'],
      color: 'blue',
    },
    { title: t('agency.workboard.columns.review'), status: ['IN_REVIEW'], color: 'amber' },
    {
      title: t('agency.workboard.columns.delivered'),
      status: ['DELIVERED', 'CLOSED'],
      color: 'emerald',
    },
  ];

  const getRequestsForStatus = (statuses: string[]) => {
    return requests.filter(req => statuses.includes(req.status));
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-surface-500 font-bold uppercase tracking-widest text-xs">
          {t('agency.workboard.loading')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-white leading-tight">
            {t('agency.workboard.title')}
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            {t('agency.workboard.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PortalAvatarGroup max={3} className="mr-2">
            <PortalAvatar name="CartShift Studio" size="sm" />
            <PortalAvatar name="John Doe" size="sm" />
          </PortalAvatarGroup>
          <PortalButton
            size="sm"
            variant="outline"
            className="h-10 px-4 font-bold border-surface-200 cursor-default"
          >
            {t('agency.workboard.roadmap')}
          </PortalButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {columns.map(column => {
          const columnRequests = getRequestsForStatus(column.status);
          return (
            <div key={column.title} className="space-y-4">
              <div className="flex items-center justify-between px-2 mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-black text-surface-900 dark:text-white uppercase tracking-widest">
                    {column.title}
                  </h3>
                  <span className="px-1.5 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400 text-[10px] font-black">
                    {columnRequests.length}
                  </span>
                </div>
                <button className="text-surface-400 hover:text-surface-900 dark:hover:text-white p-1">
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto pr-1 scrollbar-hide">
                {columnRequests.map(req => (
                  <Link key={req.id} href={`/portal/org/${req.orgId}/requests/${req.id}/`}>
                    <PortalCard className="p-3 md:p-4 border-surface-200 dark:border-surface-800 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900 transition-all cursor-pointer group active:scale-[0.98]">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <PortalBadge
                          variant={
                            req.priority === 'HIGH' || req.priority === 'URGENT'
                              ? 'red'
                              : req.priority === 'NORMAL'
                                ? 'yellow'
                                : 'blue'
                          }
                          className="text-[9px] px-1.5 h-4 font-black uppercase tracking-tighter"
                        >
                          {req.priority || 'NORMAL'}
                        </PortalBadge>
                        <div className="text-[10px] font-bold text-surface-400 font-mono tracking-tighter">
                          #ID-{req.id.slice(0, 4).toUpperCase()}
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-surface-900 dark:text-white mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                        {req.title}
                      </h4>

                      <p className="text-[11px] text-surface-500 line-clamp-2 mb-4 font-medium leading-relaxed">
                        {req.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-surface-50 dark:border-surface-800/50">
                        <div className="flex items-center gap-3">
                          {req.assignedToName && (
                            <PortalAvatar name={req.assignedToName} size="xs" className="ring-2 ring-white dark:ring-surface-900" />
                          )}
                          <div className="flex items-center gap-1 text-surface-400">
                            <MessageSquare size={12} />
                            <span className="text-[10px] font-bold">{req.commentCount || 0}</span>
                          </div>
                          {req.attachmentIds && req.attachmentIds.length > 0 && (
                            <div className="flex items-center gap-1 text-surface-400">
                              <Paperclip size={12} />
                              <span className="text-[10px] font-bold">{req.attachmentIds.length}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-surface-400">
                          <Clock size={12} className="text-surface-300" />
                          <span className="text-[10px] font-bold uppercase tracking-tighter">
                            {req.createdAt?.toDate ? formatDistanceToNow(req.createdAt.toDate(), {
                              addSuffix: true,
                              locale: locale === 'he' ? he : enUS,
                            }) : 'now'}
                          </span>
                        </div>
                      </div>
                    </PortalCard>
                  </Link>
                ))}

                {columnRequests.length === 0 && (
                  <div className="py-12 border-2 border-dashed border-surface-100 dark:border-surface-800 rounded-2xl flex flex-col items-center justify-center text-center opacity-30">
                    <PlusCircle size={24} className="mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {t('agency.workboard.emptyColumn')}
                    </span>
                  </div>
                )}
              </div>

              <button className="w-full py-2.5 rounded-xl border border-dashed border-surface-200 dark:border-surface-800 hover:border-blue-300 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 text-surface-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                <Plus size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {t('agency.workboard.assign')}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
