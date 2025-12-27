import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  onSnapshot,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import { getFirestoreDb, getFirebaseAuth } from '@/lib/firebase';
import { getPortalUser } from './portal-users';
import {
  Request,
  CreateRequestData,
  UpdateRequestData,
  REQUEST_STATUS,
  RequestStatus,
  PricingLineItem,
  Currency,
  calculateTotalAmount,
  Milestone,
  MilestoneStatus,
  MILESTONE_STATUS,
} from '@/lib/types/portal';
import { logActivity } from './portal-activities';

// Initialize Firestore
const db = getFirestoreDb();

const REQUESTS_COLLECTION = 'portal_requests';

// ============================================
// CREATE
// ============================================

export async function createRequest(
  orgId: string,
  userId: string,
  userName: string,
  data: CreateRequestData
): Promise<Request> {
  const requestData = {
    orgId,
    title: data.title.trim(),
    description: data.description.trim(),
    type: data.type,
    status: REQUEST_STATUS.NEW as RequestStatus,
    priority: data.priority,
    createdBy: userId,
    createdByName: userName,
    tags: data.tags || [],
    attachmentIds: [],
    commentCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, REQUESTS_COLLECTION), requestData);

  await logActivity({
    orgId,
    requestId: docRef.id,
    userId,
    userName,
    action: 'CREATED_REQUEST',
    details: { title: data.title },
  });

  return {
    id: docRef.id,
    ...requestData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  } as Request;
}

// ============================================
// READ
// ============================================

export async function getRequest(requestId: string): Promise<Request | null> {
  const docRef = doc(db, REQUESTS_COLLECTION, requestId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Request;
}

export async function getRequestsByOrg(
  orgId: string,
  options?: {
    status?: RequestStatus | RequestStatus[];
    limit?: number;
  }
): Promise<Request[]> {
  let q = query(
    collection(db, REQUESTS_COLLECTION),
    where('orgId', '==', orgId),
    orderBy('createdAt', 'desc')
  );

  if (options?.status) {
    const statuses = Array.isArray(options.status) ? options.status : [options.status];
    q = query(q, where('status', 'in', statuses));
  }

  if (options?.limit) {
    q = query(q, limit(options.limit));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Request[];
}

export async function getAllRequests(): Promise<Request[]> {
  const auth = getFirebaseAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error('User must be authenticated to access all requests');
  }

  const userData = await getPortalUser(currentUser.uid);
  if (!userData || (userData.accountType !== 'AGENCY' && !userData.isAgency)) {
    throw new Error('Agency permissions required to access all requests');
  }

  const q = query(collection(db, REQUESTS_COLLECTION), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Request[];
}

export async function getRecentRequestsByOrg(orgId: string, count = 5): Promise<Request[]> {
  return getRequestsByOrg(orgId, { limit: count });
}

export async function getActiveRequestsByOrg(orgId: string): Promise<Request[]> {
  return getRequestsByOrg(orgId, {
    status: [
      REQUEST_STATUS.NEW,
      REQUEST_STATUS.NEEDS_INFO,
      REQUEST_STATUS.QUEUED,
      REQUEST_STATUS.IN_PROGRESS,
      REQUEST_STATUS.IN_REVIEW,
    ],
  });
}

// ============================================
// UPDATE
// ============================================

export async function updateRequest(requestId: string, data: UpdateRequestData): Promise<void> {
  const docRef = doc(db, REQUESTS_COLLECTION, requestId);
  const updateData: Record<string, unknown> = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  // Handle status change to closed
  if (data.status === REQUEST_STATUS.CLOSED || data.status === REQUEST_STATUS.CANCELED) {
    updateData.closedAt = serverTimestamp();
  }

  await updateDoc(docRef, updateData);
}

export async function updateRequestStatus(requestId: string, status: RequestStatus): Promise<void> {
  return updateRequest(requestId, { status });
}

export async function assignRequest(
  requestId: string,
  orgId: string,
  userId: string,
  userName: string,
  assignedTo: string,
  assignedToName: string
): Promise<void> {
  const docRef = doc(db, REQUESTS_COLLECTION, requestId);
  await updateDoc(docRef, {
    assignedTo,
    assignedToName,
    updatedAt: serverTimestamp(),
  });

  await logActivity({
    orgId,
    requestId,
    userId,
    userName,
    action: 'ASSIGNED_REQUEST',
    details: { assignedTo, assignedToName },
  });
}

export async function incrementCommentCount(requestId: string): Promise<void> {
  const docRef = doc(db, REQUESTS_COLLECTION, requestId);
  await updateDoc(docRef, {
    commentCount: increment(1),
    updatedAt: serverTimestamp(),
  });
}

// ============================================
// DELETE
// ============================================

export async function deleteRequest(requestId: string): Promise<void> {
  const docRef = doc(db, REQUESTS_COLLECTION, requestId);
  await deleteDoc(docRef);
}

// ============================================
// REAL-TIME SUBSCRIPTIONS
// ============================================

export function subscribeToRequest(
  requestId: string,
  callback: (request: Request | null) => void
): () => void {
  const docRef = doc(db, REQUESTS_COLLECTION, requestId);
  return onSnapshot(
    docRef,
    snapshot => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }
      callback({
        id: snapshot.id,
        ...snapshot.data(),
      } as Request);
    },
    error => {
      console.error('Error in request snapshot:', error);
      callback(null);
    }
  );
}

