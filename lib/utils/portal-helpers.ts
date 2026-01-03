'use client';

import { format } from 'date-fns';
import { getDateLocale } from '@/lib/locale-config';
import { Timestamp } from 'firebase/firestore';
import {
  STATUS_CONFIG,
  CLIENT_STATUS_CONFIG,
  CLIENT_STATUS_MAP,
  RequestStatus,
  PortalUser,
} from '@/lib/types/portal';

// ============================================
// STATUS COLOR MAPPING
// ============================================

/**
 * Maps internal color names to PortalBadge variant colors.
 * Consolidates duplicated mapStatusColor functions across the codebase.
 *
 * Handles colors from both:
 * - STATUS_CONFIG (request status colors)
 * - PRICING_STATUS_CONFIG (pricing status colors)
 *
 * @example
 * ```tsx
 * <PortalBadge variant={mapStatusColor(STATUS_CONFIG[status].color)}>
 *   {statusLabel}
 * </PortalBadge>
 * ```
 */
export function mapStatusColor(color: string): 'blue' | 'green' | 'yellow' | 'red' | 'gray' {
  // Handle purple variants -> blue
  if (color === 'purple') return 'blue';
  // Handle green variants -> green
  if (color === 'emerald' || color === 'green') return 'green';
  // Handle orange -> yellow
  if (color === 'orange') return 'yellow';
  // Direct mappings
  if (['blue', 'green', 'yellow', 'red', 'gray'].includes(color)) {
    return color as 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  }
  return 'gray';
}

/**
 * Get the badge variant for a request status (agency view).
 */
export function getStatusBadgeVariant(status: RequestStatus): 'blue' | 'green' | 'yellow' | 'red' | 'gray' {
  return mapStatusColor(STATUS_CONFIG[status]?.color || 'gray');
}

/**
 * Get the badge variant for a request status (client view - simplified).
 */
export function getClientStatusBadgeVariant(status: RequestStatus): 'blue' | 'green' | 'yellow' | 'red' | 'gray' {
  const clientStatus = CLIENT_STATUS_MAP[status];
  return mapStatusColor(CLIENT_STATUS_CONFIG[clientStatus]?.color || 'gray');
}

/**
 * Get the badge variant for a pricing request status.
 * Use with PRICING_STATUS_CONFIG from lib/types/pricing.
 *
 * @example
 * ```tsx
 * import { PRICING_STATUS_CONFIG } from '@/lib/types/pricing';
 * <PortalBadge variant={getPricingStatusBadgeVariant(PRICING_STATUS_CONFIG[status]?.color)}>
 *   {statusLabel}
 * </PortalBadge>
 * ```
 */
export function getPricingStatusBadgeVariant(color: string): 'blue' | 'green' | 'yellow' | 'red' | 'gray' {
  return mapStatusColor(color || 'gray');
}

// ============================================
// DATE FORMATTING
// ============================================

/**
 * Formats a Firestore Timestamp or Date for display in the portal.
 * Handles the common pattern of formatting dates with locale support.
 *
 * @param timestamp - Firestore Timestamp, Date object, or undefined
 * @param formatStr - date-fns format string (default: 'MMM d, yyyy')
 * @param locale - Locale code (e.g., 'en', 'he')
 * @param fallback - Fallback string if timestamp is undefined
 *
 * @example
 * ```tsx
 * {formatPortalDate(request.createdAt, 'MMMM d, yyyy', locale)}
 * ```
 */
export function formatPortalDate(
  timestamp: Timestamp | Date | undefined | null,
  formatStr: string = 'MMM d, yyyy',
  locale: string = 'en',
  fallback: string = ''
): string {
  if (!timestamp) return fallback;

  try {
    const date = timestamp instanceof Date
      ? timestamp
      : 'toDate' in timestamp
        ? timestamp.toDate()
        : new Date(timestamp as any);

    return format(date, formatStr, { locale: getDateLocale(locale) });
  } catch {
    return fallback;
  }
}

/**
 * Formats a relative time (e.g., "2 hours ago", "3 days ago").
 */
export function formatRelativeTime(
  timestamp: Timestamp | Date | undefined | null,
  locale: string = 'en'
): string {
  if (!timestamp) return '';

  const date = timestamp instanceof Date
    ? timestamp
    : 'toDate' in timestamp
      ? timestamp.toDate()
      : new Date(timestamp as any);

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Localized relative time strings (can be extended)
  if (locale === 'he') {
    if (diffMinutes < 1) return 'עכשיו';
    if (diffMinutes < 60) return `לפני ${diffMinutes} דקות`;
    if (diffHours < 24) return `לפני ${diffHours} שעות`;
    if (diffDays < 7) return `לפני ${diffDays} ימים`;
  } else {
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
  }

  return formatPortalDate(timestamp, 'MMM d', locale);
}

// ============================================
// USER DISPLAY HELPERS
// ============================================

/**
 * Gets the display name for a user, falling back to email.
 */
export function getUserDisplayName(user: PortalUser | null | undefined): string {
  if (!user) return '';
  return user.name || user.email;
}

/**
 * Gets user initials for avatar display.
 */
export function getUserInitials(user: PortalUser | null | undefined, fallback: string = '?'): string {
  if (!user) return fallback;

  const name = user.name || user.email;
  if (!name) return fallback;

  const parts = name.split(/[\s@]+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Common validation for request action pre-conditions.
 * Returns true if all required params are present.
 */
export function canPerformRequestAction(
  requestId: string | null | undefined,
  orgId: string | null | undefined,
  userData: PortalUser | null | undefined
): boolean {
  return Boolean(requestId && typeof requestId === 'string' && orgId && userData);
}

/**
 * Type guard for valid string IDs.
 */
export function isValidId(id: unknown): id is string {
  return typeof id === 'string' && id.length > 0;
}
