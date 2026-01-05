'use client';

import { useCallback, useMemo } from 'react';
import { togglePinRequest, isRequestPinnedByUser } from '@/lib/services/portal-requests';
import { usePortalAuth } from './usePortalAuth';
import { useRequests } from './useRequests';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook for managing pinned requests per user.
 * Uses Firestore for persistence - consistent across devices.
 *
 * The pinnedBy field is stored on each Request document as an array of user IDs.
 */
export function usePinnedRequests(_orgId?: string) {
  const { userData, isAgency } = usePortalAuth();
  const { requests } = useRequests();
  const userId = userData?.id;
  const queryClient = useQueryClient();

  // Derive pinned IDs from requests data (real-time via Firestore subscription)
  const pinnedIds = useMemo(() => {
    if (!userId || !requests) return [];
    return requests
      .filter(req => req.pinnedBy?.includes(userId))
      .map(req => req.id);
  }, [requests, userId]);

  const togglePin = useCallback(async (requestId: string) => {
    if (!userId) {
      console.warn('[usePinnedRequests] Cannot toggle pin: user not authenticated');
      return;
    }

    try {
      const newPinnedState = await togglePinRequest(requestId, userId);

      // Invalidate queries to trigger re-fetch and UI update
      if (isAgency) {
        queryClient.invalidateQueries({ queryKey: ['all-requests'] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['org-requests'] });
      }

      // Toast feedback
      if (newPinnedState) {
        toast.success('Request pinned');
      } else {
        toast.success('Request unpinned');
      }
    } catch (error) {
      console.error('[usePinnedRequests] Failed to toggle pin:', error);
      toast.error('Failed to update pin status');
    }
  }, [userId, isAgency, queryClient]);

  const isPinned = useCallback(
    (requestId: string) => {
      return pinnedIds.includes(requestId);
    },
    [pinnedIds]
  );

  const pinRequest = useCallback(async (requestId: string) => {
    if (!userId) return;
    // Only pin if not already pinned
    const request = requests?.find(r => r.id === requestId);
    if (request && !isRequestPinnedByUser(request, userId)) {
      await togglePin(requestId);
    }
  }, [userId, requests, togglePin]);

  const unpinRequest = useCallback(async (requestId: string) => {
    if (!userId) return;
    // Only unpin if currently pinned
    const request = requests?.find(r => r.id === requestId);
    if (request && isRequestPinnedByUser(request, userId)) {
      await togglePin(requestId);
    }
  }, [userId, requests, togglePin]);

  return useMemo(() => ({
    pinnedIds,
    togglePin,
    isPinned,
    pinRequest,
    unpinRequest,
    pinnedCount: pinnedIds.length,
  }), [pinnedIds, togglePin, isPinned, pinRequest, unpinRequest]);
}
