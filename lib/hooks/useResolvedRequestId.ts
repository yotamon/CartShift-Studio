'use client';

import { useParams } from 'next/navigation';
import { usePathname } from '@/i18n/navigation';
import { useMemo } from 'react';

/**
 * Hook to resolve the real request ID from the URL.
 *
 * In development with rewrites, the route params may return 'request' (PORTAL_STATIC_REQUEST_ID)
 * while the actual URL contains the real requestId. This hook extracts
 * the real requestId from the pathname.
 */
export function useResolvedRequestId(): string | null {
  const params = useParams();
  const pathname = usePathname();
  const requestIdParam = params?.requestId;

  return useMemo(() => {
    // 1. Try to resolve from pathname first (most reliable in dev rewrites)
    if (pathname) {
      const parts = pathname.split('/');
      const requestsIndex = parts.lastIndexOf('requests');
      if (requestsIndex !== -1 && parts.length > requestsIndex + 1) {
        const realId = parts[requestsIndex + 1];
        if (realId && realId !== 'request') {
          return realId;
        }
      }
    }

    // 2. Fallback to params if they are not 'request'
    if (typeof requestIdParam === 'string' && requestIdParam !== 'request') {
      return requestIdParam;
    }

    return null;
  }, [requestIdParam, pathname]);
}
