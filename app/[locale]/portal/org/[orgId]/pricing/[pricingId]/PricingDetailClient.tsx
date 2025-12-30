'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { PortalCard } from '@/components/portal/ui/PortalCard';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import { PortalBadge } from '@/components/portal/ui/PortalBadge';
import { getPricingRequest } from '@/lib/services/pricing-requests';
import { getRequest } from '@/lib/services/portal-requests';
import {
  PricingRequest,
  PRICING_STATUS_CONFIG,
  formatCurrency,
} from '@/lib/types/pricing';
import { Request, STATUS_CONFIG } from '@/lib/types/portal';
import { useTranslations } from 'next-intl';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';
import { PayPalProvider } from '@/components/providers/PayPalProvider';
import { PayPalCheckoutButton } from '@/components/portal/PayPalCheckoutButton';

const mapStatusColor = (
  color: string
): 'blue' | 'green' | 'yellow' | 'red' | 'gray' => {
  if (color === 'purple') return 'blue';
  if (color === 'emerald' || color === 'green') return 'green';
  if (color === 'orange') return 'yellow';
  if (['blue', 'yellow', 'red', 'gray'].includes(color)) {
    return color as 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  }
  return 'gray';
};

export default function PricingDetailClient() {
  const { orgId, pricingId } = useParams();
  const t = useTranslations();
  const { isAgency } = usePortalAuth();

  const [pricingRequest, setPricingRequest] = useState<PricingRequest | null>(
    null
  );
  const [linkedRequests, setLinkedRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orgId || !pricingId || typeof orgId !== 'string' || typeof pricingId !== 'string') {
      setError(t('portal.common.error' as never));
      setLoading(false);
      return undefined;
    }

    const fetchPricingRequest = async () => {
      try {
        const request = await getPricingRequest(pricingId);
        setPricingRequest(request);

        // Fetch linked requests if any
        if (request?.requestIds && request.requestIds.length > 0) {
          const requestPromises = request.requestIds.map((id) => getRequest(id));
          const requests = await Promise.all(requestPromises);
          setLinkedRequests(requests.filter((r): r is Request => r !== null));
        }
      } catch (err) {
        console.error('Failed to fetch pricing request:', err);
        setError(t('portal.common.error' as never));
      } finally {
        setLoading(false);
      }
    };

    fetchPricingRequest();
    return undefined;
  }, [orgId, pricingId, t]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm font-bold text-slate-400 font-outfit">
          {t('portal.common.loading' as any)}
        </p>
      </div>
    );
  }

  if (error || !pricingRequest) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {t('portal.common.error' as any)}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm">{error}</p>
        <Link href={`/portal/org/${orgId}/pricing/`}>
          <PortalButton>{t('portal.common.back' as any)}</PortalButton>
        </Link>
      </div>
    );
  }

  const statusConfig = PRICING_STATUS_CONFIG[pricingRequest.status];
  const statusColor = mapStatusColor(statusConfig.color);

  return (
    <PayPalProvider>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex items-center gap-4">
          <Link href={`/portal/org/${orgId}/pricing/`}>
            <PortalButton variant="ghost" className="flex items-center gap-2">
              <ArrowLeft size={18} />
              {t('portal.common.back' as any)}
            </PortalButton>
          </Link>
        </div>

        <PortalCard className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-outfit mb-2">
                {pricingRequest.title}
              </h1>
              {pricingRequest.description && (
                <p className="text-slate-600 dark:text-slate-400">
                  {pricingRequest.description}
                </p>
              )}
            </div>
            <PortalBadge variant={statusColor}>
              {statusConfig.label}
            </PortalBadge>
          </div>

          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                  {t('portal.pricing.form.total' as any)}
                </p>
                <p className="text-2xl font-black text-slate-900 dark:text-white font-outfit">
                  {formatCurrency(pricingRequest.totalAmount, pricingRequest.currency)}
                </p>
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                  {t('portal.common.status' as any)}
                </p>
                <PortalBadge variant={statusColor}>
                  {statusConfig.label}
                </PortalBadge>
              </div>
            </div>
          </div>

          {pricingRequest.lineItems && pricingRequest.lineItems.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-outfit mb-4">
                {t('portal.pricing.form.lineItems' as never)}
              </h3>
              <div className="space-y-2">
                {pricingRequest.lineItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {item.description}
                      </p>
                      {item.notes && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {item.notes}
                        </p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-bold text-slate-900 dark:text-white">
                        {formatCurrency(item.unitPrice * item.quantity, pricingRequest.currency)}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {item.quantity} × {formatCurrency(item.unitPrice, pricingRequest.currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Linked Requests Section */}
          {linkedRequests.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-outfit mb-4">
                <FileText className="inline w-5 h-5 mr-2" />
                {t('portal.pricing.includedRequests' as never) || 'Included Requests'}
              </h3>
              <div className="space-y-2">
                {linkedRequests.map((request) => {
                  const statusConfig = STATUS_CONFIG[request.status];
                  return (
                    <Link
                      key={request.id}
                      href={`/portal/org/${orgId}/requests/${request.id}`}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 dark:text-white truncate">
                            {request.title}
                          </h4>
                          <PortalBadge variant="gray" className="text-xs">
                            {request.type}
                          </PortalBadge>
                          <PortalBadge
                            variant={statusConfig.color === 'purple' ? 'blue' : statusConfig.color === 'emerald' ? 'green' : statusConfig.color as 'blue' | 'green' | 'yellow' | 'red' | 'gray'}
                            className="text-xs"
                          >
                            {statusConfig.label}
                          </PortalBadge>
                        </div>
                        {request.description && (
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                            {request.description}
                          </p>
                        )}
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {!isAgency && pricingRequest.status === 'ACCEPTED' && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              <PayPalCheckoutButton
                pricingRequest={pricingRequest}
                onSuccess={(result) => {
                  console.log('Payment successful:', result);
                  window.location.reload();
                }}
                onError={(error) => {
                  console.error('Payment error:', error);
                  setError(error);
                }}
              />
            </div>
          )}
        </PortalCard>
      </div>
    </PayPalProvider>
  );
}
