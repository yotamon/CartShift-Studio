'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import { skeletonToContent } from '@/lib/animation-variants';
import {
  Plus,
  Search,
  MoreVertical,
  MessageSquare,
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
import { SkeletonTable } from '@/components/portal/ui/Skeleton';
import { PortalEmptyState } from '@/components/portal/ui/PortalEmptyState';
import { Dropdown } from '@/components/ui/Dropdown';
import { createPricingRequest, sendPricingRequest } from '@/lib/services/pricing-requests';
import { useRequests } from '@/lib/hooks/useRequests';
import {
  Currency,
  CURRENCY_CONFIG,
  formatCurrency,
  CLIENT_STATUS_MAP,
  ClientStatus,
} from '@/lib/types/portal';
import { format } from 'date-fns';
import { getDateLocale } from '@/lib/locale-config';
import { cn } from '@/lib/utils';
import { useTranslations, useLocale } from 'next-intl';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';
import { usePricingForm } from '@/lib/hooks/usePricingForm';
import { useResolvedOrgId } from '@/lib/hooks/useResolvedOrgId';
import { Link, useRouter } from '@/i18n/navigation';
// Centralized utilities - no more duplicate mapStatusColor!
import { getStatusBadgeVariant, getClientStatusBadgeVariant } from '@/lib/utils/portal-helpers';
import { PinButton } from '@/components/portal/PinnedRequests';
import { usePinnedRequests } from '@/lib/hooks/usePinnedRequests';

export default function RequestsClient() {
  const orgId = useResolvedOrgId();
  const router = useRouter();
  const { userData, loading: authLoading, isAgency } = usePortalAuth();
  const { requests, loading: requestsLoading, error: requestsError } = useRequests();
  const { pinnedIds } = usePinnedRequests(orgId as string);

  const [isMobile, setIsMobile] = useState(false);
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
  const [isCreatingPricing, setIsCreatingPricing] = useState(false);

  // Use centralized pricing form hook
  const {
    lineItems: pricingLineItems,
    currency: pricingCurrency,
    setCurrency: setPricingCurrency,
    addLineItem,
    removeLineItem,
    updateLineItem,
    resetForm: resetPricingForm,
    totalAmount,
    validItems,
  } = usePricingForm('USD');

  const clientFilters: ClientStatus[] = ['SUBMITTED', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED'];
  const filters = isAgency
    ? ['All', 'NEW', 'IN_PROGRESS', 'IN_REVIEW', 'DELIVERED', 'CLOSED']
    : ['All', ...clientFilters];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const loading = authLoading || requestsLoading;
  const error = requestsError;

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  // Filter and sort requests - pinned items appear at the top
  const filteredRequests = requests
    .filter(req => {
      let matchesFilter = activeFilter === 'All';
      if (!matchesFilter) {
        if (isAgency) {
          matchesFilter = req.status === activeFilter;
        } else {
          matchesFilter = CLIENT_STATUS_MAP[req.status] === activeFilter;
        }
      }

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        (req.title?.toLowerCase() || '').includes(query) ||
        (req.id?.toLowerCase() || '').includes(query) ||
        (req.description?.toLowerCase() || '').includes(query) ||
        (req.type?.toLowerCase() || '').includes(query) ||
        (req.createdByName?.toLowerCase() || '').includes(query);
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      // Sort pinned requests to the top
      const aPinned = pinnedIds.includes(a.id);
      const bPinned = pinnedIds.includes(b.id);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return 0; // Maintain original order within pinned/unpinned groups
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
    resetPricingForm();
  };

  // Create pricing offer handler
  const handleCreatePricingOffer = async () => {
    if (!userData || !orgId || typeof orgId !== 'string') return;
    if (selectedRequestIds.length === 0) return;
    if (!pricingTitle.trim()) return;

    if (validItems.length === 0) return;

    setIsCreatingPricing(true);
    try {
      const pricingOffer = await createPricingRequest(
        orgId,
        userData.id,
        userData.name || t('portal.common.unknown'),
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
        <Link href="/portal/requests/new/" className="flex-shrink-0">
          <PortalButton
            variant="primary"
            leftIcon={<Plus size={18} />}
            className="font-outfit whitespace-nowrap"
          >
            {t('portal.requests.newRequest')}
          </PortalButton>
        </Link>
      </div>

      <PortalCard
        variant="glass"
        noPadding
        className="overflow-hidden w-full min-w-0"
      >
        {/* Toolbar */}
        <div className="p-4 border-b border-surface-100 dark:border-surface-800 flex flex-col lg:flex-row lg:items-center gap-4 bg-surface-50/50 dark:bg-surface-900/50 min-w-0">
          <div className="relative w-full lg:w-96 min-w-0 flex-shrink-0">
            <Search
              className="absolute start-3 top-1/2 -translate-y-1/2 text-surface-400"
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
                  'px-3 py-2.5 min-h-[40px] text-sm font-bold rounded-lg whitespace-nowrap transition-all font-outfit shrink-0 touch-manipulation active:scale-95',
                  activeFilter === filter
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-surface-500 hover:bg-surface-200 dark:hover:bg-surface-800'
                )}
              >
                {filter === 'All'
                  ? t('portal.common.all' as any)
                  : isAgency
                    ? t(`portal.requests.status.${filter.toLowerCase()}` as any)
                    : t(`portal.requests.clientStatus.${filter.toLowerCase()}` as any)}
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
                {t('portal.common.cancel')}
              </PortalButton>
              <PortalButton
                size="sm"
                onClick={() => setShowPricingModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <DollarSign size={14} className="me-1" />
                {t('portal.requests.createPricingOffer')}
              </PortalButton>
            </div>
          </div>
        )}

        {/* Table Content */}
        <div className="overflow-x-auto w-full min-w-0">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="skeleton"
                exit={{ opacity: 0 }}
                className="p-4"
                role="status"
                aria-live="polite"
              >
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
                      onClick={() => router.push(`/portal/requests/${req.id}/`)}
                      className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-4 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex flex-col min-w-0 me-2">
                          <motion.span
                            layoutId={isMobile ? `request-title-${req.id}` : undefined}
                            className="font-bold text-surface-900 dark:text-white font-outfit truncate text-sm"
                          >
                            {req.title}
                          </motion.span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-mono bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded text-[10px] tracking-tight text-surface-500">
                              {req.id.slice(0, 8)}
                            </span>
                            <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest truncate">
                              {req.type ? t(`portal.requests.type.${req.type.toLowerCase()}` as any) : t('portal.requests.type.design')}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <PinButton requestId={req.id} orgId={orgId as string} size="sm" />
                          <div
                            className={cn(
                              'w-2 h-2 rounded-full mt-1.5',
                              req.priority === 'HIGH' || req.priority === 'URGENT'
                                ? 'bg-rose-500'
                                : req.priority === 'NORMAL'
                                  ? 'bg-amber-500'
                                  : 'bg-blue-500'
                            )}
                          />
                        </div>
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
                              variant={getStatusBadgeVariant(req.status)}
                              className="text-[10px]"
                            >
                              {t(
                                `portal.requests.status.${req.status?.toLowerCase() || 'new'}` as any
                              )}
                            </PortalBadge>
                          ) : (
                            <PortalBadge
                              variant={getClientStatusBadgeVariant(req.status)}
                              className="text-[10px]"
                            >
                              {t(
                                `portal.requests.clientStatus.${CLIENT_STATUS_MAP[req.status]?.toLowerCase() || 'submitted'}` as any
                              )}
                            </PortalBadge>
                          )}
                        </motion.div>

                        <span className="text-[10px] font-bold text-surface-400 font-outfit">
                          {req.createdAt?.toDate
                            ? format(req.createdAt.toDate(), 'MMM d', {
                                locale: getDateLocale(locale),
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
                          onClick={() => router.push(`/portal/requests/${req.id}/`)}
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
                                  {t('portal.requests.hasPricing')}
                                </PortalBadge>
                              )}
                            </td>
                          )}
                          <td className="px-3 md:px-6 py-4 min-w-0">
                            <div className="flex flex-col min-w-0">
                              <motion.span
                                layoutId={!isMobile ? `request-title-${req.id}` : undefined}
                                className="font-bold text-surface-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate font-outfit"
                              >
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
                                  {req.type ? t(`portal.requests.type.${req.type.toLowerCase()}` as any) : t('portal.requests.type.design')}
                                </span>
                              </span>
                            </div>
                          </td>
                          <td className="px-3 md:px-6 py-4">
                            <div className="flex justify-center">
                              <motion.div
                                layoutId={!isMobile ? `request-status-${req.id}` : undefined}
                              >
                                {isAgency ? (
                                  <PortalBadge variant={getStatusBadgeVariant(req.status)}>
                                    {t(
                                      `portal.requests.status.${req.status?.toLowerCase() || 'new'}` as any
                                    )}
                                  </PortalBadge>
                                ) : (
                                  <PortalBadge variant={getClientStatusBadgeVariant(req.status)}>
                                    {t(
                                      `portal.requests.clientStatus.${CLIENT_STATUS_MAP[req.status]?.toLowerCase() || 'submitted'}` as any
                                    )}
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
                                {t(
                                  `portal.requests.priority.${req.priority?.toLowerCase() || 'normal'}` as any
                                )}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 md:px-6 py-4 hidden md:table-cell">
                            <div className="flex flex-col items-center">
                              <span className="text-sm font-bold text-surface-800 dark:text-surface-200 font-outfit whitespace-nowrap">
                                {req.createdAt?.toDate
                                  ? format(req.createdAt.toDate(), 'MMM d, yyyy', {
                                      locale: getDateLocale(locale),
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
                              <PinButton requestId={req.id} orgId={orgId as string} />
                              <button
                                type="button"
                                onClick={e => {
                                  e.stopPropagation();
                                  router.push(`/portal/requests/${req.id}/`);
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
                                    label: t('portal.common.edit'),
                                    onClick: () => console.log('Edit request', req.id),
                                    icon: <Edit size={16} />,
                                  },
                                  {
                                    label: t('portal.common.archive'),
                                    onClick: () => console.log('Archive request', req.id),
                                    icon: <Archive size={16} />,
                                  },
                                  {
                                    label: t('portal.common.delete'),
                                    onClick: () => {
                                      if (confirm(t('portal.common.deleteConfirm'))) {
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
                    <Link href="/portal/requests/new/">
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
                  {t('portal.requests.createPricingOffer')}
                </h2>
                <p className="text-sm text-surface-500 mt-1">
                  {selectedRequests.length} {t('portal.requests.requestsIncluded')}
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
                  {t('portal.requests.selectedRequests')}
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
                  {t('portal.pricing.form.titleLabel')} *
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
                  {t('portal.pricing.form.currency')}
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
                  {t('portal.pricing.form.lineItems')} *
                </label>
                <div className="space-y-3">
                  {pricingLineItems.map(item => (
                    <div
                      key={item.id}
                      className="p-3 bg-surface-50 dark:bg-surface-800 rounded-xl space-y-2"
                    >
                      <input
                        type="text"
                        placeholder={t('portal.pricing.form.itemDescription')}
                        value={item.description}
                        onChange={e => updateLineItem(item.id, 'description', e.target.value)}
                        className="portal-input w-full h-9 text-sm"
                      />
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          min="1"
                          placeholder={t('portal.pricing.form.quantity')}
                          value={item.quantity || ''}
                          onChange={e =>
                            updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 0)
                          }
                          className="portal-input h-9 text-sm w-20"
                        />
                        <span className="text-surface-400">×</span>
                        <div className="relative flex-1">
                          <span className="absolute start-3 top-1/2 -translate-y-1/2 text-surface-400 text-sm">
                            $
                          </span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder={t('portal.pricing.form.unitPrice')}
                            value={item.unitPrice ? (item.unitPrice / 100).toFixed(2) : ''}
                            onChange={e =>
                              updateLineItem(
                                item.id,
                                'unitPrice',
                                Math.round(parseFloat(e.target.value || '0') * 100)
                              )
                            }
                            className="portal-input h-9 text-sm w-full ps-6"
                          />
                        </div>
                        {pricingLineItems.length > 1 && (
                          <button
                            onClick={() => removeLineItem(item.id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addLineItem}
                    className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
                  >
                    <Plus size={16} />
                    {t('portal.pricing.form.addItem')}
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800 rounded-xl">
                <span className="font-bold text-surface-900 dark:text-white uppercase tracking-wider text-sm">
                  {t('portal.pricing.form.total')}
                </span>
                <span className="text-xl font-black text-blue-600 dark:text-blue-400 font-outfit">
                  {formatCurrency(totalAmount, pricingCurrency)}
                </span>
              </div>
            </div>

            <div className="p-6 border-t border-surface-200 dark:border-surface-800 flex justify-end gap-3">
              <PortalButton
                variant="outline"
                onClick={() => setShowPricingModal(false)}
                disabled={isCreatingPricing}
              >
                {t('portal.common.cancel')}
              </PortalButton>
              <PortalButton
                onClick={handleCreatePricingOffer}
                isLoading={isCreatingPricing}
                disabled={!pricingTitle.trim() || validItems.length === 0}
              >
                <Check size={18} className="me-2" />
                {t('portal.pricing.form.createOffer')}
              </PortalButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
