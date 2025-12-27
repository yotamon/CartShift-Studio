'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Plus,
  Search,
  MoreVertical,
  MessageSquare,
  Loader2,
  Filter,
  AlertCircle,
} from 'lucide-react';
import { PortalCard } from '@/components/portal/ui/PortalCard';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import { PortalBadge } from '@/components/portal/ui/PortalBadge';
import { subscribeToOrgRequests } from '@/lib/services/portal-requests';
import { Request, STATUS_CONFIG } from '@/lib/types/portal';
import { format } from 'date-fns';
import { enUS, he } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useTranslations, useLocale } from 'next-intl';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';
import { Link } from '@/i18n/navigation';

const mapStatusColor = (color: string): 'blue' | 'green' | 'yellow' | 'red' | 'gray' => {
  if (color === 'purple') return 'blue';
  if (color === 'emerald') return 'green';
  if (['blue', 'green', 'yellow', 'red', 'gray'].includes(color)) {
    return color as 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  }
  return 'gray';
};

export default function RequestsClient() {
  const { orgId } = useParams();
  const { userData, loading: authLoading, isAuthenticated } = usePortalAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const t = useTranslations();
  const locale = useLocale();

  const filters = ['All', 'NEW', 'IN_PROGRESS', 'IN_REVIEW', 'DELIVERED', 'CLOSED'];

  useEffect(() => {
    if (!orgId || typeof orgId !== 'string' || authLoading) return undefined;

    if (!isAuthenticated || !userData) {
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setError(null);

    try {
      const unsubscribe = subscribeToOrgRequests(orgId, (data) => {
        setRequests(data);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('Failed to subscribe to requests:', err);
      setError(t('portal.common.error'));
      setLoading(false);
      return undefined;
    }
  }, [orgId, authLoading, isAuthenticated, userData, t]);

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  const filteredRequests = requests.filter(req => {
    const matchesFilter = activeFilter === 'All' || req.status === activeFilter;
    const matchesSearch = req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          req.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePrevPage = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleNextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1));

  if (error) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">{t('portal.common.error')}</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm">{error}</p>
        <PortalButton onClick={() => window.location.reload()}>{t('portal.common.retry')}</PortalButton>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 w-full min-w-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-0">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-outfit truncate">{t('portal.requests.title')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium truncate font-outfit">{t('portal.dashboard.subtitle')}</p>
        </div>
        <Link href={`/portal/org/${orgId}/requests/new/`} className="flex-shrink-0">
          <PortalButton className="flex items-center gap-2 shadow-lg shadow-blue-500/20 font-outfit whitespace-nowrap">
            <Plus size={18} />
            {t('portal.requests.newRequest')}
          </PortalButton>
        </Link>
      </div>

      <PortalCard className="p-0 overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950 w-full min-w-0">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50 min-w-0">
          <div className="relative w-full lg:w-96 min-w-0 flex-shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder={t('portal.header.searchPlaceholder')}
              className="portal-input pl-10 h-10 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 font-medium w-full min-w-0 font-outfit"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide min-w-0 flex-1">
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-400 uppercase tracking-widest shrink-0">
               <Filter size={12} /> {t('portal.common.filter')}:
            </div>
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-3 py-1.5 text-sm font-bold rounded-lg whitespace-nowrap transition-all font-outfit shrink-0",
                  activeFilter === filter
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
                )}
              >
                {filter === 'All' ? t('portal.common.all' as any) : t(`portal.requests.status.${filter.toLowerCase()}` as any)}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto w-full min-w-0">
          {loading ? (
             <div className="py-20 flex flex-col items-center justify-center space-y-3">
               <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
               <p className="text-sm font-bold text-slate-400 font-outfit">{t('portal.common.loading')}</p>
             </div>
          ) : filteredRequests.length > 0 ? (
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50 cursor-default">
                  <th className="px-3 md:px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest min-w-[200px]">{t('portal.requests.table.title')}</th>
                  <th className="px-3 md:px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">{t('portal.requests.table.status')}</th>
                  <th className="px-3 md:px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">{t('portal.requests.table.priority')}</th>
                  <th className="px-3 md:px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap hidden md:table-cell">{t('portal.requests.table.created')}</th>
                  <th className="px-3 md:px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right whitespace-nowrap">{t('portal.common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group">
                    <td className="px-3 md:px-6 py-4 min-w-0">
                      <Link href={`/portal/org/${orgId}/requests/${req.id}/`} className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate font-outfit">
                          {req.title}
                        </span>
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mt-1 font-outfit flex-wrap">
                          {t('portal.requests.table.id')}: <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] tracking-tight shrink-0">{req.id.slice(0, 8)}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                          <span className="uppercase tracking-wider text-[10px] truncate">{req.type || t('portal.common.general')}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-3 md:px-6 py-4">
                      <div className="flex justify-center">
                        <PortalBadge variant={mapStatusColor(STATUS_CONFIG[req.status]?.color || 'gray')}>
                          {t(`portal.requests.status.${req.status.toLowerCase()}` as any)}
                        </PortalBadge>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full shrink-0",
                          req.priority === 'HIGH' || req.priority === 'URGENT' ? "bg-rose-500 shadow-sm shadow-rose-500/50" :
                          req.priority === 'NORMAL' ? "bg-amber-500 shadow-sm shadow-amber-500/50" : "bg-blue-500 shadow-sm shadow-blue-500/50"
                        )} />
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300 font-outfit whitespace-nowrap">
                          {t(`portal.requests.priority.${req.priority.toLowerCase()}` as any)}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4 hidden md:table-cell">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-outfit whitespace-nowrap">
                          {req.createdAt?.toDate ? format(req.createdAt.toDate(), 'MMM d, yyyy', { locale: locale === 'he' ? he : enUS }) : t('portal.common.recently')}
                        </span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{t('portal.requests.table.created')}</span>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/portal/org/${orgId}/requests/${req.id}/`}>
                          <button className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20">
                            <MessageSquare size={16} />
                          </button>
                        </Link>
                        <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center px-4 space-y-4">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center mb-2 border border-slate-100 dark:border-slate-800 shadow-inner">
                <Search className="text-slate-200 dark:text-slate-800" size={36} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">{t('portal.requests.emptyTitle')}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm font-medium">
                  {searchQuery || activeFilter !== 'All'
                    ? t('portal.requests.emptySearch')
                    : t('portal.requests.emptyDescription')}
                </p>
              </div>
              {!searchQuery && activeFilter === 'All' && (
                <Link href={`/portal/org/${orgId}/requests/new/`} className="pt-4">
                  <PortalButton className="h-11 px-8 font-outfit">{t('portal.requests.newRequest')}</PortalButton>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        {!loading && filteredRequests.length > 0 && (
          <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30 dark:bg-slate-900/30 min-w-0">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate min-w-0">
              {t('portal.common.showing', { count: paginatedRequests.length, total: filteredRequests.length })}
            </span>
            <div className="flex items-center gap-2 shrink-0">
               <PortalButton
                 variant="outline"
                 size="sm"
                 className="h-8 px-4 text-[10px] font-black uppercase tracking-widest"
                 onClick={handlePrevPage}
                 disabled={currentPage === 1}
               >
                 {t('portal.common.prev')}
               </PortalButton>
               <PortalButton
                 variant="outline"
                 size="sm"
                 className="h-8 px-4 text-[10px] font-black uppercase tracking-widest"
                 onClick={handleNextPage}
                 disabled={currentPage === totalPages}
               >
                 {t('portal.common.next')}
               </PortalButton>
            </div>
          </div>
        )}
      </PortalCard>
    </div>
  );
}

