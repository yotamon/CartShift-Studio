'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  MoreVertical,
  Loader2,
  Filter,
  AlertCircle,
  DollarSign,
  Send,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react';
import { PortalCard } from '@/components/portal/ui/PortalCard';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import { PortalBadge } from '@/components/portal/ui/PortalBadge';
import { Dropdown } from '@/components/ui/Dropdown';
import {
  PricingRequest,
  PRICING_STATUS_CONFIG,
  PRICING_STATUS,
  formatCurrency,
} from '@/lib/types/pricing';
import {
  subscribeToOrgPricingRequests,
  sendPricingRequest,
  deletePricingRequest,
} from '@/lib/services/pricing-requests';
import { format } from 'date-fns';
import { enUS, he } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';
import { useResolvedOrgId } from '@/lib/hooks/useResolvedOrgId';

const mapStatusColor = (color: string): 'blue' | 'green' | 'yellow' | 'red' | 'gray' => {
  if (color === 'purple') return 'blue';
  if (color === 'emerald' || color === 'green') return 'green';
  if (color === 'orange') return 'yellow';
  if (['blue', 'yellow', 'red', 'gray'].includes(color)) {
    return color as 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  }
  return 'gray';
};

export default function PricingListClient() {
  const orgId = useResolvedOrgId();
  const [requests, setRequests] = useState<PricingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const t = useTranslations();
  const locale = useLocale();
  const { isAgency } = usePortalAuth();

  const filters = [
    'All',
    PRICING_STATUS.DRAFT,
    PRICING_STATUS.SENT,
    PRICING_STATUS.ACCEPTED,
    PRICING_STATUS.PAID,
  ];

  useEffect(() => {
    if (!orgId || typeof orgId !== 'string') return undefined;

    setLoading(true);
    setError(null);

    try {
      // Agency sees all requests, clients only see non-drafts
      const unsubscribe = subscribeToOrgPricingRequests(
        orgId,
        data => {
          setRequests(data);
          setLoading(false);
        },
        { excludeDrafts: !isAgency }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Failed to subscribe to pricing requests:', err);
      setError(t('portal.common.error'));
      setLoading(false);
      return undefined;
    }
  }, [orgId, isAgency, t]);

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  const handleSend = async (requestId: string) => {
    try {
      if (!confirm('Send this pricing offer to the client?')) return;
      await sendPricingRequest(requestId);
    } catch (err) {
      console.error('Failed to send pricing request:', err);
      alert('Failed to send. Please try again.');
    }
  };

  const handleDelete = async (requestId: string) => {
    if (!confirm('Are you sure you want to delete this pricing offer?')) return;
    try {
      await deletePricingRequest(requestId);
    } catch (err) {
      console.error('Failed to delete pricing request:', err);
      alert('Failed to delete. Please try again.');
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesFilter = activeFilter === 'All' || req.status === activeFilter;
    const matchesSearch =
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleNextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1));

  if (error) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">
          {t('portal.common.error')}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm">{error}</p>
        <PortalButton onClick={() => window.location.reload()}>
          {t('portal.common.retry')}
        </PortalButton>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-outfit">
            {t('portal.pricing.title')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {t('portal.pricing.subtitle')}
          </p>
        </div>
        {isAgency && (
          <Link href={`/portal/org/${orgId}/pricing/new/`}>
            <PortalButton className="flex items-center gap-2 shadow-lg shadow-blue-500/20 font-outfit">
              <Plus size={18} />
              {t('portal.pricing.newOffer')}
            </PortalButton>
          </Link>
        )}
      </div>

      <PortalCard
        noPadding
        className="overflow-visible border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950"
      >
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative w-full lg:w-96">
            <Search
              className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder={t('portal.header.searchPlaceholder')}
              className="portal-input ps-10 h-10 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 font-medium w-full font-outfit"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide">
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-400 uppercase tracking-widest shrink-0">
              <Filter size={12} /> {t('portal.common.filter')}:
            </div>
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  'px-3 py-1.5 text-sm font-bold rounded-lg whitespace-nowrap transition-all font-outfit',
                  activeFilter === filter
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
                )}
              >
                {filter === 'All'
                  ? t('portal.common.all')
                  : t(`portal.pricing.status.${filter.toLowerCase()}` as never)}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm font-bold text-slate-400 font-outfit">
                {t('portal.common.loading')}
              </p>
            </div>
          ) : filteredRequests.length > 0 ? (
            <table className="w-full text-start border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50 cursor-default">
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    {t('portal.pricing.form.titleLabel')}
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">
                    {t('portal.common.status')}
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">
                    {t('portal.pricing.form.total')}
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">
                    {t('portal.common.date')}
                  </th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-end">
                    {t('portal.common.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedRequests.map(req => (
                  <tr
                    key={req.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/portal/org/${orgId}/pricing/${req.id}/`}
                        className="flex flex-col max-w-md"
                      >
                        <span className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate font-outfit">
                          {req.title}
                        </span>
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mt-1 font-outfit">
                          {req.clientName && (
                            <>
                              <span className="truncate">{req.clientName}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300" />
                            </>
                          )}
                          <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] tracking-tight">
                            {req.id.slice(0, 8)}
                          </span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <PortalBadge
                          variant={mapStatusColor(
                            PRICING_STATUS_CONFIG[req.status]?.color || 'gray'
                          )}
                        >
                          {t(`portal.pricing.status.${req.status.toLowerCase()}` as never)}
                        </PortalBadge>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <DollarSign size={14} className="text-green-500 opacity-70" />
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-outfit">
                          {formatCurrency(req.totalAmount, req.currency)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-outfit whitespace-nowrap">
                          {req.createdAt?.toDate
                            ? format(req.createdAt.toDate(), 'MMM d, yyyy', {
                                locale: locale === 'he' ? he : enUS,
                              })
                            : t('portal.common.recently')}
                        </span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                          {req.status === PRICING_STATUS.DRAFT
                            ? t('portal.pricing.status.draft')
                            : req.sentAt?.toDate
                              ? format(req.sentAt.toDate(), 'MMM d', {
                                  locale: locale === 'he' ? he : enUS,
                                })
                              : ''}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-end">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/portal/org/${orgId}/pricing/${req.id}/`}>
                          <button className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20">
                            <Eye size={16} />
                          </button>
                        </Link>
                        {isAgency &&
                          (req.status === PRICING_STATUS.DRAFT ||
                            req.status === PRICING_STATUS.SENT) && (
                            <Link href={`/portal/org/${orgId}/pricing/${req.id}/edit`}>
                              <button className="p-2 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-all rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/20">
                                <Pencil size={16} />
                              </button>
                            </Link>
                          )}
                        {isAgency && req.status === PRICING_STATUS.DRAFT && (
                          <button
                            onClick={() => handleSend(req.id)}
                            className="p-2 text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-all rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20"
                          >
                            <Send size={16} />
                          </button>
                        )}
                        <Dropdown
                          trigger={
                            <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                              <MoreVertical size={16} />
                            </button>
                          }
                          items={[
                            {
                              label: t('portal.common.view'),
                              icon: <Eye size={14} />,
                              onClick: () =>
                                (window.location.href = `/portal/org/${orgId}/pricing/${req.id}`),
                            },
                            ...(isAgency &&
                            (req.status === PRICING_STATUS.DRAFT ||
                              req.status === PRICING_STATUS.SENT)
                              ? [
                                  {
                                    label: t('portal.common.edit'),
                                    icon: <Pencil size={14} />,
                                    onClick: () =>
                                      (window.location.href = `/portal/org/${orgId}/pricing/${req.id}/edit`),
                                  },
                                ]
                              : []),
                            ...(isAgency && req.status === PRICING_STATUS.DRAFT
                              ? [
                                  {
                                    label: 'Send to Client',
                                    icon: <Send size={14} />,
                                    onClick: () => handleSend(req.id),
                                  },
                                ]
                              : []),
                            ...(isAgency
                              ? [
                                  {
                                    label: t('portal.common.delete'),
                                    icon: <Trash2 size={14} />,
                                    variant: 'danger' as const,
                                    onClick: () => handleDelete(req.id),
                                  },
                                ]
                              : []),
                          ]}
                          align="right"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center px-4 space-y-4">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center mb-2 border border-slate-100 dark:border-slate-800 shadow-inner">
                <DollarSign className="text-slate-200 dark:text-slate-800" size={36} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">
                  {t('portal.common.noData')}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm font-medium">
                  {isAgency
                    ? t('portal.pricing.noOffersAgency')
                    : t('portal.pricing.noOffersClient')}
                </p>
              </div>
              {isAgency && !searchQuery && activeFilter === 'All' && (
                <Link href={`/portal/org/${orgId}/pricing/new/`} className="pt-4">
                  <PortalButton className="h-11 px-8 font-outfit shadow-lg shadow-blue-500/10">
                    {t('portal.pricing.newOffer')}
                  </PortalButton>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        {!loading && filteredRequests.length > 0 && (
          <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30 dark:bg-slate-900/30">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {t('portal.common.showing', {
                count: paginatedRequests.length,
                total: filteredRequests.length,
              })}
            </span>
            <div className="flex items-center gap-2">
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