export function subscribeToOrgRequests(
  orgId: string,
  callback: (requests: Request[]) => void
): () => void {
  const q = query(
    collection(db, REQUESTS_COLLECTION),
    where('orgId', '==', orgId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    q,
    snapshot => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Request[];
      callback(requests);
    },
    error => {
      console.error('Error in org requests snapshot:', error);
      callback([]);
    }
  );
}

// ============================================
// STATS
// ============================================

export async function getRequestStats(orgId: string): Promise<{
  total: number;
  active: number;
  inReview: number;
  completed: number;
}> {
  const requests = await getRequestsByOrg(orgId);

  return {
    total: requests.length,
    active: requests.filter(r =>
      (
        [REQUEST_STATUS.NEW, REQUEST_STATUS.QUEUED, REQUEST_STATUS.IN_PROGRESS] as RequestStatus[]
      ).includes(r.status)
    ).length,
    inReview: requests.filter(r => r.status === REQUEST_STATUS.IN_REVIEW).length,
    completed: requests.filter(r =>
      (
        [REQUEST_STATUS.DELIVERED, REQUEST_STATUS.CLOSED, REQUEST_STATUS.PAID] as RequestStatus[]
      ).includes(r.status)
    ).length,
  };
}

// ============================================
// PRICING & BILLING
// ============================================

export interface AddPricingData {
  lineItems: PricingLineItem[];
  currency: Currency;
  validUntil?: Date;
}

/**
 * Agency adds pricing to a request (converts to billable)
 */
export async function addPricingToRequest(
  requestId: string,
  orgId: string,
  userId: string,
  userName: string,
  data: AddPricingData
): Promise<void> {
  const totalAmount = calculateTotalAmount(data.lineItems);

  await updateDoc(doc(db, REQUESTS_COLLECTION, requestId), {
    isBillable: true,
    lineItems: data.lineItems,
    totalAmount,
    currency: data.currency,
    validUntil: data.validUntil ? Timestamp.fromDate(data.validUntil) : null,
    quotedAt: serverTimestamp(),
    status: REQUEST_STATUS.QUOTED,
    updatedAt: serverTimestamp(),
  });

  await logActivity({
    orgId,
    requestId,
    userId,
    userName,
    action: 'ADDED_PRICING',
    details: { totalAmount, currency: data.currency },
  });
}

/**
 * Client accepts the quoted price
 */
