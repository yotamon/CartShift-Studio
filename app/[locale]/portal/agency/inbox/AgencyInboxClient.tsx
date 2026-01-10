'use client';

import { useState, useEffect, useMemo } from 'react';
import { PortalCard } from '@/components/portal/ui/PortalCard';
import { PortalBadge } from '@/components/portal/ui/PortalBadge';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import {
  Search,
  Mail,
  Filter,
  MoreVertical,
  Pin,
  Loader2,
  DollarSign,
  X,
  Check,
  ShieldCheck,
  MousePointer2,
  Eye,
} from 'lucide-react';
import { Dropdown } from '@/components/ui/Dropdown';

import { useRequests } from '@/lib/hooks/useRequests';
import { useAgencyClients } from '@/lib/hooks/useAgencyClients';
import { Organization } from '@/lib/types/portal';
import { formatDistanceToNow } from 'date-fns';
import { getDateLocale } from '@/lib/locale-config';
import { useRouter } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { PortalAvatar } from '@/components/portal/ui/PortalAvatar';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';
import { usePinnedRequests } from '@/lib/hooks/usePinnedRequests';

import { useOrg } from '@/lib/context/OrgContext';
import { cn } from '@/lib/utils';
// Centralized utilities
import { getStatusBadgeVariant } from '@/lib/utils/portal-helpers';

