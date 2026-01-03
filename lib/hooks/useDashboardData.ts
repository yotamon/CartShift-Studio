'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';
import { useResolvedOrgId } from '@/lib/hooks/useResolvedOrgId';
import { getRequestsByOrg } from '@/lib/services/portal-requests';
import { getOrgActivities } from '@/lib/services/portal-activities';
import { getMemberByUserId, ensureMembership } from '@/lib/services/portal-organizations';
import { Request, ActivityLog } from '@/lib/types/portal';

export function useDashboardData() {
  const orgId = useResolvedOrgId();
  const { userData, loading: authLoading, isAuthenticated } = usePortalAuth();

  // State to track if we've verified/ensured membership for clients
  const [membershipChecked, setMembershipChecked] = useState(false);
  const [membershipError, setMembershipError] = useState<string | null>(null);

  const isAgency = userData?.isAgency || false;
  const shouldFetchData = isAuthenticated && orgId && (isAgency || membershipChecked);

  // Effect to handle membership verification for clients
  useEffect(() => {
    if (!orgId || typeof orgId !== 'string' || authLoading || !userData || isAgency || membershipChecked) {
      return;
    }

    let mounted = true;

    const verifyMembership = async () => {
      try {
        let member = await getMemberByUserId(orgId, userData.id);

        if (!member) {
          // Attempt to fix membership if missing
          try {
            member = await ensureMembership(orgId, userData.id, userData.email, userData.name);
          } catch (err) {
            console.error('Failed to ensure membership:', err);
          }
        }

        if (mounted) {
          if (member) {
            setMembershipChecked(true);
            setMembershipError(null);
          } else {
            console.warn(`Access denied - No membership found for orgId: ${orgId}`);
            setMembershipError('access_denied');
          }
        }
      } catch (err) {
        if (mounted) {
          console.error('Error checking membership:', err);
          setMembershipError('membership_check_failed');
        }
      }
    };

    verifyMembership();

    return () => {
      mounted = false;
    };
  }, [orgId, userData, authLoading, isAgency, membershipChecked]);

  // 1. Requests Query
  const {
    data: requests = [],
    isLoading: requestsLoading,
    error: requestsError,
  } = useQuery({
    queryKey: ['org-requests', orgId],
    queryFn: () => getRequestsByOrg(orgId as string),
    enabled: Boolean(shouldFetchData),
    refetchInterval: 30000, // Refresh every 30s
  });

  // 2. Activities Query
  const {
    data: activities = [],
    isLoading: activitiesLoading,
    error: activitiesError,
  } = useQuery({
    queryKey: ['org-activities', orgId],
    queryFn: () => getOrgActivities(orgId as string),
    enabled: Boolean(shouldFetchData),
    refetchInterval: 30000, // Refresh every 30s
  });

  const loading = authLoading || (shouldFetchData && (requestsLoading || activitiesLoading)) || (!isAgency && !membershipChecked && !membershipError);

  const error = membershipError ||
                (requestsError instanceof Error ? requestsError.message : null) ||
                (activitiesError instanceof Error ? activitiesError.message : null);

  return {
    requests,
    activities,
    loading,
    error,
    userData,
    orgId,
  };
}
