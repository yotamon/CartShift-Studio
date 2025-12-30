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
export type Currency = (typeof CURRENCY)[keyof typeof CURRENCY];

// Account type configuration for UI
export const ACCOUNT_TYPE_CONFIG: Record<AccountType, { label: string; labelHe: string; color: string; badgeVariant: 'blue' | 'purple' }> = {
  CLIENT: { label: 'Client', labelHe: 'לקוח', color: 'blue', badgeVariant: 'blue' },
  AGENCY: { label: 'Agency', labelHe: 'סוכנות', color: 'purple', badgeVariant: 'purple' },
};

// Currency configuration
export const CURRENCY_CONFIG: Record<Currency, { symbol: string; name: string }> = {
  USD: { symbol: '$', name: 'US Dollar' },
  ILS: { symbol: '₪', name: 'Israeli Shekel' },
  EUR: { symbol: '€', name: 'Euro' },
};

// Pricing line item for billable requests
export interface PricingLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number; // in cents/smallest currency unit
  notes?: string;
}

// Utility functions for pricing
export function calculateTotalAmount(lineItems: PricingLineItem[]): number {
  return lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

export function formatCurrency(amountInCents: number, currency: Currency): string {
  const config = CURRENCY_CONFIG[currency];
  const amount = amountInCents / 100;
  return `${config.symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function generateLineItemId(): string {
  return `item_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// ============================================
// SERVICE CATALOG
// ============================================

export interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: number; // in cents
  currency: Currency;
  category?: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

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
  status?: 'active' | 'inactive' | 'suspended';
  plan?: 'free' | 'pro' | 'enterprise';
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
  status?: 'active' | 'inactive' | 'suspended';
  organizations: string[]; // org IDs
  notificationPreferences?: {
    emailOnRequestUpdate: boolean;
    emailOnNewComment: boolean;
    emailOnStatusChange: boolean;
    marketingEmails: boolean;
  };
  // Onboarding tracking
  onboardingComplete?: boolean;
  onboardingSkipped?: boolean;
  onboardingCompletedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Milestone status for project tracking
export const MILESTONE_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  BLOCKED: 'blocked',
} as const;

export type MilestoneStatus = (typeof MILESTONE_STATUS)[keyof typeof MILESTONE_STATUS];

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  status: MilestoneStatus;
  order: number;
  dueDate?: Timestamp;
  completedAt?: Timestamp;
  completedBy?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Milestone status configuration for UI
export const MILESTONE_STATUS_CONFIG: Record<MilestoneStatus, {
  label: string;
  labelHe: string;
  color: string;
  bgColor: string;
  icon: string;
}> = {
  pending: {
    label: 'Pending',
    labelHe: 'ממתין',
    color: 'text-surface-500',
    bgColor: 'bg-surface-100 dark:bg-surface-800',
    icon: 'circle'
  },
  in_progress: {
    label: 'In Progress',
    labelHe: 'בתהליך',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    icon: 'loader'
  },
  completed: {
    label: 'Completed',
    labelHe: 'הושלם',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    icon: 'check-circle'
  },
  blocked: {
    label: 'Blocked',
    labelHe: 'חסום',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    icon: 'alert-circle'
  },
};

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

  // Latest activity
  lastComment?: {
    content: string;
    userName: string;
    createdAt: Timestamp;
  };

  // Milestones for project tracking
  milestones?: Milestone[];
  currentMilestoneId?: string;

  // Pricing fields (optional - for billable requests)
  isBillable?: boolean;
  lineItems?: PricingLineItem[];
  totalAmount?: number;         // in cents
  currency?: Currency;
  validUntil?: Timestamp;
  quotedAt?: Timestamp;

  // Client response to quote
  clientNotes?: string;
  acceptedAt?: Timestamp;
  declinedAt?: Timestamp;

  // Payment info
  paymentId?: string;           // PayPal transaction ID
  paidAt?: Timestamp;
  paymentMethod?: 'paypal';

  // Pricing offer reference
  pricingOfferId?: string;      // Link to PricingRequest that includes this request
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
  parentId?: string; // For threaded replies
  reactions?: Record<string, string[]>; // emoji -> array of userIds
  mentions?: string[]; // array of userIds mentioned
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
  version: number;          // New: Version number
  previousVersionId?: string; // New: Reference to previous version
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: Timestamp;
}

export interface Invite {
  id: string;
  orgId?: string; // Optional for agency invites
  email: string;
  role: UserRole;
  isAgency?: boolean;
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
  parentId?: string;
  mentions?: string[];
}

export interface InviteMemberData {
  email: string;
  role: UserRole;
  isAgency?: boolean;
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
  QUOTED: {
    label: 'Quoted',
    color: 'purple',
    bgClass: 'bg-purple-100 dark:bg-purple-500/20',
    textClass: 'text-purple-700 dark:text-purple-300',
  },
  ACCEPTED: {
    label: 'Accepted',
    color: 'green',
    bgClass: 'bg-green-100 dark:bg-green-500/20',
    textClass: 'text-green-700 dark:text-green-300',
  },
  DECLINED: {
    label: 'Declined',
    color: 'red',
    bgClass: 'bg-red-100 dark:bg-red-500/20',
    textClass: 'text-red-700 dark:text-red-300',
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
  PAID: {
    label: 'Paid',
    color: 'emerald',
    bgClass: 'bg-emerald-100 dark:bg-emerald-500/20',
    textClass: 'text-emerald-700 dark:text-emerald-300',
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

// ============================================
// CLIENT-FACING STATUS CONFIGURATION
// ============================================

export type ClientStatus = 'SUBMITTED' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED';

export const CLIENT_STATUS_MAP: Record<RequestStatus, ClientStatus> = {
  // Phase 1: Submitted / Received
  NEW: 'SUBMITTED',
  NEEDS_INFO: 'SUBMITTED', // Or 'ACTION_REQUIRED' if we want to be more specific, but simplified to Submitted for now
  QUOTED: 'SUBMITTED',
  ACCEPTED: 'SUBMITTED',
  DECLINED: 'SUBMITTED',
  QUEUED: 'SUBMITTED',

  // Phase 2: In Progress
  IN_PROGRESS: 'IN_PROGRESS',

  // Phase 3: Review
  IN_REVIEW: 'IN_REVIEW',

  // Phase 4: Completed
  DELIVERED: 'COMPLETED', // Or Review? Usually delivered means done from agency side
  PAID: 'COMPLETED',
  CLOSED: 'COMPLETED',
  CANCELED: 'COMPLETED', // Shows as completed/archived
};

export const CLIENT_STATUS_CONFIG: Record<ClientStatus, StatusConfig> = {
  SUBMITTED: {
    label: 'Submitted',
    color: 'blue',
    bgClass: 'bg-blue-100 dark:bg-blue-500/20',
    textClass: 'text-blue-700 dark:text-blue-300',
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
  COMPLETED: {
    label: 'Completed',
    color: 'green',
    bgClass: 'bg-green-100 dark:bg-green-500/20',
    textClass: 'text-green-700 dark:text-green-300',
  },
};

