'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'cartshift_pinned_requests';

/**
 * Hook for managing locally pinned/starred requests per organization.
 * Uses localStorage for persistence without requiring database changes.
 */
export function usePinnedRequests(orgId: string) {
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);

  // Load pinned requests from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined' || !orgId) return;

    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${orgId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setPinnedIds(parsed);
        }
      }
    } catch {
      // Silently fail if localStorage is not available
    }
  }, [orgId]);

  // Persist to localStorage whenever pinnedIds changes
  useEffect(() => {
    if (typeof window === 'undefined' || !orgId) return;

    try {
      localStorage.setItem(`${STORAGE_KEY}_${orgId}`, JSON.stringify(pinnedIds));
    } catch {
      // Silently fail if localStorage is not available
    }
  }, [pinnedIds, orgId]);

  const togglePin = useCallback((requestId: string) => {
    setPinnedIds(prev =>
      prev.includes(requestId) ? prev.filter(id => id !== requestId) : [...prev, requestId]
    );
  }, []);

  const isPinned = useCallback(
    (requestId: string) => {
      return pinnedIds.includes(requestId);
    },
    [pinnedIds]
  );

  const pinRequest = useCallback((requestId: string) => {
    setPinnedIds(prev => (prev.includes(requestId) ? prev : [...prev, requestId]));
  }, []);

  const unpinRequest = useCallback((requestId: string) => {
    setPinnedIds(prev => prev.filter(id => id !== requestId));
  }, []);

  return {
    pinnedIds,
    togglePin,
    isPinned,
    pinRequest,
    unpinRequest,
    pinnedCount: pinnedIds.length,
  };
}
