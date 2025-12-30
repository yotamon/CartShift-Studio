'use client';

import { useParams } from 'next/navigation';
import { usePathname } from '@/i18n/navigation';
import { useMemo } from 'react';

/**
 * Hook to resolve the real client ID from the URL.
 *
 * In development with rewrites, the route params may return 'template' (PORTAL_STATIC_CLIENT_ID)
 * while the actual URL contains the real clientId. This hook extracts
 * the real clientId from the pathname.
 */
export function useResolvedClientId(): string | null {
  const params = useParams();
  const pathname = usePathname();
  const clientIdParam = params?.clientId;

  return useMemo(() => {
    // 1. Try to resolve from pathname first (most reliable in dev rewrites)
    if (pathname) {
      const parts = pathname.split('/');
      const clientsIndex = parts.indexOf('clients');
      if (clientsIndex !== -1 && parts.length > clientsIndex + 1) {
        const realId = parts[clientsIndex + 1];
        if (realId && realId !== 'template') {
          return realId;
        }
      }
    }

    // 2. Fallback to params if they are not 'template'
    if (typeof clientIdParam === 'string' && clientIdParam !== 'template') {
      return clientIdParam;
    }

    return null;
  }, [clientIdParam, pathname]);
}
