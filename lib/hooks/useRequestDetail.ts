'use client';

import { useState, useEffect } from 'react';
import { subscribeToRequest } from '@/lib/services/portal-requests';
import { subscribeToRequestComments } from '@/lib/services/portal-comments';
import { subscribeToRequestActivities } from '@/lib/services/portal-activities';
import { getOrganization } from '@/lib/services/portal-organizations';
import { getAgencyTeam } from '@/lib/services/portal-agency';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';
import { useResolvedOrgId } from '@/lib/hooks/useResolvedOrgId';
import { useResolvedRequestId } from '@/lib/hooks/useResolvedRequestId';
import {
  Request,
  Comment,
  Organization,
  ActivityLog,
  PortalUser,
} from '@/lib/types/portal';

interface UseRequestDetailResult {
  // Data
  request: Request | null;
  comments: Comment[];
  activities: ActivityLog[];
  organization: Organization | null;
  agencyTeam: PortalUser[];

  // Auth & IDs
  userData: PortalUser | null;
  isAgency: boolean;
  orgId: string | null;
  requestId: string | null;

  // State
  loading: boolean;
  error: string | null;

  // Derived permissions
  canAct: boolean;
  showAgencyActions: boolean;
  showClientActions: boolean;

  // Comment state update (for optimistic updates)
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

/**
 * Hook for fetching and subscribing to request detail data.
 * Handles all subscriptions for request, comments, activities, and related data.
 *
 * @example
 * ```tsx
 * const {
 *   request,
 *   comments,
 *   loading,
 *   error,
 *   showAgencyActions,
 * } = useRequestDetail();
 *
 * if (loading) return <Skeleton />;
 * if (error) return <ErrorState message={error} />;
 * ```
 */
export function useRequestDetail(): UseRequestDetailResult {
  const orgId = useResolvedOrgId();
  const requestId = useResolvedRequestId();
  const { userData, isAgency, loading: authLoading, isAuthenticated } = usePortalAuth();

  // Core data states
  const [request, setRequest] = useState<Request | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [agencyTeam, setAgencyTeam] = useState<PortalUser[]>([]);

  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to request, comments, and activities
  useEffect(() => {
    if (!requestId || typeof requestId !== 'string') {
      setError('Invalid request ID');
      setLoading(false);
      return undefined;
    }

    if (authLoading) {
      return undefined;
    }

    if (!isAuthenticated) {
      setError('Authentication required');
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setError(null);

    const unsubscribers: (() => void)[] = [];

    try {
      // Subscribe to request data
      const unsubscribeRequest = subscribeToRequest(requestId, (data, err) => {
        if (err) {
          setError(err.message);
          setLoading(false);
          return;
        }
        if (!data) {
          setError('Request not found');
          setLoading(false);
          return;
        }
        setRequest(data);
        setLoading(false);
      });
      unsubscribers.push(unsubscribeRequest);

      // Subscribe to comments
      if (typeof orgId === 'string') {
        const unsubscribeComments = subscribeToRequestComments(
          requestId,
          (data) => setComments(data),
          Boolean(userData?.isAgency),
          orgId
        );
        unsubscribers.push(unsubscribeComments);
      }

      // Subscribe to activities
      if (typeof orgId === 'string') {
        const unsubscribeActivities = subscribeToRequestActivities(
          requestId,
          (data) => setActivities(data),
          orgId
        );
        unsubscribers.push(unsubscribeActivities);
      }
    } catch (err) {
      console.error('Failed to subscribe to request details:', err);
      setError('Failed to load request details');
      setLoading(false);
    }

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [requestId, orgId, userData, authLoading, isAuthenticated]);

  // Fetch organization details (for invoice generation)
  useEffect(() => {
    if (orgId && typeof orgId === 'string') {
      getOrganization(orgId)
        .then((org) => {
          if (org) setOrganization(org);
        })
        .catch(console.error);
    }
  }, [orgId]);

  // Fetch agency team (for assignment dropdown)
  useEffect(() => {
    if (isAgency) {
      getAgencyTeam()
        .then(setAgencyTeam)
        .catch(console.error);
    }
  }, [isAgency]);

  // Derived permissions
  const canAct = Boolean(userData);
  const showAgencyActions = canAct && isAgency;
  const showClientActions = canAct && !isAgency;

  return {
    request,
    comments,
    activities,
    organization,
    agencyTeam,
    userData: userData as PortalUser | null,
    isAgency,
    orgId: typeof orgId === 'string' ? orgId : null,
    requestId: typeof requestId === 'string' ? requestId : null,
    loading: authLoading || loading,
    error,
    canAct,
    showAgencyActions,
    showClientActions,
    setComments,
  };
}
