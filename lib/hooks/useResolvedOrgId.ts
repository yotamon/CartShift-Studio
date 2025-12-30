'use client';

import { useParams } from 'next/navigation';
import { usePathname } from '@/i18n/navigation';
import { useMemo } from 'react';

/**
 * Hook to resolve the real organization ID from the URL.
 *
 * In development with rewrites, the route params may return 'template' (PORTAL_STATIC_ORG_ID)
 * while the actual URL contains the real orgId. This hook extracts
 * the real orgId from the pathname.
 *
 * @returns The resolved organization ID, or null if not yet resolved or not in an org context
 */
export function useResolvedOrgId(): string | null {
  const params = useParams();
  const pathname = usePathname();
  const orgIdParam = params?.orgId;

  return useMemo(() => {
    // 1. Try to resolve from pathname first (most reliable in dev rewrites)
    if (pathname) {
      const parts = pathname.split('/');
      const orgIndex = parts.indexOf('org');
      if (orgIndex !== -1 && parts.length > orgIndex + 1) {
        const realId = parts[orgIndex + 1];
        if (realId && realId !== 'template') {
          return realId;
        }
      }
    }

    // 2. Fallback to params if they are not 'template'
    if (typeof orgIdParam === 'string' && orgIdParam !== 'template') {
      return orgIdParam;
    }

    // 3. Fallback: try one more time with a slightly more aggressive check if needed
    // but at this point if we don't have it, we return null to signify "loading/resolving"
    return null;
  }, [orgIdParam, pathname]);
}
