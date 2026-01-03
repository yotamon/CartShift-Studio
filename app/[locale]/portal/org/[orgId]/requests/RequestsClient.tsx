'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import { skeletonToContent } from "@/lib/animation-variants";
import {
  Plus,
  Search,
  MoreVertical,
  MessageSquare,
  Loader2,
  Filter,
  AlertCircle,
  DollarSign,
  X,
  Check,
  Trash2,
  Edit,
  Archive,
} from 'lucide-react';
import { PortalCard } from '@/components/portal/ui/PortalCard';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import { PortalBadge } from '@/components/portal/ui/PortalBadge';
import { SkeletonTable } from '@/components/portal/ui/PortalSkeleton';
import { PortalEmptyState } from '@/components/portal/ui/PortalEmptyState';
import { Dropdown } from '@/components/ui/Dropdown';
import { subscribeToOrgRequests } from '@/lib/services/portal-requests';
import { createPricingRequest, sendPricingRequest } from '@/lib/services/pricing-requests';
import {
  Request,
  STATUS_CONFIG,
  PricingLineItem,
  Currency,
  CURRENCY_CONFIG,
  formatCurrency,
  generateLineItemId,
  calculateTotalAmount,
  CLIENT_STATUS_MAP,
  CLIENT_STATUS_CONFIG,
  ClientStatus,
} from '@/lib/types/portal';
import { format } from 'date-fns';
import { enUS, he } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useTranslations, useLocale } from 'next-intl';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';
import { useResolvedOrgId } from '@/lib/hooks/useResolvedOrgId';
import { Link, useRouter } from '@/i18n/navigation';

const mapStatusColor = (color: string): 'blue' | 'green' | 'yellow' | 'red' | 'gray' => {
  if (color === 'purple') return 'blue';
  if (color === 'emerald') return 'green';
  if (['blue', 'green', 'yellow', 'red', 'gray'].includes(color)) {
    return color as 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  }
  return 'gray';
};

