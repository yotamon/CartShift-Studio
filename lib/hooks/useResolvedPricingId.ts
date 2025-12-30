'use client';

import { useParams } from 'next/navigation';
import { usePathname } from '@/i18n/navigation';
import { useMemo } from 'react';

/**
 * Hook to resolve the real pricing ID from the URL.
 *
 * In development with rewrites, the route params may return 'pricing' (PORTAL_STATIC_PRICING_ID)
 * while the actual URL contains the real pricingId. This hook extracts
 * the real pricingId from the pathname.
 */
export function useResolvedPricingId(): string | null {
  const params = useParams();
  const pathname = usePathname();
  const pricingIdParam = params?.pricingId;

  return useMemo(() => {
    // 1. Try to resolve from pathname first (most reliable in dev rewrites)
    if (pathname) {
      const parts = pathname.split('/');
      const pricingIndex = parts.indexOf('pricing');
      if (pricingIndex !== -1 && parts.length > pricingIndex + 1) {
        const realId = parts[pricingIndex + 1];
        if (realId && realId !== 'pricing') {
          return realId;
        }
      }
    }

    // 2. Fallback to params if they are not 'pricing'
    if (typeof pricingIdParam === 'string' && pricingIdParam !== 'pricing') {
      return pricingIdParam;
    }

    return null;
  }, [pricingIdParam, pathname]);
}