export async function acceptRequest(
  requestId: string,
  orgId: string,
  userId: string,
  userName: string,
  clientNotes?: string
): Promise<void> {
  const updateData: Record<string, unknown> = {
    status: REQUEST_STATUS.ACCEPTED,
    acceptedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (clientNotes) {
    updateData.clientNotes = clientNotes;
  }

  await updateDoc(doc(db, REQUESTS_COLLECTION, requestId), updateData);

  await logActivity({
    orgId,
    requestId,
    userId,
    userName,
    action: 'ACCEPTED_QUOTE',
  });
}

/**
 * Client declines the quoted price
 */
export async function declineRequest(
  requestId: string,
  orgId: string,
  userId: string,
  userName: string,
  clientNotes?: string
): Promise<void> {
  const updateData: Record<string, unknown> = {
    status: REQUEST_STATUS.DECLINED,
    declinedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (clientNotes) {
    updateData.clientNotes = clientNotes;
  }

  await updateDoc(doc(db, REQUESTS_COLLECTION, requestId), updateData);

  await logActivity({
    orgId,
    requestId,
    userId,
    userName,
    action: 'DECLINED_QUOTE',
  });
}

/**
 * Agency starts work on the request
 */
export async function startRequestWork(
  requestId: string,
  orgId: string,
  userId: string,
  userName: string
): Promise<void> {
  await updateDoc(doc(db, REQUESTS_COLLECTION, requestId), {
    status: REQUEST_STATUS.IN_PROGRESS,
    updatedAt: serverTimestamp(),
  });

  await logActivity({
    orgId,
    requestId,
    userId,
    userName,
    action: 'STARTED_WORK',
  });
}

/**
 * Mark request as paid after successful payment
 */
export async function markRequestPaid(
  requestId: string,
  orgId: string,
  userId: string,
  userName: string,
  paymentId: string,
  paymentMethod: 'paypal' = 'paypal'
): Promise<void> {
  await updateDoc(doc(db, REQUESTS_COLLECTION, requestId), {
    status: REQUEST_STATUS.PAID,
    paymentId,
    paymentMethod,
    paidAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await logActivity({
    orgId,
    requestId,
    userId,
    userName,
    action: 'PAID_REQUEST',
    details: { paymentId, paymentMethod },
  });
}

// ============================================
// MILESTONES
// ============================================

/**
 * Update all milestones for a request
 */
export async function updateRequestMilestones(
  requestId: string,
  milestones: Milestone[]
): Promise<void> {
  // Find the current milestone (first non-completed, non-pending)
  const sortedMilestones = [...milestones].sort((a, b) => a.order - b.order);
  const currentMilestone =
    sortedMilestones.find(m => m.status === MILESTONE_STATUS.IN_PROGRESS) ||
    sortedMilestones.find(m => m.status === MILESTONE_STATUS.PENDING);

  await updateDoc(doc(db, REQUESTS_COLLECTION, requestId), {
    milestones,
    currentMilestoneId: currentMilestone?.id || null,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Update a single milestone's status
 */
export async function updateMilestoneStatus(
  requestId: string,
  milestoneId: string,
  status: MilestoneStatus,
  completedBy?: string
): Promise<void> {
  const request = await getRequest(requestId);
  if (!request?.milestones) return;

  const updatedMilestones = request.milestones.map(m => {
    if (m.id === milestoneId) {
      const updates: Partial<Milestone> = {
        status,
        updatedAt: Timestamp.now(),
      };

      if (status === MILESTONE_STATUS.COMPLETED) {
        updates.completedAt = Timestamp.now();
        updates.completedBy = completedBy;
      }

      return { ...m, ...updates };
    }
    return m;
  });

  await updateRequestMilestones(requestId, updatedMilestones);
}

/**
 * Calculate milestone progress percentage
 */
export function calculateMilestoneProgress(milestones: Milestone[]): number {
  if (!milestones || milestones.length === 0) return 0;
  const completed = milestones.filter(m => m.status === MILESTONE_STATUS.COMPLETED).length;
  return Math.round((completed / milestones.length) * 100);
}

/**
 * Client requests a revision
 */
export async function requestRevision(
  requestId: string,
  orgId: string,
  userId: string,
  userName: string,
  revisionNotes: string
): Promise<void> {
  const db = getFirestoreDb();
  await updateDoc(doc(db, REQUESTS_COLLECTION, requestId), {
    status: REQUEST_STATUS.IN_PROGRESS,
    updatedAt: serverTimestamp(),
  });

  // Log activity
  await logActivity({
    orgId,
    requestId,
    userId,
    userName,
    action: 'REQUESTED_REVISION',
    details: { notes: revisionNotes }
  });
}
