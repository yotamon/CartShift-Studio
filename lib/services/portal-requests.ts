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
import { db } from '@/lib/firebase';
import {
  Request,
  CreateRequestData,
  UpdateRequestData,
  REQUEST_STATUS,
  RequestStatus,
} from '@/lib/types/portal';

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
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Request[];
}

export async function getAllRequests(): Promise<Request[]> {
  const q = query(collection(db, REQUESTS_COLLECTION), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
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
      ([REQUEST_STATUS.DELIVERED, REQUEST_STATUS.CLOSED] as RequestStatus[]).includes(r.status)
    ).length,
  };
}
