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
import { getFirestoreDb } from '@/lib/firebase';
import {
  Request,
  CreateRequestData,
  UpdateRequestData,
  REQUEST_STATUS,
  RequestStatus,
  PricingLineItem,
  Currency,
  calculateTotalAmount,
} from '@/lib/types/portal';

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
  try {
    const docRef = doc(db, REQUESTS_COLLECTION, requestId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Request;
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      console.error('Permission denied accessing request:', requestId);
      return null;
    }
    throw error;
  }
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

  try {
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Request[];
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      console.error('Permission denied accessing requests for org:', orgId);
      return [];
    }
    throw error;
  }
}

export async function getAllRequests(): Promise<Request[]> {
  try {
    const q = query(collection(db, REQUESTS_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Request[];
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      console.error('Permission denied accessing all requests. User may need agency permissions.');
      return [];
    }
    throw error;
  }
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

export async function updateRequest(
  requestId: string,
  data: UpdateRequestData
): Promise<void> {
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

export async function updateRequestStatus(
  requestId: string,
  status: RequestStatus
): Promise<void> {
  return updateRequest(requestId, { status });
}

export async function assignRequest(
  requestId: string,
  assignedTo: string,
  assignedToName: string
): Promise<void> {
  const docRef = doc(db, REQUESTS_COLLECTION, requestId);
  await updateDoc(docRef, {
    assignedTo,
    assignedToName,
    updatedAt: serverTimestamp(),
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
  return onSnapshot(docRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }
    callback({
      id: snapshot.id,
      ...snapshot.data(),
    } as Request);
  }, (error) => {
    console.error('Error in request snapshot:', error);
    callback(null);
  });
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

  return onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Request[];
    callback(requests);
  }, (error) => {
    console.error('Error in org requests snapshot:', error);
    callback([]);
  });
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
    active: requests.filter((r) =>
      ([REQUEST_STATUS.NEW, REQUEST_STATUS.QUEUED, REQUEST_STATUS.IN_PROGRESS] as RequestStatus[]).includes(r.status)
    ).length,
    inReview: requests.filter((r) => r.status === REQUEST_STATUS.IN_REVIEW).length,
    completed: requests.filter((r) =>
      ([REQUEST_STATUS.DELIVERED, REQUEST_STATUS.CLOSED, REQUEST_STATUS.PAID] as RequestStatus[]).includes(r.status)
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
}

/**
 * Client accepts the quoted price
 */
export async function acceptRequest(
  requestId: string,
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
}

/**
 * Client declines the quoted price
 */
export async function declineRequest(
  requestId: string,
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
}

/**
 * Agency starts work on the request
 */
export async function startRequestWork(requestId: string): Promise<void> {
  await updateDoc(doc(db, REQUESTS_COLLECTION, requestId), {
    status: REQUEST_STATUS.IN_PROGRESS,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Mark request as paid after successful payment
 */
export async function markRequestPaid(
  requestId: string,
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
}

