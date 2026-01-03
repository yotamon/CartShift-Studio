'use client';

import { useQuery } from '@tanstack/react-query';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';
import { useResolvedOrgId } from '@/lib/hooks/useResolvedOrgId';
import { getOrganizationMembers, getInvitesByOrg } from '@/lib/services/portal-organizations';

export function useTeam() {
  const orgId = useResolvedOrgId();
  const { loading: authLoading, isAuthenticated } = usePortalAuth();

  const shouldFetch = isAuthenticated && !authLoading && orgId && typeof orgId === 'string' && orgId !== 'template';

  const {
    data: members = [],
    isLoading: membersLoading,
    error: membersError,
  } = useQuery({
    queryKey: ['org-members', orgId],
    queryFn: () => getOrganizationMembers(orgId as string),
    enabled: Boolean(shouldFetch),
    refetchInterval: 30000,
    staleTime: 60 * 1000,
  });

  const {
    data: invites = [],
    isLoading: invitesLoading,
    error: invitesError,
  } = useQuery({
    queryKey: ['org-invites', orgId],
    queryFn: () => getInvitesByOrg(orgId as string),
    enabled: Boolean(shouldFetch),
    refetchInterval: 30000,
    staleTime: 60 * 1000,
  });

  const loading = authLoading || (shouldFetch && (membersLoading || invitesLoading));
  const error = (membersError || invitesError) instanceof Error
    ? (membersError || invitesError)?.message
    : (membersError || invitesError as string | null);

  return {
    members,
    invites,
    loading,
    error,
  };
}
