import { Timestamp } from 'firebase/firestore';

// ============================================
// ENUMS & CONSTANTS
// ============================================

export const REQUEST_STATUS = {
  NEW: 'NEW',
  NEEDS_INFO: 'NEEDS_INFO',
  QUOTED: 'QUOTED',           // Agency added pricing, awaiting client response
  ACCEPTED: 'ACCEPTED',       // Client accepted the quote
  DECLINED: 'DECLINED',       // Client declined the quote
  QUEUED: 'QUEUED',
  IN_PROGRESS: 'IN_PROGRESS',
  IN_REVIEW: 'IN_REVIEW',
  DELIVERED: 'DELIVERED',
  PAID: 'PAID',               // Client paid for billable request
  CLOSED: 'CLOSED',
  CANCELED: 'CANCELED',
} as const;

export const REQUEST_PRIORITY = {
  LOW: 'LOW',
  NORMAL: 'NORMAL',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const;

export const REQUEST_TYPE = {
  FEATURE: 'feature',
  BUG: 'bug',
  OPTIMIZATION: 'optimization',
  CONTENT: 'content',
  DESIGN: 'design',
  OTHER: 'other',
} as const;

export const USER_ROLE = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
  VIEWER: 'viewer',
} as const;

export const ACCOUNT_TYPE = {
  CLIENT: 'CLIENT',
  AGENCY: 'AGENCY',
} as const;

export const CURRENCY = {
  USD: 'USD',
  ILS: 'ILS',
  EUR: 'EUR',
} as const;


export type RequestStatus = (typeof REQUEST_STATUS)[keyof typeof REQUEST_STATUS];
export type RequestPriority = (typeof REQUEST_PRIORITY)[keyof typeof REQUEST_PRIORITY];
export type RequestType = (typeof REQUEST_TYPE)[keyof typeof REQUEST_TYPE];
export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
export type AccountType = (typeof ACCOUNT_TYPE)[keyof typeof ACCOUNT_TYPE];

// Account type configuration for UI
export const ACCOUNT_TYPE_CONFIG: Record<AccountType, { label: string; labelHe: string; color: string; badgeVariant: 'blue' | 'purple' }> = {
  CLIENT: { label: 'Client', labelHe: 'לקוח', color: 'blue', badgeVariant: 'blue' },
  AGENCY: { label: 'Agency', labelHe: 'סוכנות', color: 'purple', badgeVariant: 'purple' },
};

// ============================================
// CORE TYPES
// ============================================

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  website?: string;
  industry?: string;
  bio?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface OrganizationMember {
  id: string;
  orgId: string;
  userId: string;
  email: string;
  name?: string;
  role: UserRole;
  invitedBy?: string;
  joinedAt: Timestamp;
}