export default function AgencyInboxClient() {
  const t = useTranslations('portal');
  const locale = useLocale();
  const { userData, loading: authLoading, isAuthenticated, user } = usePortalAuth();
  const {
    requests,
    loading: requestsLoading,
    error: requestsError,
    refetch: refetchRequests,
  } = useRequests();
  const { switchOrg } = useOrg();
  const router = useRouter();
  const {
    organizations: organizationsList,
    loading: clientsLoading,
    error: clientsError,
  } = useAgencyClients();

  const organizations = useMemo(() => {
    if (!organizationsList) return {};
    const map: Record<string, Organization> = {};
    organizationsList.forEach(org => {
      map[org.id] = org;
    });
    return map;
  }, [organizationsList]);

  const loading = requestsLoading || clientsLoading;
  const error = (typeof requestsError === 'string' ? requestsError : null) || (typeof clientsError === 'string' ? clientsError : null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRepairing, setIsRepairing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Pinning
  const { togglePin, isPinned } = usePinnedRequests();

  // Multi-select for pricing offers
  const [selectedRequestIds, setSelectedRequestIds] = useState<string[]>([]);

  // Prevent hydration mismatch for time-sensitive content
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRepair = async () => {
    if (!user) return;
    setIsRepairing(true);
    try {
      const { getFirestore, doc, updateDoc, setDoc, getDoc } = await import('firebase/firestore');
      const db = getFirestore();
      const userRef = doc(db, 'portal_users', user.uid);
      const snap = await getDoc(userRef);

      const updateData = {
        isAgency: true,
        accountType: 'AGENCY',
        updatedAt: new Date(),
      };

      if (snap.exists()) {
        await updateDoc(userRef, updateData);
      } else {
        await setDoc(userRef, {
          ...updateData,
          email: user.email,
          name: user.displayName || t('portal.common.agencyAdmin' as any),
          createdAt: new Date(),
        });
      }
      window.location.reload();
    } catch (err) {
      console.error('Repair failed:', err);
      alert(t('agency.inbox.repairFailed'));
    } finally {
      setIsRepairing(false);
    }
  };

  // Multi-select helpers
  const toggleRequestSelection = (requestId: string) => {
    setSelectedRequestIds(prev => {
      if (prev.includes(requestId)) {
        return prev.filter(id => id !== requestId);
      }

      const selectedReqs = requests.filter(r => prev.includes(r.id));
      const newReq = requests.find(r => r.id === requestId);

      if (newReq && selectedReqs.length > 0) {
        const selectedOrgId = selectedReqs[0]?.orgId;
        if (selectedOrgId && newReq.orgId !== selectedOrgId) {
          // Show which organizations are involved
          const selectedOrgName = organizations[selectedOrgId]?.name || t('portal.common.unknown' as any);
          const newOrgName = organizations[newReq.orgId]?.name || t('portal.common.unknown' as any);
          alert(
            `${t('agency.inbox.errors.sameOrgRequired')}\n\n` +
              `Currently selected: ${selectedOrgName}\n` +
              `Trying to add: ${newOrgName}`
          );
          return prev;
        }
      }

      return [...prev, requestId];
    });
  };

  const clearSelection = () => {
    setSelectedRequestIds([]);
    setIsSelectionMode(false);
  };

  const toggleSelectionMode = () => {
    if (isSelectionMode) {
      clearSelection();
    } else {
      setIsSelectionMode(true);
    }
  };

  // Create pricing offer handler
  const handleGoToPricing = async () => {
    if (selectedRequestIds.length === 0) return;

    const selectedReqs = requests.filter(r => selectedRequestIds.includes(r.id));
    const uniqueOrgIds = [...new Set(selectedReqs.map(r => r.orgId))];

    if (uniqueOrgIds.length > 1) {
      const orgNames = uniqueOrgIds
        .map(id => organizations[id]?.name || t('portal.common.unknown' as any))
        .join(', ');
      alert(
        `${t('agency.inbox.errors.sameOrgRequired')}\n\n` +
          `Selected requests are from: ${orgNames}\n\n` +
          'Please select requests from only one client organization.'
      );
      return;
    }

    const orgId = uniqueOrgIds[0];
    if (!orgId) return;

    // Switch context and navigate to full page form
    switchOrg(orgId);
    router.push(`/portal/pricing/new?requestIds=${selectedRequestIds.join(',')}`);
  };

  const selectedRequests = requests.filter(r => selectedRequestIds.includes(r.id));

  const filteredRequests = requests.filter(
    req =>
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.createdByName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white font-outfit">
            {t('agency.inbox.title')}
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            {t('agency.inbox.subtitle')}
          </p>
        </div>
      </div>

      <PortalCard
        noPadding
        className="overflow-hidden border-surface-200 dark:border-surface-800 shadow-sm"
      >
        <div className="p-4 border-b border-surface-100 dark:border-surface-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-surface-950">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <div className="relative flex-1 sm:flex-none">
              <Search
                size={16}
                className="absolute start-3 top-1/2 -translate-y-1/2 text-surface-400"
              />
              <input
                type="text"
                placeholder={t('agency.inbox.searchPlaceholder')}
                className="portal-input ps-10 w-full sm:w-64 md:w-80 h-10 border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900/50"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <PortalButton
              variant="outline"
              size="sm"
              className="hidden md:flex items-center gap-2 border-surface-200 dark:border-surface-700"
            >
              <Filter size={16} /> {t('common.filter')}
            </PortalButton>
            <PortalButton
              variant={isSelectionMode ? "secondary" : "primary"}
              size="sm"
              onClick={toggleSelectionMode}
              className="hidden md:flex items-center gap-2"
            >
              <MousePointer2 size={16} />
              {isSelectionMode ? t('common.cancel') : t('requests.createPricingOffer')}
            </PortalButton>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-surface-400 uppercase tracking-widest px-2 shrink-0">
            {filteredRequests.length}{' '}
            {t(
              (filteredRequests.length === 1 ? 'agency.inbox.activeItem' : 'agency.inbox.activeItems') as any
            )}
          </div>
        </div>

        {/* Selection Bar */}
        {isSelectionMode && (
          <div className="p-4 border-b border-surface-100 dark:border-surface-800 bg-blue-50 dark:bg-blue-900/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                {selectedRequestIds.length}
              </div>
              <span className="text-sm font-bold text-blue-800 dark:text-blue-200">
                {selectedRequestIds.length} {t('requests.selected')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <PortalButton
                variant="outline"
                size="sm"
                onClick={clearSelection}
                className="text-surface-600 dark:text-surface-300 min-h-[40px] touch-manipulation"
              >
                <X size={14} className="me-1" />
                {t('common.cancel')}
              </PortalButton>
              <PortalButton
                size="sm"
                onClick={handleGoToPricing}
                disabled={selectedRequestIds.length === 0}
                className="bg-green-600 hover:bg-green-700 text-white min-h-[40px] touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <DollarSign size={14} className="me-1" />
                <span className="hidden sm:inline">{t('requests.createPricingOffer')}</span>
                <span className="sm:hidden">Pricing</span>
              </PortalButton>
            </div>
          </div>
        )}

        <div className="divide-y divide-surface-100 dark:divide-surface-800">
          {loading || (authLoading && !error) ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm font-medium text-surface-400">{t('agency.inbox.loading')}</p>
            </div>
          ) : !userData?.isAgency && isAuthenticated ? (
            <div className="py-20 text-center px-4">
              <ShieldCheck className="w-16 h-16 text-red-100 dark:text-red-900/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-surface-900 dark:text-white">
                {t('agency.inbox.accessRequired')}
              </h3>
              <p className="text-surface-500 dark:text-surface-400 text-sm mt-1 max-w-sm mx-auto mb-6">
                {t('agency.inbox.accessDenied', { email: user?.email || '' })}
              </p>
              <PortalButton
                onClick={handleRepair}
                disabled={isRepairing}
                variant="outline"
                size="sm"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                {isRepairing ? <Loader2 className="animate-spin me-2" size={14} /> : null}
                {t('agency.inbox.repairPermissions')}
              </PortalButton>
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <Mail className="w-16 h-16 text-red-100 dark:text-red-900/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-red-600 dark:text-red-400">Permission Error</h3>
              <p className="text-surface-500 dark:text-surface-400 text-sm mt-1 max-w-sm mx-auto">
                {error}
              </p>
            </div>
          ) : filteredRequests.length > 0 ? (
            filteredRequests
              .map(req => {
                if (!req.orgId || !req.id) return null;
                const isSelected = selectedRequestIds.includes(req.id);
                const canSelect =
                  !req.pricingOfferId && req.status !== 'PAID' && req.status !== 'CLOSED';

                return (
                  <div
                    key={req.id}
                    className={cn(
                      'flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 sm:p-5 hover:bg-surface-50/80 dark:hover:bg-surface-800/40 transition-all group',
                      isSelected && 'bg-blue-50 dark:bg-blue-900/10'
                    )}
                  >
                    {/* Mobile: Top row with checkbox, avatar, org name */}
                    <div className="flex items-center gap-3">
                      {/* Checkbox - Only in selection mode */}
                      {isSelectionMode && (
                        <div className="shrink-0 animate-in fade-in zoom-in duration-200">
                          {canSelect ? (
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                toggleRequestSelection(req.id);
                              }}
                              className={cn(
                                'w-5 h-5 rounded flex items-center justify-center transition-all border-2 touch-manipulation',
                                isSelected
                                  ? 'bg-blue-600 border-blue-600 text-white'
                                  : 'border-surface-300 dark:border-surface-600 hover:border-blue-400'
                              )}
                            >
                              {isSelected && <Check size={14} />}
                            </button>
                          ) : req.pricingOfferId ? (
                             <div
                               className="w-5 h-5 rounded border-2 border-surface-200 dark:border-surface-700 bg-surface-100 dark:bg-surface-800 cursor-not-allowed flex items-center justify-center"
                               title={t('requests.hasPricing')}
                             >
                               {/* Disabled checkbox look */}
                             </div>
                          ) : (
                            <div className="w-5 h-5" />
                          )}
                        </div>
                      )}

                      {/* Star and Avatar - hidden on mobile to save space */}
                      <div className="hidden sm:flex items-center gap-3 shrink-0">
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            togglePin(req.id);
                          }}
                          className={cn(
                            'p-1 transition-colors hover:bg-surface-100 dark:hover:bg-surface-800 rounded-full',
                            isPinned(req.id)
                              ? 'text-blue-600 dark:text-blue-400 transform rotate-45'
                              : 'text-surface-300 group-hover:text-blue-600'
                          )}
                        >
                          <Pin size={18} className={cn(isPinned(req.id) && 'fill-current')} />
                        </button>
                        <PortalAvatar
                          name={req.createdByName || t('consultations.userFallback')}
                          size="md"
                          className="ring-2 ring-white dark:ring-surface-900 shadow-sm"
                        />
                      </div>

                      {/* Mobile: Show org name and time inline */}
                      <div className="sm:hidden flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider truncate">
                            {organizations[req.orgId]?.name || t('agency.inbox.clientOrg')}
                          </p>
                          <span className="text-[10px] font-bold text-surface-400 whitespace-nowrap">
                            {isMounted && req.createdAt?.toDate
                              ? formatDistanceToNow(req.createdAt.toDate(), {
                                  addSuffix: false,
                                  locale: getDateLocale(locale),
                                })
                              : '—'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Main content link */}
                    {/* Main content link */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        switchOrg(req.orgId);
                        router.push(`/portal/requests/${req.id}/`);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          switchOrg(req.orgId);
                          router.push(`/portal/requests/${req.id}/`);
                        }
                      }}
                      className="flex-1 min-w-0 touch-manipulation text-start cursor-pointer focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 rounded-lg"
                    >
                      {/* Desktop layout */}
                      <div className="hidden sm:grid grid-cols-4 gap-4 items-center">
                        <div className="col-span-1">
                          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider truncate mb-1">
                            {organizations[req.orgId]?.name || t('agency.inbox.clientOrg')}
                          </p>
                          <p className="text-sm font-bold text-surface-900 dark:text-white truncate">
                            {req.createdByName || t('consultations.userFallback')}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-bold text-surface-900 dark:text-white truncate group-hover:text-blue-600 transition-colors font-outfit">
                              {req.title}
                            </p>
                            <PortalBadge
                              variant={getStatusBadgeVariant(req.status)}
                              className="text-[9px] h-4 shrink-0"
                            >
                              {t(`requests.status.${req.status.toLowerCase()}` as any)}
                            </PortalBadge>
                          </div>
                          <p className="text-xs text-surface-500 truncate mt-0.5">
                            {req.description?.slice(0, 100)}...
                          </p>
                        </div>
                        <div className="col-span-1 text-end flex items-center justify-end gap-4">
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-surface-500 whitespace-nowrap uppercase tracking-widest leading-none mb-1">
                              {isMounted && req.createdAt?.toDate
                                ? formatDistanceToNow(req.createdAt.toDate(), {
                                    addSuffix: true,
                                    locale: getDateLocale(locale),
                                  })
                                : '—'}
                            </span>
                          </div>
                          <Dropdown
                            trigger={
                              <button
                                type="button"
                                onClick={e => e.stopPropagation()}
                                className="opacity-0 group-hover:opacity-100 p-2 text-surface-400 hover:text-surface-900 dark:hover:text-white transition-all rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 outline-none focus:opacity-100"
                              >
                                <MoreVertical size={16} />
                              </button>
                            }
                            items={[
                              {
                                label: t('common.viewDetails'),
                                icon: <Eye size={14} />,
                                onClick: () => {
                                  switchOrg(req.orgId);
                                  router.push(`/portal/requests/${req.id}/`);
                                },
                              },
                              {
                                label: isPinned(req.id) ? t('common.unpin') : t('common.pin'),
                                icon: <Pin size={14} className={cn(isPinned(req.id) && 'fill-blue-600 text-blue-600')} />,
                                onClick: () => {
                                  togglePin(req.id);
                                },
                              },
                            ]}
                          />
                        </div>
                      </div>

                      {/* Mobile layout */}
                      <div className="sm:hidden space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-bold text-surface-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors font-outfit">
                            {req.title}
                          </p>
                          <PortalBadge
                            variant={getStatusBadgeVariant(req.status)}
                            className="text-[9px] h-4 shrink-0"
                          >
                            {t(`requests.status.${req.status.toLowerCase()}` as any)}
                          </PortalBadge>
                        </div>
                        <p className="text-xs text-surface-500 line-clamp-2">
                          {req.description?.slice(0, 80)}...
                        </p>
                        <p className="text-xs font-medium text-surface-400">
                          {req.createdByName || t('consultations.userFallback')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
              .filter(Boolean)
          ) : (
            <div className="py-20 text-center">
              <Mail className="w-16 h-16 text-surface-100 dark:text-surface-800 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-surface-900 dark:text-white">
                {t('agency.inbox.emptyTitle')}
              </h3>
              <p className="text-surface-500 dark:text-surface-400 text-sm mt-1 max-w-sm mx-auto">
                {t('agency.inbox.emptyDesc')}
              </p>
            </div>
          )}
        </div>
      </PortalCard>


    </div>
  );
}