export default function RequestsClient() {
  const orgId = useResolvedOrgId();
  const router = useRouter();
  const { userData, loading: authLoading, isAuthenticated, isAgency } = usePortalAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const t = useTranslations();
  const locale = useLocale();

  // Multi-select for pricing offers (agency only)
  const [selectedRequestIds, setSelectedRequestIds] = useState<string[]>([]);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [pricingTitle, setPricingTitle] = useState('');
  const [pricingLineItems, setPricingLineItems] = useState<PricingLineItem[]>([
    { id: generateLineItemId(), description: '', quantity: 1, unitPrice: 0 },
  ]);
  const [pricingCurrency, setPricingCurrency] = useState<Currency>('USD');
  const [isCreatingPricing, setIsCreatingPricing] = useState(false);

  const clientFilters: ClientStatus[] = ['SUBMITTED', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED'];
  const filters = isAgency
    ? ['All', 'NEW', 'IN_PROGRESS', 'IN_REVIEW', 'DELIVERED', 'CLOSED']
    : ['All', ...clientFilters];

  useEffect(() => {
    if (!orgId || typeof orgId !== 'string' || authLoading) return undefined;

    if (!isAuthenticated || !userData) {
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setError(null);

    try {
      const unsubscribe = subscribeToOrgRequests(orgId, data => {
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
    let matchesFilter = activeFilter === 'All';
    if (!matchesFilter) {
      if (isAgency) {
        matchesFilter = req.status === activeFilter;
      } else {
        matchesFilter = CLIENT_STATUS_MAP[req.status] === activeFilter;
      }
    }

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

  // Multi-select helpers
  const toggleRequestSelection = (requestId: string) => {
    setSelectedRequestIds(prev =>
      prev.includes(requestId) ? prev.filter(id => id !== requestId) : [...prev, requestId]
    );
  };

  const clearSelection = () => {
    setSelectedRequestIds([]);
    setShowPricingModal(false);
    setPricingTitle('');
    setPricingLineItems([{ id: generateLineItemId(), description: '', quantity: 1, unitPrice: 0 }]);
  };

  // Line item helpers
  const addLineItem = () => {
    setPricingLineItems([
      ...pricingLineItems,
      { id: generateLineItemId(), description: '', quantity: 1, unitPrice: 0 },
    ]);
  };

  const removeLineItem = (id: string) => {
    if (pricingLineItems.length > 1) {
      setPricingLineItems(pricingLineItems.filter(item => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof PricingLineItem, value: string | number) => {
    setPricingLineItems(
      pricingLineItems.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Create pricing offer handler
  const handleCreatePricingOffer = async () => {
    if (!userData || !orgId || typeof orgId !== 'string') return;
    if (selectedRequestIds.length === 0) return;
    if (!pricingTitle.trim()) return;

    const validItems = pricingLineItems.filter(
      item => item.description.trim() && item.quantity > 0 && item.unitPrice > 0
    );
    if (validItems.length === 0) return;

    setIsCreatingPricing(true);
    try {
      const pricingOffer = await createPricingRequest(
        orgId,
        userData.id,
        userData.name || 'Unknown',
        {
          title: pricingTitle.trim(),
          lineItems: validItems,
          currency: pricingCurrency,
          requestIds: selectedRequestIds,
        }
      );

      // Optionally send immediately
      await sendPricingRequest(pricingOffer.id);

      clearSelection();
    } catch (error) {
      console.error('Failed to create pricing offer:', error);
    } finally {
      setIsCreatingPricing(false);
    }
  };

  const selectedRequests = requests.filter(r => selectedRequestIds.includes(r.id));
  const totalAmount = calculateTotalAmount(pricingLineItems);

  if (error) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <h2 className="text-xl font-bold text-surface-900 dark:text-white font-outfit">
          {t('portal.common.error')}
        </h2>
        <p className="text-surface-500 dark:text-surface-400 max-w-sm">{error}</p>
        <PortalButton onClick={() => window.location.reload()}>
          {t('portal.common.retry')}
        </PortalButton>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 w-full min-w-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-0">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white font-outfit truncate">
            {t('portal.requests.title')}
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1 font-medium truncate font-outfit">
            {t('portal.dashboard.subtitle')}
          </p>
        </div>
        <Link href={`/portal/org/${orgId}/requests/new/`} className="flex-shrink-0">
          <PortalButton className="flex items-center gap-2 shadow-lg shadow-blue-500/20 font-outfit whitespace-nowrap">
            <Plus size={18} />
            {t('portal.requests.newRequest')}
          </PortalButton>
        </Link>
      </div>

      <PortalCard
        noPadding
        className="overflow-hidden border-surface-200 dark:border-surface-800 shadow-sm bg-white dark:bg-surface-950 w-full min-w-0"
      >
        {/* Toolbar */}
        <div className="p-4 border-b border-surface-100 dark:border-surface-800 flex flex-col lg:flex-row lg:items-center gap-4 bg-surface-50/50 dark:bg-surface-900/50 min-w-0">
          <div className="relative w-full lg:w-96 min-w-0 flex-shrink-0">
            <Search
              className="absolute start-3 top-1/2 -transurface-y-1/2 text-surface-400"
              size={16}
            />
            <input
              type="text"
              placeholder={t('portal.header.searchPlaceholder')}
              className="portal-input ps-10 h-10 border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-950 font-medium w-full min-w-0 font-outfit"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide min-w-0 flex-1">
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-surface-400 uppercase tracking-widest shrink-0">
              <Filter size={12} /> {t('portal.common.filter')}:
            </div>
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  'px-3 py-1.5 text-sm font-bold rounded-lg whitespace-nowrap transition-all font-outfit shrink-0',
                  activeFilter === filter
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-surface-500 hover:bg-surface-200 dark:hover:bg-surface-800'
                )}
              >
                {filter === 'All'
                  ? t('portal.common.all' as any)
                  : isAgency
                    ? t(`portal.requests.status.${filter.toLowerCase()}` as any)
                    : CLIENT_STATUS_CONFIG[filter as ClientStatus]?.label || filter}
              </button>
            ))}
          </div>
        </div>

        {/* Selection Bar - Agency Only */}
        {isAgency && selectedRequestIds.length > 0 && (
          <div className="p-4 border-b border-surface-100 dark:border-surface-800 bg-blue-50 dark:bg-blue-900/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {selectedRequestIds.length}
              </div>
              <span className="text-sm font-bold text-blue-800 dark:text-blue-200">
                {t('portal.requests.selected' as never) ||
                  `${selectedRequestIds.length} requests selected`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <PortalButton
                variant="outline"
                size="sm"
                onClick={clearSelection}
                className="text-surface-600 dark:text-surface-300"
              >
                <X size={14} className="me-1" />
                {t('portal.common.cancel' as never) || 'Cancel'}
              </PortalButton>
              <PortalButton
                size="sm"
                onClick={() => setShowPricingModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <DollarSign size={14} className="me-1" />
                {t('portal.requests.createPricingOffer' as never) || 'Create Pricing Offer'}
              </PortalButton>
            </div>
          </div>
        )}

        {/* Table Content */}
        <div className="overflow-x-auto w-full min-w-0">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="skeleton" exit={{ opacity: 0 }} className="p-4" role="status" aria-live="polite">
                <SkeletonTable rows={8} columns={6} />
                <span className="sr-only">Loading requests...</span>
              </motion.div>
            ) : filteredRequests.length > 0 ? (
              <motion.div 
                key="content"
                variants={skeletonToContent}
                initial="hidden"
                animate="visible"
              >
                {/* Mobile Card View */}
                <div className="md:hidden space-y-4 p-4">
                  {paginatedRequests.map(req => (
                    <motion.div
                      layoutId={isMobile ? `request-container-${req.id}` : undefined}
                      key={req.id}
                      onClick={() => router.push(`/portal/org/${orgId}/requests/${req.id}/`)}
                      className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-4 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
                    >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex flex-col min-w-0 me-2">
                        <motion.span layoutId={isMobile ? `request-title-${req.id}` : undefined} className="font-bold text-surface-900 dark:text-white font-outfit truncate text-sm">
                          {req.title}
                        </motion.span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded text-[10px] tracking-tight text-surface-500">
                            {req.id.slice(0, 8)}
                          </span>
                          <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest truncate">
                            {req.type || t('portal.common.general')}
                          </span>
                        </div>
                      </div>
                      <div
                        className={cn(
                          'w-2 h-2 rounded-full shrink-0 mt-1.5',
                          req.priority === 'HIGH' || req.priority === 'URGENT'
                            ? 'bg-rose-500'
                            : req.priority === 'NORMAL'
                              ? 'bg-amber-500'
                              : 'bg-blue-500'
                        )}
                      />
                    </div>

                    {req.lastComment && (
                      <div className="bg-surface-50 dark:bg-surface-800/50 rounded-lg p-2.5 mb-3 border border-surface-100 dark:border-surface-800">
                        <div className="flex items-center gap-1.5 mb-1">
                          <MessageSquare size={10} className="text-blue-500" />
                          <span className="text-[10px] font-bold text-surface-700 dark:text-surface-300">
                            {req.lastComment.userName}
                          </span>
                        </div>
                        <p className="text-xs text-surface-500 dark:text-surface-400 line-clamp-2">
                          {req.lastComment.content}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-surface-100 dark:border-surface-800">
                      <motion.div layoutId={isMobile ? `request-status-${req.id}` : undefined}>
                        {isAgency ? (
                          <PortalBadge
                            variant={mapStatusColor(STATUS_CONFIG[req.status]?.color || 'gray')}
                            className="text-[10px]"
                          >
                            {t(`portal.requests.status.${req.status.toLowerCase()}` as any)}
                          </PortalBadge>
                        ) : (
                          <PortalBadge
                            variant={mapStatusColor(
                              CLIENT_STATUS_CONFIG[CLIENT_STATUS_MAP[req.status]]?.color || 'gray'
                            )}
                            className="text-[10px]"
                          >
                            {CLIENT_STATUS_CONFIG[CLIENT_STATUS_MAP[req.status]]?.label}
                          </PortalBadge>
                        )}
                      </motion.div>

                      <span className="text-[10px] font-bold text-surface-400 font-outfit">
                        {req.createdAt?.toDate
                          ? format(req.createdAt.toDate(), 'MMM d', {
                              locale: locale === 'he' ? he : enUS,
                            })
                          : ''}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Desktop Table View */}
              <table className="hidden md:table w-full text-start border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-surface-50/50 dark:bg-surface-900/50 cursor-default">
                    {isAgency && (
                      <th className="px-3 py-4 w-12">{/* Select All - could add later */}</th>
                    )}
                    <th className="px-3 md:px-6 py-4 text-[11px] font-black text-surface-400 uppercase tracking-widest min-w-[200px]">
                      {t('portal.requests.table.title')}
                    </th>
                    <th className="px-3 md:px-6 py-4 text-[11px] font-black text-surface-400 uppercase tracking-widest text-center whitespace-nowrap">
                      {t('portal.requests.table.status')}
                    </th>
                    <th className="px-3 md:px-6 py-4 text-[11px] font-black text-surface-400 uppercase tracking-widest text-center whitespace-nowrap">
                      {t('portal.requests.table.priority')}
                    </th>
                    <th className="px-3 md:px-6 py-4 text-[11px] font-black text-surface-400 uppercase tracking-widest text-center whitespace-nowrap hidden md:table-cell">
                      {t('portal.requests.table.created')}
                    </th>
                    <th className="px-3 md:px-6 py-4 text-[11px] font-black text-surface-400 uppercase tracking-widest text-end whitespace-nowrap">
                      {t('portal.common.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                  {paginatedRequests.map(req => {
                    const isSelected = selectedRequestIds.includes(req.id);
                    const canSelect =
                      isAgency &&
                      !req.pricingOfferId &&
                      req.status !== 'PAID' &&
                      req.status !== 'CLOSED';
                    return (
                      <motion.tr
                        layoutId={!isMobile ? `request-container-${req.id}` : undefined}
                        key={req.id}
                        onClick={() => router.push(`/portal/org/${orgId}/requests/${req.id}/`)}
                        className={cn(
                          'hover:bg-surface-50/50 dark:hover:bg-surface-800/30 transition-all group cursor-pointer',
                          isSelected && 'bg-blue-50 dark:bg-blue-900/10'
                        )}
                      >
                        {isAgency && (
                          <td className="px-3 py-4">
                            {canSelect && (
                              <button
                                type="button"
                                onClick={e => {
                                  e.stopPropagation();
                                  toggleRequestSelection(req.id);
                                }}
                                className={cn(
                                  'w-5 h-5 rounded flex items-center justify-center transition-all border-2',
                                  isSelected
                                    ? 'bg-blue-600 border-blue-600 text-white'
                                    : 'border-surface-300 dark:border-surface-600 hover:border-blue-400'
                                )}
                              >
                                {isSelected && <Check size={12} />}
                              </button>
                            )}
                            {req.pricingOfferId && (
                              <PortalBadge variant="green" className="text-[9px]">
                                {t('portal.requests.hasPricing' as never) || 'Priced'}
                              </PortalBadge>
                            )}
                          </td>
                        )}
                        <td className="px-3 md:px-6 py-4 min-w-0">
                          <div className="flex flex-col min-w-0">
                            <motion.span layoutId={!isMobile ? `request-title-${req.id}` : undefined} className="font-bold text-surface-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate font-outfit">
                              {req.title}
                            </motion.span>
                            {req.lastComment && (
                              <span className="text-xs text-surface-500 dark:text-surface-400 font-medium truncate mt-0.5 max-w-full flex items-center gap-1 pe-4">
                                <span className="font-bold text-surface-700 dark:text-surface-300 shrink-0">
                                  {req.lastComment.userName}:
                                </span>
                                <span className="truncate">{req.lastComment.content}</span>
                              </span>
                            )}
                            <span className="text-xs font-bold text-surface-400 flex items-center gap-1.5 mt-1 font-outfit flex-wrap">
                              {t('portal.requests.table.id')}:{' '}
                              <span className="font-mono bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded text-[10px] tracking-tight shrink-0">
                                {req.id.slice(0, 8)}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-surface-300 shrink-0" />
                              <span className="uppercase tracking-wider text-[10px] truncate">
                                {req.type || t('portal.common.general')}
                              </span>
                            </span>
                          </div>
                        </td>
                        <td className="px-3 md:px-6 py-4">
                          <div className="flex justify-center">
                            <motion.div layoutId={!isMobile ? `request-status-${req.id}` : undefined}>
                              {isAgency ? (
                                <PortalBadge
                                  variant={mapStatusColor(STATUS_CONFIG[req.status]?.color || 'gray')}
                                >
                                  {t(`portal.requests.status.${req.status.toLowerCase()}` as any)}
                                </PortalBadge>
                              ) : (
                                <PortalBadge
                                  variant={mapStatusColor(
                                    CLIENT_STATUS_CONFIG[CLIENT_STATUS_MAP[req.status]]?.color ||
                                      'gray'
                                  )}
                                >
                                  {CLIENT_STATUS_CONFIG[CLIENT_STATUS_MAP[req.status]]?.label}
                                </PortalBadge>
                              )}
                            </motion.div>
                          </div>
                        </td>
                        <td className="px-3 md:px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <div
                              className={cn(
                                'w-2 h-2 rounded-full shrink-0',
                                req.priority === 'HIGH' || req.priority === 'URGENT'
                                  ? 'bg-rose-500 shadow-sm shadow-rose-500/50'
                                  : req.priority === 'NORMAL'
                                    ? 'bg-amber-500 shadow-sm shadow-amber-500/50'
                                    : 'bg-blue-500 shadow-sm shadow-blue-500/50'
                              )}
                            />
                            <span className="text-sm font-bold text-surface-600 dark:text-surface-300 font-outfit whitespace-nowrap">
                              {t(`portal.requests.priority.${req.priority.toLowerCase()}` as any)}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 md:px-6 py-4 hidden md:table-cell">
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-bold text-surface-800 dark:text-surface-200 font-outfit whitespace-nowrap">
                              {req.createdAt?.toDate
                                ? format(req.createdAt.toDate(), 'MMM d, yyyy', {
                                    locale: locale === 'he' ? he : enUS,
                                  })
                                : t('portal.common.recently')}
                            </span>
                            <span className="text-[10px] font-black text-surface-400 uppercase tracking-tighter">
                              {t('portal.requests.table.created')}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 md:px-6 py-4 text-end">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                router.push(`/portal/org/${orgId}/requests/${req.id}/`);
                              }}
                              className="p-2 text-surface-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                              <MessageSquare size={16} />
                            </button>
                            <Dropdown
                              trigger={
                                <span className="p-2 text-surface-400 hover:text-surface-900 dark:hover:text-white transition-all rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 inline-flex">
                                  <MoreVertical size={16} />
                                </span>
                              }
                              items={[
                                {
                                  label: 'Edit Request',
                                  onClick: () => console.log('Edit request', req.id),
                                  icon: <Edit size={16} />,
                                },
                                {
                                  label: 'Archive',
                                  onClick: () => console.log('Archive request', req.id),
                                  icon: <Archive size={16} />,
                                },
                                {
                                  label: 'Delete',
                                  onClick: () => {
                                    if (confirm('Delete this request?')) {
                                      console.log('Delete request', req.id);
                                    }
                                  },
                                  icon: <Trash2 size={16} />,
                                  variant: 'danger',
                                },
                              ]}
                            />
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </motion.div>
            ) : (
              <PortalEmptyState
              icon={Search}
              title={t('portal.requests.emptyTitle')}
              description={
                searchQuery || activeFilter !== 'All'
                  ? t('portal.requests.emptySearch')
                  : t('portal.requests.emptyDescription')
              }
              action={
                !searchQuery && activeFilter === 'All' ? (
                  <Link href={`/portal/org/${orgId}/requests/new/`}>
                    <PortalButton className="h-11 px-8 font-outfit shadow-lg shadow-blue-500/20">
                      <Plus size={18} className="me-2" />
                      {t('portal.requests.newRequest')}
                    </PortalButton>
                  </Link>
                ) : undefined
              }
              className="py-20"
            />
          )}
          </AnimatePresence>
        </div>

        {/* Footer info */}
        {!loading && filteredRequests.length > 0 && (
          <div className="p-5 border-t border-surface-100 dark:border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-50/30 dark:bg-surface-900/30 min-w-0">
            <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest truncate min-w-0">
              {t('portal.common.showing', {
                count: paginatedRequests.length,
                total: filteredRequests.length,
              })}
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

      {/* Pricing Modal */}
      {showPricingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-surface-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-surface-200 dark:border-surface-800 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-surface-900 dark:text-white font-outfit">
                  {t('portal.requests.createPricingOffer' as never) || 'Create Pricing Offer'}
                </h2>
                <p className="text-sm text-surface-500 mt-1">
                  {selectedRequests.length}{' '}
                  {t('portal.requests.requestsIncluded' as never) || 'requests included'}
                </p>
              </div>
              <button
                onClick={clearSelection}
                className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-colors"
              >
                <X size={20} className="text-surface-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Selected Requests Preview */}
              <div>
                <label className="block text-xs font-bold text-surface-500 mb-2 uppercase tracking-widest">
                  {t('portal.requests.selectedRequests' as never) || 'Selected Requests'}
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedRequests.map(req => (
                    <div
                      key={req.id}
                      className="flex items-center gap-2 p-2 bg-surface-50 dark:bg-surface-800 rounded-lg"
                    >
                      <span className="font-medium text-surface-900 dark:text-white text-sm truncate">
                        {req.title}
                      </span>
                      <PortalBadge variant="gray" className="text-[9px] ms-auto shrink-0">
                        {req.type}
                      </PortalBadge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Title */}
              <div>
                <label className="block text-xs font-bold text-surface-500 mb-2 uppercase tracking-widest">
                  {t('portal.pricing.form.titleLabel' as never) || 'Offer Title'} *
                </label>
                <input
                  type="text"
                  value={pricingTitle}
                  onChange={e => setPricingTitle(e.target.value)}
                  placeholder={
                    t('portal.pricing.form.titlePlaceholder' as never) ||
                    'e.g., Website Redesign Package'
                  }
                  className="portal-input w-full"
                />
              </div>

              {/* Currency */}
              <div>
                <label className="block text-xs font-bold text-surface-500 mb-2 uppercase tracking-widest">
                  {t('portal.pricing.form.currency' as never) || 'Currency'}
                </label>
                <select
                  value={pricingCurrency}
                  onChange={e => setPricingCurrency(e.target.value as Currency)}
                  className="portal-input w-full"
                >
                  {Object.entries(CURRENCY_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.symbol} {config.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Line Items */}
              <div>
                <label className="block text-xs font-bold text-surface-500 mb-2 uppercase tracking-widest">
                  {t('portal.pricing.form.lineItems' as never) || 'Line Items'} *
                </label>
                <div className="space-y-3">
                  {pricingLineItems.map(item => (
                    <div
                      key={item.id}
                      className="p-3 bg-surface-50 dark:bg-surface-800 rounded-xl space-y-2"
                    >
                      <input
                        type="text"
                        placeholder={
                          t('portal.pricing.form.itemDescription' as never) || 'Description'
                        }
                        value={item.description}
                        onChange={e => updateLineItem(item.id, 'description', e.target.value)}
                        className="portal-input w-full h-9 text-sm"
                      />
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          min="1"
                          placeholder={t('portal.pricing.form.quantity' as never) || 'Qty'}
                          value={item.quantity || ''}
                          onChange={e =>
                            updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 0)
                          }
                          className="portal-input h-9 text-sm w-20"
                        />
                        <span className="text-surface-400">×</span>
                        <div className="relative flex-1">
                          <span className="absolute start-3 top-1/2 -transurface-y-1/2 text-surface-400 text-sm">
                            $
                          </span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder={t('portal.pricing.form.unitPrice' as never) || 'Price'}
                            value={item.unitPrice ? (item.unitPrice / 100).toFixed(2) : ''}
                            onChange={e =>
                              updateLineItem(
                                item.id,
                                'unitPrice',
                                Math.round(parseFloat(e.target.value || '0') * 100)
                              )
                            }
                            className="portal-input h-9 text-sm ps-7 w-full"
                          />
                        </div>
                        {pricingLineItems.length > 1 && (
                          <button
                            onClick={() => removeLineItem(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      {item.quantity > 0 && item.unitPrice > 0 && (
                        <div className="text-end text-xs font-bold text-surface-500">
                          = {formatCurrency(item.unitPrice * item.quantity, pricingCurrency)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addLineItem}
                  className="mt-3 w-full p-2 border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-xl text-surface-500 hover:border-blue-400 hover:text-blue-600 transition-colors text-sm font-medium"
                >
                  <Plus size={16} className="inline me-1" />
                  {t('portal.pricing.form.addItem' as never) || 'Add Item'}
                </button>
              </div>

              {/* Total */}
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-between">
                <span className="text-sm font-bold text-surface-600 dark:text-surface-300">
                  {t('portal.pricing.form.total' as never) || 'Total'}
                </span>
                <span className="text-2xl font-black text-green-600 font-outfit">
                  {formatCurrency(totalAmount, pricingCurrency)}
                </span>
              </div>
            </div>

            <div className="p-6 border-t border-surface-200 dark:border-surface-800 flex items-center justify-end gap-3">
              <PortalButton variant="outline" onClick={clearSelection}>
                {t('portal.common.cancel' as never) || 'Cancel'}
              </PortalButton>
              <PortalButton
                onClick={handleCreatePricingOffer}
                disabled={
                  isCreatingPricing ||
                  !pricingTitle.trim() ||
                  !pricingLineItems.some(i => i.description && i.unitPrice > 0)
                }
                className="bg-green-600 hover:bg-green-700"
              >
                {isCreatingPricing ? (
                  <Loader2 size={16} className="animate-spin me-2" />
                ) : (
                  <DollarSign size={16} className="me-2" />
                )}
                {t('portal.requests.createAndSend' as never) || 'Create & Send Offer'}
              </PortalButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
