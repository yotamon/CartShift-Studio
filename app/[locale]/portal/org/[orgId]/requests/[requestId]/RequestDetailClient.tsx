'use client';

import { useState } from 'react';
import { motion } from '@/lib/motion';
import {
  ArrowLeft,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  User as UserIcon,
  Zap,
  DollarSign,
  Check,
  X,
  Plus,
  Trash2,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { PortalCard } from '@/components/portal/ui/PortalCard';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import { PortalBadge } from '@/components/portal/ui/PortalBadge';

import { PinButton } from '@/components/portal/PinnedRequests';
import { PortalSkeleton } from '@/components/portal/ui/Skeleton';
import { RequestMilestones } from '@/components/portal/requests/RequestMilestones';
import { RequestAttachments } from '@/components/portal/requests/RequestAttachments';
import { RequestDiscussion } from '@/components/portal/requests/RequestDiscussion';
import { InvoiceDownloadButton } from '@/components/portal/invoices/InvoiceDownloadButton';
import { ActivityTimeline } from '@/components/portal/ActivityTimeline';
import { PayPalProvider } from '@/components/providers/PayPalProvider';
import { PayPalCheckoutButton } from '@/components/portal/PayPalCheckoutButton';

// Consolidated hooks (no more inline state duplication!)
import { useRequestDetail } from '@/lib/hooks/useRequestDetail';
import { useRequestActions } from '@/lib/hooks/useRequestActions';
import { usePricingForm } from '@/lib/hooks/usePricingForm';

// Consolidated utilities (no more mapStatusColor duplication!)
import {
  getStatusBadgeVariant,
  getClientStatusBadgeVariant,
  formatPortalDate,
} from '@/lib/utils/portal-helpers';

import {
  PortalUser,
  CLIENT_STATUS_MAP,
  formatCurrency,
  CURRENCY_CONFIG,
  Currency,
} from '@/lib/types/portal';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

// ============================================
// SUBCOMPONENTS (Extracted for clarity)
// ============================================

function LoadingSkeleton({ requestId }: { requestId: string | null }) {
  return (
    <div className="space-y-6 animate-pulse" role="status" aria-live="polite">
      <span className="sr-only">Loading request details...</span>
      <div className="h-8 w-48 bg-surface-200 dark:bg-surface-800 rounded-lg" />
      <motion.div
        layoutId={requestId ? `request-container-${requestId}` : undefined}
        className="flex flex-col md:flex-row gap-6 p-4 rounded-xl"
      >
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-4">
            {requestId ? (
              <motion.div layoutId={`request-title-${requestId}`} className="w-3/4">
                <PortalSkeleton className="h-10 w-full" />
              </motion.div>
            ) : (
              <PortalSkeleton className="h-10 w-3/4" />
            )}
            {requestId ? (
              <motion.div layoutId={`request-status-${requestId}`}>
                <PortalSkeleton className="h-8 w-24 rounded-full" />
              </motion.div>
            ) : (
              <PortalSkeleton className="h-8 w-24 rounded-full" />
            )}
          </div>
          <PortalSkeleton className="h-6 w-1/3" />
        </div>
      </motion.div>
      <div className="flex items-center gap-2">
        <PortalSkeleton className="h-10 w-24 rounded-xl" />
        <PortalSkeleton className="h-10 w-28 rounded-xl" />
        <PortalSkeleton className="h-10 w-24 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PortalSkeleton className="h-64 w-full rounded-2xl" />
          <PortalSkeleton className="h-40 w-full rounded-2xl" />
        </div>
        <div className="space-y-6">
          <PortalSkeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

function ErrorState({
  error,
  orgId,
  t
}: {
  error: string | null;
  orgId: string | null;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="text-center py-20 px-4">
      <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <AlertCircle size={40} className="text-rose-500" />
      </div>
      <h2 className="text-2xl font-bold text-surface-900 dark:text-white font-outfit">
        {error || t('requests.detail.notFound')}
      </h2>
      <p className="text-surface-500 mt-2 max-w-sm mx-auto font-medium">
        {t('requests.detail.notFoundDesc')}
      </p>
      <Link href={`/portal/org/${orgId}/requests/`} className="mt-8 inline-block">
        <PortalButton variant="outline" className="font-outfit">
          {t('requests.detail.backToRequests')}
        </PortalButton>
      </Link>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function RequestDetailClient() {
  const t = useTranslations('portal');
  const locale = useLocale();

  // ========== CONSOLIDATED DATA HOOKS ==========
  // All subscriptions, state, and derived permissions are now in useRequestDetail
  const {
    request,
    comments,
    activities,
    organization,
    agencyTeam,
    userData,
    isAgency,
    orgId,
    requestId,
    loading,
    error,
    showAgencyActions,
    showClientActions,
    setComments,
  } = useRequestDetail();

  // ========== CONSOLIDATED ACTION HOOKS ==========
  // All request actions with toast notifications are now in useRequestActions
  const {
    handleAddPricing,
    isAddingPricing,
    handleAcceptQuote,
    handleDeclineQuote,
    isAccepting,
    isDeclining,
    handleStartWork,
    handlePaymentSuccess,
    handleAssignSpecialist,
    isAssigning,
    handleRequestRevision,
    isSubmittingRevision,
    handleFileUpload,
    isUploading,
    handleStatusChange,
    handleSendComment,
    isSubmittingComment,
  } = useRequestActions({
    request,
    userData,
    orgId,
    requestId,
    isAgency,
    onCommentsUpdate: setComments,
  });

  // ========== CONSOLIDATED PRICING FORM ==========
  // All pricing form state is now in usePricingForm hook
  const {
    lineItems: pricingLineItems,
    currency: pricingCurrency,
    isFormVisible: showPricingForm,
    setCurrency: setPricingCurrency,
    setFormVisible: setShowPricingForm,
    addLineItem,
    removeLineItem,
    updateLineItem,
    resetForm: resetPricingForm,
    totalAmount: pricingTotal,
    isValid: isPricingValid,
  } = usePricingForm(request?.currency || 'USD');

  // ========== LOCAL UI STATE ==========
  const [activeTab, setActiveTab] = useState<'overview' | 'discussion' | 'history'>('overview');
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState('');

  // ========== RENDER ==========

  if (loading) {
    return <LoadingSkeleton requestId={requestId} />;
  }

  if (error || !request) {
    return <ErrorState error={error} orgId={orgId} t={t} />;
  }



  const handlePricingSubmit = async () => {
    const success = await handleAddPricing(pricingLineItems, pricingCurrency);
    if (success) {
      resetPricingForm();
    }
  };

  const handleRevisionSubmit = async () => {
    const success = await handleRequestRevision(revisionNotes);
    if (success) {
      setShowRevisionModal(false);
      setRevisionNotes('');
    }
  };

  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">


      {/* Header */}
      <motion.div layoutId={`request-container-${request.id}`} className="flex flex-col md:flex-row md:items-center gap-6 p-4 rounded-xl">
        <Link
          href={`/portal/org/${orgId}/requests/`}
          className="p-2.5 border border-surface-200 dark:border-surface-800 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 transition-colors shadow-sm bg-white dark:bg-surface-950"
        >
          <ArrowLeft size={20} className="text-surface-500" />
        </Link>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <motion.h1 layoutId={`request-title-${request.id}`} className="text-2xl font-bold text-surface-900 dark:text-white leading-tight font-outfit">
              {request.title}
            </motion.h1>
            <motion.div layoutId={`request-status-${request.id}`}>
              <PortalBadge
                variant={isAgency
                  ? getStatusBadgeVariant(request.status)
                  : getClientStatusBadgeVariant(request.status)
                }
              >
                {isAgency
                  ? t(`requests.status.${request.status.toLowerCase()}` as any)
                  : t(`requests.clientStatus.${CLIENT_STATUS_MAP[request.status].toLowerCase()}` as any)
                }
              </PortalBadge>
            </motion.div>
          </div>
          <div className="flex items-center gap-3 mt-1 underline-offset-4">
            <p className="text-xs font-black text-surface-400 uppercase tracking-widest">
              {request.id.slice(0, 8)}
            </p>
            <span className="w-1 h-1 rounded-full bg-surface-300" />
            <p className="text-xs font-black text-surface-400 uppercase tracking-widest">
              {request.type || t('requests.detail.designRequest')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start md:self-center">
          <PinButton
            requestId={request.id}
            orgId={orgId as string}
            size="md"
            className="w-10 h-10 border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-950 hover:border-surface-300 dark:hover:border-surface-700 shadow-sm"
          />
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-surface-100 dark:bg-surface-900 rounded-2xl w-full overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveTab('overview')}
          className={cn(
            'px-4 sm:px-6 py-3 min-h-[44px] rounded-xl text-sm font-bold transition-all font-outfit touch-manipulation whitespace-nowrap',
            activeTab === 'overview'
              ? 'bg-white dark:bg-surface-800 text-blue-600 shadow-sm'
              : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
          )}
        >
          {t('requests.detail.overview')}
        </button>
        <button
          onClick={() => setActiveTab('discussion')}
          className={cn(
            'px-4 sm:px-6 py-3 min-h-[44px] rounded-xl text-sm font-bold transition-all font-outfit touch-manipulation flex items-center gap-2 whitespace-nowrap',
            activeTab === 'discussion'
              ? 'bg-white dark:bg-surface-800 text-blue-600 shadow-sm'
              : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
          )}
        >
          {t('requests.detail.discussion')}
          {comments.length > 0 && (
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 px-1.5 py-0.5 rounded-md text-[10px]">
              {comments.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={cn(
            'px-4 sm:px-6 py-3 min-h-[44px] rounded-xl text-sm font-bold transition-all font-outfit touch-manipulation flex items-center gap-2 whitespace-nowrap',
            activeTab === 'history'
              ? 'bg-white dark:bg-surface-800 text-blue-600 shadow-sm'
              : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
          )}
        >
          <Clock size={16} />
          {t('requests.detail.history')}
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' ? (
            <div className="space-y-6 animate-in slide-in-from-start-4 duration-500">
              {/* Details Card */}
              <PortalCard className="border-surface-200 dark:border-surface-800 shadow-sm bg-white dark:bg-surface-950">
                <h3 className="text-[10px] font-black text-surface-400 dark:text-surface-500 uppercase tracking-widest mb-4">
                  {t('requests.detail.details')}
                </h3>
                <div className="text-surface-600 dark:text-surface-300 leading-relaxed whitespace-pre-wrap font-medium">
                  {request.description}
                </div>
                <div className="mt-10 pt-6 border-t border-surface-100 dark:border-surface-800 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-100 dark:border-surface-800 shadow-sm">
                      <Calendar size={16} className="text-surface-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest">
                        {t('requests.detail.submissionDate')}
                      </p>
                      <p className="text-sm font-bold text-surface-900 dark:text-white font-outfit">
                        {formatPortalDate(request.createdAt, 'MMMM d, yyyy', locale, t('common.recently'))}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-100 dark:border-surface-800 shadow-sm">
                      <Zap
                        size={16}
                        className={cn(
                          request.priority === 'HIGH' || request.priority === 'URGENT'
                            ? 'text-rose-500'
                            : 'text-amber-500'
                        )}
                      />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest">
                        {t('requests.detail.priorityStatus')}
                      </p>
                      <p className="text-sm font-bold text-surface-900 dark:text-white capitalize font-outfit">
                        {t(`requests.priority.${request.priority.toLowerCase()}` as any) ||
                          t('requests.priority.normal')}
                      </p>
                    </div>
                  </div>
                </div>
              </PortalCard>

              {/* Milestones Section */}
              <RequestMilestones request={request} isAgency={isAgency} />

              {/* Assets Section */}
              <RequestAttachments request={request} isAgency={isAgency} orgId={orgId as string} />
            </div>
          ) : activeTab === 'discussion' ? (
            <RequestDiscussion
              comments={comments}
              currentUser={userData as PortalUser | null}
              agencyTeam={agencyTeam}
              onSendMessage={handleSendComment}
              isSubmitting={isSubmittingComment}
            />
          ) : (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-[10px] font-black text-surface-400 dark:text-surface-500 uppercase tracking-widest flex items-center gap-2 px-1">
                <Clock size={14} className="text-blue-500" /> {t('requests.detail.historyTitle')}
              </h3>
              <PortalCard
                noPadding
                className="border-surface-200 dark:border-surface-800 shadow-sm bg-white dark:bg-surface-950"
              >
                <ActivityTimeline activities={activities} orgId={orgId as string} />
              </PortalCard>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Agency Add Pricing Section - For NEW requests without pricing */}
          {showAgencyActions && request.status === 'NEW' && !request.isBillable && (
            <PortalCard className="border-surface-200 dark:border-surface-800 shadow-sm bg-white dark:bg-surface-950">
              <h4 className="text-[10px] font-black text-surface-400 dark:text-surface-500 mb-6 uppercase tracking-widest flex items-center gap-2">
                <DollarSign size={14} className="text-green-500" />
                {t('requests.detail.addPricing')}
              </h4>

              {!showPricingForm ? (
                <PortalButton
                  variant="outline"
                  className="w-full h-12 border-dashed border-2 border-green-300 dark:border-green-700 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                  onClick={() => setShowPricingForm(true)}
                >
                  <Plus size={18} className="me-2" />
                  {t('requests.detail.addQuote')}
                </PortalButton>
              ) : (
                <div className="space-y-4">
                  {/* Currency Selector */}
                  <div>
                    <label className="block text-xs font-bold text-surface-500 mb-2">
                      {t('requests.detail.currency')}
                    </label>
                    <select
                      value={pricingCurrency}
                      onChange={e => setPricingCurrency(e.target.value as Currency)}
                      className="portal-input h-10 text-sm"
                    >
                      {Object.entries(CURRENCY_CONFIG).map(([key, config]) => (
                        <option key={key} value={key}>
                          {config.symbol} {config.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Line Items */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-surface-500">
                      {t('requests.detail.lineItems')}
                    </label>
                    {pricingLineItems.map(item => (
                      <div
                        key={item.id}
                        className="p-3 bg-surface-50 dark:bg-surface-900 rounded-lg space-y-2"
                      >
                        <input
                          type="text"
                          placeholder={t('requests.detail.descriptionPlaceholder')}
                          value={item.description}
                          onChange={e => updateLineItem(item.id, 'description', e.target.value)}
                          className="portal-input h-9 text-sm"
                        />
                        <div className="flex gap-2 items-center">
                          <div className="flex-1">
                            <input
                              type="number"
                              min="1"
                              placeholder={t('requests.detail.qty')}
                              value={item.quantity || ''}
                              onChange={e =>
                                updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 0)
                              }
                              className="portal-input h-9 text-sm w-full"
                            />
                          </div>
                          <span className="text-surface-400 text-sm">×</span>
                          <div className="flex-1">
                            <div className="relative">
                              <span className="absolute start-3 top-1/2 -translate-y-1/2 text-surface-400 text-sm">
                                {CURRENCY_CONFIG[pricingCurrency].symbol}
                              </span>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder={t('requests.detail.price')}
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
                          </div>
                          {pricingLineItems.length > 1 && (
                            <button
                              onClick={() => removeLineItem(item.id)}
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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

                  {/* Add Line Item */}
                  <button
                    onClick={addLineItem}
                    className="w-full py-2 text-sm font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    {t('requests.detail.addLineItem')}
                  </button>

                  {/* Total */}
                  {pricingTotal > 0 && (
                    <div className="pt-3 border-t border-surface-200 dark:border-surface-800 flex items-center justify-between">
                      <span className="text-sm font-bold text-surface-600 dark:text-surface-400">
                        {t('requests.detail.total')}
                      </span>
                      <span className="text-lg font-black text-surface-900 dark:text-white font-outfit">
                        {formatCurrency(pricingTotal, pricingCurrency)}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-3 flex gap-2">
                    <PortalButton
                      variant="outline"
                      className="flex-1 h-10"
                      onClick={resetPricingForm}
                    >
                      {t('common.cancel')}
                    </PortalButton>
                    <PortalButton
                      variant="primary"
                      className="flex-1 h-10"
                      onClick={handlePricingSubmit}
                      disabled={isAddingPricing || !isPricingValid}
                    >
                      {isAddingPricing ? (
                        <Loader2 size={16} className="animate-spin me-2" />
                      ) : (
                        <Check size={16} className="me-2" />
                      )}
                      {t('requests.detail.sendQuote')}
                    </PortalButton>
                  </div>
                </div>
              )}
            </PortalCard>
          )}

          {/* Pricing Section - Show if request has pricing */}
          {request.isBillable && request.lineItems && request.lineItems.length > 0 && (
            <PortalCard className="border-surface-200 dark:border-surface-800 shadow-sm bg-white dark:bg-surface-950">
              <h4 className="text-[10px] font-black text-surface-400 dark:text-surface-500 mb-6 uppercase tracking-widest flex items-center gap-2">
                <DollarSign size={14} className="text-green-500" />
                {t('requests.detail.pricingTitle')}
              </h4>
              <div className="space-y-3">
                {request.lineItems.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-900 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-surface-900 dark:text-white text-sm">
                        {item.description}
                      </p>
                      {item.notes && (
                        <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                          {item.notes}
                        </p>
                      )}
                    </div>
                    <div className="text-end ms-4">
                      <p className="font-bold text-surface-900 dark:text-white text-sm">
                        {formatCurrency(item.unitPrice * item.quantity, request.currency || 'USD')}
                      </p>
                      <p className="text-xs text-surface-500 dark:text-surface-400">
                        {item.quantity} ×{' '}
                        {formatCurrency(item.unitPrice, request.currency || 'USD')}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="pt-3 mt-3 border-t border-surface-200 dark:border-surface-800 flex items-center justify-between">
                  <span className="text-sm font-bold text-surface-600 dark:text-surface-400">
                    {t('requests.detail.total')}
                  </span>
                  <span className="text-xl font-black text-surface-900 dark:text-white font-outfit">
                    {formatCurrency(request.totalAmount || 0, request.currency || 'USD')}
                  </span>
                </div>

                {/* Invoice Download (for paid requests) */}
                {request.paidAt && organization && (
                  <div className="mt-4">
                    <InvoiceDownloadButton
                      request={request}
                      organization={organization}
                      className="w-full"
                    />
                  </div>
                )}
              </div>

              {/* Client Accept/Decline Buttons - Only for QUOTED status */}
              {showClientActions && request.status === 'QUOTED' && (
                <div className="mt-6 pt-6 border-t border-surface-200 dark:border-surface-800 flex gap-3">
                  <PortalButton
                    variant="primary"
                    className="flex-1 h-12"
                    onClick={handleAcceptQuote}
                    disabled={isAccepting || isDeclining}
                  >
                    {isAccepting ? (
                      <Loader2 size={18} className="animate-spin me-2" />
                    ) : (
                      <Check size={18} className="me-2" />
                    )}
                    {t('requests.detail.acceptQuote')}
                  </PortalButton>
                  <PortalButton
                    variant="outline"
                    className="flex-1 h-12 border-red-200 dark:border-red-900 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                    onClick={handleDeclineQuote}
                    disabled={isAccepting || isDeclining}
                  >
                    {isDeclining ? (
                      <Loader2 size={18} className="animate-spin me-2" />
                    ) : (
                      <X size={18} className="me-2" />
                    )}
                    {t('requests.detail.decline')}
                  </PortalButton>
                </div>
              )}

              {/* Agency Start Work Button - Only for ACCEPTED status */}
              {showAgencyActions && request.status === 'ACCEPTED' && (
                <div className="mt-6 pt-6 border-t border-surface-200 dark:border-surface-800">
                  <PortalButton variant="primary" className="w-full h-12" onClick={handleStartWork}>
                    <Zap size={18} className="me-2" />
                    {t('requests.detail.startWork')}
                  </PortalButton>
                </div>
              )}

              {/* PayPal Payment - For DELIVERED billable requests */}
              {showClientActions && request.status === 'DELIVERED' && request.isBillable && (
                <div className="mt-6 pt-6 border-t border-surface-200 dark:border-surface-800">
                  <PayPalProvider>
                    <PayPalCheckoutButton
                      pricingRequest={{
                        id: request.id,
                        orgId: request.orgId,
                        title: request.title,
                        totalAmount: request.totalAmount || 0,
                        currency: request.currency || 'USD',
                        lineItems: request.lineItems,
                        status: 'ACCEPTED',
                        createdBy: request.createdBy,
                        createdByName: request.createdByName || '',
                        createdAt: request.createdAt,
                        updatedAt: request.updatedAt,
                      }}
                      onSuccess={handlePaymentSuccess}
                      onError={err => console.error('Payment error:', err)}
                    />
                  </PayPalProvider>
                </div>
              )}
            </PortalCard>
          )}

          {/* Workflow Actions Card */}
          <PortalCard className="border-surface-200 dark:border-surface-800 shadow-sm bg-white dark:bg-surface-950">
            <h4 className="text-[10px] font-black text-surface-400 dark:text-surface-500 mb-6 uppercase tracking-widest">
              {t('requests.detail.workflowActions')}
            </h4>
            <div className="space-y-2">
              {showAgencyActions &&
                request.status !== 'CLOSED' &&
                request.status !== 'CANCELED' && (
                  <PortalButton
                    variant="outline"
                    className="w-full justify-start h-12 border-surface-200 dark:border-surface-800 text-sm font-bold font-outfit"
                    onClick={() => handleStatusChange('CLOSED')}
                  >
                    <CheckCircle2 size={16} className="me-3 text-emerald-500" />{' '}
                    {t('requests.detail.closeRequest')}
                  </PortalButton>
                )}
              {showAgencyActions && (
                <div className="relative">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={onFileUpload}
                    disabled={isUploading}
                  />
                  <PortalButton
                    variant="outline"
                    className="w-full justify-start h-12 border-surface-200 dark:border-surface-800 text-sm font-bold font-outfit"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Loader2 size={16} className="me-3 animate-spin text-blue-500" />
                    ) : (
                      <Paperclip size={16} className="me-3 text-blue-500" />
                    )}
                    {t('requests.detail.addAttachment')}
                  </PortalButton>
                </div>
              )}
              {showClientActions &&
                request.status !== 'CLOSED' &&
                request.status !== 'CANCELED' && (
                  <PortalButton
                    variant="outline"
                    className="w-full justify-start h-12 border-surface-200 dark:border-surface-800 text-sm font-bold font-outfit"
                    onClick={() => setShowRevisionModal(true)}
                  >
                    <RotateCcw size={16} className="me-3 text-amber-500" />{' '}
                    {t('requests.detail.requestRevision')}
                  </PortalButton>
                )}
            </div>
          </PortalCard>

          {/* Assigned Specialist Card */}
          <PortalCard className="border-surface-200 dark:border-surface-800 shadow-sm bg-white dark:bg-surface-950">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-[10px] font-black text-surface-400 dark:text-surface-500 uppercase tracking-widest">
                {t('requests.detail.assignedSpecialist')}
              </h4>
              {showAgencyActions && (
                <div className="relative group/assign">
                  <select
                    className="absolute inset-0 opacity-0 cursor-pointer w-full"
                    onChange={e => {
                      const selected = agencyTeam.find(m => m.id === e.target.value);
                      if (selected)
                        handleAssignSpecialist(selected.id, selected.name || selected.email);
                    }}
                    value={request.assignedTo || ''}
                    disabled={isAssigning}
                  >
                    <option value="" disabled>
                      {t('common.filter')}
                    </option>
                    {agencyTeam.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name || member.email}
                      </option>
                    ))}
                  </select>
                  <PortalButton
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-[9px] font-black uppercase tracking-widest"
                    isLoading={isAssigning}
                  >
                    {t('common.edit')}
                  </PortalButton>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 flex items-center justify-center text-blue-600 shadow-sm overflow-hidden">
                {request.assignedTo ? (
                  <div className="w-full h-full flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 text-blue-600 font-bold text-lg">
                    {request.assignedToName?.charAt(0) || '?'}
                  </div>
                ) : (
                  <UserIcon size={20} />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-surface-900 dark:text-white font-outfit">
                  {request.assignedToName || t('requests.detail.productTeam')}
                </p>
                <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest">
                  {request.assignedTo ? t('requests.detail.specialist') : t('common.all')}
                </p>
              </div>
            </div>
          </PortalCard>

          {/* Linked Assets Card */}
          <PortalCard className="border-surface-200 dark:border-surface-800 shadow-sm bg-white dark:bg-surface-950">
            <h4 className="text-[10px] font-black text-surface-400 dark:text-surface-500 mb-6 uppercase tracking-widest">
              {t('requests.detail.linkedAssets')}
            </h4>
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-surface-100 dark:border-surface-900 rounded-3xl text-surface-400 bg-surface-50/50 dark:bg-surface-900/50">
              <Paperclip size={32} className="mb-2 opacity-10" />
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
                {t('requests.detail.noAssets')}
              </p>
            </div>
          </PortalCard>
        </div>
      </div>

      {/* Revision Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-surface-950 rounded-3xl border border-surface-200 dark:border-surface-800 w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-surface-100 dark:border-surface-900">
              <h3 className="text-2xl font-bold text-surface-900 dark:text-white font-outfit">
                {t('requests.detail.requestRevision')}
              </h3>
              <p className="text-surface-500 dark:text-surface-400 mt-2 text-sm font-medium">
                {t('requests.detail.revisionDesc')}
              </p>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-surface-400 dark:text-surface-500 uppercase tracking-widest">
                  {t('requests.detail.revisionNotes')}
                </label>
                <textarea
                  className="portal-input min-h-[160px] p-4 bg-surface-50 dark:bg-surface-900 border-surface-200 dark:border-surface-800 focus:bg-white dark:focus:bg-surface-950 transition-all font-medium resize-none text-sm"
                  placeholder={t('requests.detail.revisionPlaceholder')}
                  value={revisionNotes}
                  onChange={e => setRevisionNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <PortalButton
                  variant="outline"
                  className="flex-1 h-12"
                  onClick={() => setShowRevisionModal(false)}
                >
                  {t('common.cancel')}
                </PortalButton>
                <PortalButton
                  variant="primary"
                  className="flex-1 h-12"
                  onClick={handleRevisionSubmit}
                  disabled={isSubmittingRevision || !revisionNotes.trim()}
                >
                  {isSubmittingRevision ? (
                    <Loader2 size={18} className="animate-spin me-2" />
                  ) : (
                    <RotateCcw size={18} className="me-2" />
                  )}
                  {t('requests.detail.submitRevision')}
                </PortalButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
