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
  Star,
  Loader2,
  DollarSign,
  X,
  Check,
  Plus,
  Trash2,
  ShieldCheck,
} from 'lucide-react';
import { createPricingRequest, sendPricingRequest } from '@/lib/services/pricing-requests';
import { useRequests } from '@/lib/hooks/useRequests';
import { useAgencyClients } from '@/lib/hooks/useAgencyClients';
import {
  Organization,
  Currency,
  CURRENCY_CONFIG,
  formatCurrency,
} from '@/lib/types/portal';
import { formatDistanceToNow } from 'date-fns';
import { getDateLocale } from '@/lib/locale-config';
import { Link } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { PortalAvatar } from '@/components/portal/ui/PortalAvatar';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';
import { usePricingForm } from '@/lib/hooks/usePricingForm';
import { cn } from '@/lib/utils';
// Centralized utilities
import { getStatusBadgeVariant } from '@/lib/utils/portal-helpers';

export default function AgencyInboxClient() {
  const t = useTranslations('portal');
  const locale = useLocale();
  const { userData, loading: authLoading, isAuthenticated, user } = usePortalAuth();
  const { requests, loading: requestsLoading, error: requestsError, refetch: refetchRequests } = useRequests();
  const { organizations: organizationsList, loading: clientsLoading, error: clientsError } = useAgencyClients();

  const organizations = useMemo(() => {
    if (!organizationsList) return {};
    const map: Record<string, Organization> = {};
    organizationsList.forEach(org => {
      map[org.id] = org;
    });
    return map;
  }, [organizationsList]);

  const loading = requestsLoading || clientsLoading;
  const error = (requestsError as Error)?.message || (clientsError as Error)?.message || null;
  const [searchQuery, setSearchQuery] = useState('');
  const [isRepairing, setIsRepairing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Multi-select for pricing offers
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
          name: user.displayName || t('portal.common.agencyAdmin'),
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
          const selectedOrgName = organizations[selectedOrgId]?.name || t('portal.common.unknown');
          const newOrgName = organizations[newReq.orgId]?.name || t('portal.common.unknown');
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
    setShowPricingModal(false);
    setPricingTitle('');
    resetPricingForm();
  };

  // Create pricing offer handler
  const handleCreatePricingOffer = async () => {
    if (!userData || selectedRequestIds.length === 0) return;
    if (!pricingTitle.trim()) return;

    if (validItems.length === 0) return;

    const selectedReqs = requests.filter(r => selectedRequestIds.includes(r.id));
    const uniqueOrgIds = [...new Set(selectedReqs.map(r => r.orgId))];

    if (uniqueOrgIds.length > 1) {
      const orgNames = uniqueOrgIds.map(id => organizations[id]?.name || t('portal.common.unknown')).join(', ');
      alert(
        `${t('agency.inbox.errors.sameOrgRequired')}\n\n` +
          `Selected requests are from: ${orgNames}\n\n` +
          'Please select requests from only one client organization.'
      );
      return;
    }

    const orgId = uniqueOrgIds[0];
    if (!orgId) return;

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

      await sendPricingRequest(pricingOffer.id);
      clearSelection();

      await refetchRequests();
    } catch (error) {
      console.error('Failed to create pricing offer:', error);
    } finally {
      setIsCreatingPricing(false);
    }
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
        <div className="p-4 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between bg-white dark:bg-surface-950">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search
                size={16}
                className="absolute start-3 top-1/2 -translate-y-1/2 text-surface-400"
              />
              <input
                type="text"
                placeholder={t('agency.inbox.searchPlaceholder')}
                className="portal-input ps-10 w-64 md:w-80 h-10 border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900/50"
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
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-surface-400 uppercase tracking-widest px-2">
            {filteredRequests.length} {t(filteredRequests.length === 1 ? 'agency.inbox.activeItem' : 'agency.inbox.activeItems')}
          </div>
        </div>

        {/* Selection Bar */}
        {selectedRequestIds.length > 0 && (
          <div className="p-4 border-b border-surface-100 dark:border-surface-800 bg-blue-50 dark:bg-blue-900/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
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
                className="text-slate-600 dark:text-slate-300"
              >
                <X size={14} className="me-1" />
                {t('common.cancel')}
              </PortalButton>
              <PortalButton
                size="sm"
                onClick={() => setShowPricingModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <DollarSign size={14} className="me-1" />
                {t('requests.createPricingOffer')}
              </PortalButton>
            </div>
          </div>
        )}

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
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
                      'flex items-center gap-4 p-5 hover:bg-surface-50/80 dark:hover:bg-surface-800/40 transition-all group',
                      isSelected && 'bg-blue-50 dark:bg-blue-900/10'
                    )}
                  >
                    {/* Checkbox */}
                    <div className="shrink-0">
                      {canSelect ? (
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
                              : 'border-slate-300 dark:border-slate-600 hover:border-blue-400'
                          )}
                        >
                          {isSelected && <Check size={12} />}
                        </button>
                      ) : req.pricingOfferId ? (
                        <PortalBadge variant="green" className="text-[9px]">
                          {t('requests.hasPricing')}
                        </PortalBadge>
                      ) : (
                        <div className="w-5 h-5" />
                      )}
                    </div>

                    <Link
                      href={`/portal/org/${req.orgId}/requests/${req.id}/`}
                      className="flex-1 flex items-center gap-4 min-w-0"
                    >
                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          type="button"
                          onClick={e => e.stopPropagation()}
                          className="p-1 text-surface-300 group-hover:text-amber-400 transition-colors"
                        >
                          <Star size={18} />
                        </button>
                        <PortalAvatar
                          name={req.createdByName || t('consultations.userFallback')}
                          size="md"
                          className="ring-2 ring-white dark:ring-surface-900 shadow-sm"
                        />
                      </div>

                      <div className="min-w-0 flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div className="md:col-span-1">
                          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider truncate mb-1">
                            {organizations[req.orgId]?.name || t('agency.inbox.clientOrg')}
                          </p>
                          <p className="text-sm font-bold text-surface-900 dark:text-white truncate">
                            {req.createdByName || t('consultations.userFallback')}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-surface-900 dark:text-white truncate group-hover:text-blue-600 transition-colors font-outfit">
                              {req.title}
                            </p>
                            <PortalBadge
                              variant={getStatusBadgeVariant(req.status)}
                              className="text-[9px] h-4"
                            >
                              {req.status}
                            </PortalBadge>
                          </div>
                          <p className="text-xs text-surface-500 truncate mt-0.5">
                            {req.description?.slice(0, 100)}...
                          </p>
                        </div>
                        <div className="md:col-span-1 text-end flex items-center justify-end gap-4">
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
                          <button
                            type="button"
                            onClick={e => e.stopPropagation()}
                            className="opacity-0 group-hover:opacity-100 p-2 text-surface-400 hover:text-surface-900 dark:hover:text-white transition-all rounded-full hover:bg-surface-100 dark:hover:bg-surface-800"
                          >
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </div>
                    </Link>
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

      {/* Pricing Modal */}
      {showPricingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">
                  {t('requests.createPricingOffer')}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {selectedRequests.length}{' '}
                  {t('requests.requestsIncluded')}
                </p>
              </div>
              <button
                onClick={clearSelection}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Selected Requests Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">
                  {t('requests.selectedRequests')}
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedRequests.map(req => (
                    <div
                      key={req.id}
                      className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg"
                    >
                      <span className="font-medium text-slate-900 dark:text-white text-sm truncate">
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
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">
                  {t('pricing.form.titleLabel')} *
                </label>
                <input
                  type="text"
                  value={pricingTitle}
                  onChange={e => setPricingTitle(e.target.value)}
                  placeholder={
                    t('pricing.form.titlePlaceholder')
                  }
                  className="portal-input w-full"
                />
              </div>

              {/* Currency */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">
                  {t('pricing.form.currency')}
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
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">
                  {t('pricing.form.lineItems')} *
                </label>
                <div className="space-y-3">
                  {pricingLineItems.map(item => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2"
                    >
                      <input
                        type="text"
                        placeholder={t('pricing.form.itemDescription')}
                        value={item.description}
                        onChange={e => updateLineItem(item.id, 'description', e.target.value)}
                        className="portal-input w-full h-9 text-sm"
                      />
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          min="1"
                          placeholder={t('pricing.form.quantity')}
                          value={item.quantity || ''}
                          onChange={e =>
                            updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 0)
                          }
                          className="portal-input h-9 text-sm w-20"
                        />
                        <span className="text-slate-400">×</span>
                        <div className="relative flex-1">
                          <span className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                            $
                          </span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder={t('pricing.form.unitPrice')}
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
                        <div className="text-end text-xs font-bold text-slate-500">
                          = {formatCurrency(item.unitPrice * item.quantity, pricingCurrency)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addLineItem}
                  className="mt-3 w-full p-2 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors text-sm font-medium"
                >
                  <Plus size={16} className="inline me-1" />
                  {t('pricing.form.addItem')}
                </button>
              </div>

              {/* Total */}
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-between">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                  {t('pricing.form.total')}
                </span>
                <span className="text-2xl font-black text-green-600 font-outfit">
                  {formatCurrency(totalAmount, pricingCurrency)}
                </span>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
              <PortalButton variant="outline" onClick={clearSelection}>
                {t('common.cancel')}
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
                {t('requests.createAndSend')}
              </PortalButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