export interface PortalUser {
  id: string;
  email: string;
  name?: string;
  photoUrl?: string;
  accountType: AccountType;  // New: PRIMARY account type field
  isAgency: boolean;         // Kept for backward compatibility (derived from accountType)
  organizations: string[]; // org IDs
  notificationPreferences?: {
    emailOnRequestUpdate: boolean;
    emailOnNewComment: boolean;
    emailOnStatusChange: boolean;
    marketingEmails: boolean;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Request {
  id: string;
  orgId: string;
  title: string;
  description: string;
  type: RequestType;
  status: RequestStatus;
  priority: RequestPriority;
  createdBy: string;
  createdByName?: string;
  assignedTo?: string;
  assignedToName?: string;
  estimatedHours?: number;
  tags: string[];
  attachmentIds: string[];
  commentCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  closedAt?: Timestamp;
}

export interface Comment {
  id: string;
  requestId: string;
  orgId: string;
  userId: string;
  userName: string;
  userPhotoUrl?: string;
  content: string;
  attachmentIds: string[];
  isInternal: boolean; // Agency-only visibility
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface FileAttachment {
  id: string;
  orgId: string;
  requestId?: string;
  commentId?: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  storagePath: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: Timestamp;
}

export interface Invite {
  id: string;
  orgId: string;
  email: string;
  role: UserRole;
  invitedBy: string;
  invitedByName: string;
  status: 'pending' | 'accepted' | 'expired';
  expiresAt: Timestamp;
  createdAt: Timestamp;
  acceptedAt?: Timestamp;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'request_created' | 'request_updated' | 'comment_added' | 'mention' | 'invite';
  title: string;
  body: string;
  link?: string;
  read: boolean;
  createdAt: Timestamp;
}

export interface ActivityLog {
  id: string;
  orgId: string;
  requestId?: string;
  userId: string;
  userName: string;
  action: string;
  details?: Record<string, unknown>;
  createdAt: Timestamp;
}

// ============================================
// FORM DATA TYPES
// ============================================

export interface CreateRequestData {
  title: string;
  description: string;
  type: RequestType;
  priority: RequestPriority;
  tags?: string[];
}

export interface UpdateRequestData {
  title?: string;
  description?: string;
  type?: RequestType;
  status?: RequestStatus;
  priority?: RequestPriority;
  assignedTo?: string;
  estimatedHours?: number;
  tags?: string[];
}

export interface CreateCommentData {
  content: string;
  isInternal?: boolean;
  attachmentIds?: string[];
}

export interface InviteMemberData {
  email: string;
  role: UserRole;
}

// ============================================
// UI HELPER TYPES
// ============================================

export interface StatusConfig {
  label: string;
  color: 'gray' | 'blue' | 'yellow' | 'purple' | 'green' | 'emerald' | 'red';
  bgClass: string;
  textClass: string;
}

export const STATUS_CONFIG: Record<RequestStatus, StatusConfig> = {
  NEW: {
    label: 'New',
    color: 'blue',
    bgClass: 'bg-blue-100 dark:bg-blue-500/20',
    textClass: 'text-blue-700 dark:text-blue-300',
  },
  NEEDS_INFO: {
    label: 'Needs Info',
    color: 'yellow',
    bgClass: 'bg-amber-100 dark:bg-amber-500/20',
    textClass: 'text-amber-700 dark:text-amber-300',
  },
  QUEUED: {
    label: 'Queued',
    color: 'gray',
    bgClass: 'bg-surface-100 dark:bg-surface-500/20',
    textClass: 'text-surface-700 dark:text-surface-300',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'purple',
    bgClass: 'bg-purple-100 dark:bg-purple-500/20',
    textClass: 'text-purple-700 dark:text-purple-300',
  },
  IN_REVIEW: {
    label: 'In Review',
    color: 'yellow',
    bgClass: 'bg-amber-100 dark:bg-amber-500/20',
    textClass: 'text-amber-700 dark:text-amber-300',
  },
  DELIVERED: {
    label: 'Delivered',
    color: 'green',
    bgClass: 'bg-green-100 dark:bg-green-500/20',
    textClass: 'text-green-700 dark:text-green-300',
  },
  CLOSED: {
    label: 'Closed',
    color: 'emerald',
    bgClass: 'bg-emerald-100 dark:bg-emerald-500/20',
    textClass: 'text-emerald-700 dark:text-emerald-300',
  },
  CANCELED: {
    label: 'Canceled',
    color: 'red',
    bgClass: 'bg-red-100 dark:bg-red-500/20',
    textClass: 'text-red-700 dark:text-red-300',
  },
};

export const PRIORITY_CONFIG: Record<RequestPriority, { label: string; color: string }> = {
  LOW: { label: 'Low', color: 'slate' },
  NORMAL: { label: 'Normal', color: 'blue' },
  HIGH: { label: 'High', color: 'amber' },
  URGENT: { label: 'Urgent', color: 'red' },
};

export const TYPE_CONFIG: Record<RequestType, { label: string; icon: string }> = {
  feature: { label: 'New Feature', icon: 'Sparkles' },
  bug: { label: 'Bug Fix', icon: 'Bug' },
  optimization: { label: 'Optimization', icon: 'Zap' },
  content: { label: 'Content Update', icon: 'FileText' },
  design: { label: 'Design', icon: 'Palette' },
  other: { label: 'Other', icon: 'HelpCircle' },
};
