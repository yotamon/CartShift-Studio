'use client';

import { useQuery } from '@tanstack/react-query';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';
import { getOrganizationsWithStats } from '@/lib/services/portal-organizations';
import { Organization } from '@/lib/types/portal';

export function useAgencyClients() {
  const { loading: authLoading, isAgency } = usePortalAuth();

  const shouldFetch = !authLoading && isAgency;

  const {
    data: organizations = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['agency-clients'],
    queryFn: getOrganizationsWithStats,
    enabled: Boolean(shouldFetch),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    organizations: organizations as (Organization & { memberCount: number; requestCount: number })[],
    loading: authLoading || (shouldFetch && isLoading),
    error: error instanceof Error ? error.message : (error as string | null),
  };
}
