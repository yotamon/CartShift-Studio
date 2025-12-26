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
  serverTimestamp,
} from 'firebase/firestore';
import { getFirestoreDb } from '@/lib/firebase';
import {
  PricingRequest,
  CreatePricingRequestData,
  UpdatePricingRequestData,
  PRICING_STATUS,
  PricingStatus,
  PricingLineItem,
  calculateTotalAmount,
  generateLineItemId,
} from '@/lib/types/pricing';

// Initialize Firestore
const db = getFirestoreDb();

const PRICING_REQUESTS_COLLECTION = 'portal_pricing_requests';

// ============================================
// CREATE
// ============================================

export async function createPricingRequest(
  orgId: string,
  userId: string,
  userName: string,
  data: CreatePricingRequestData
): Promise<PricingRequest> {
  // Add IDs to line items
  const lineItems: PricingLineItem[] = data.lineItems.map((item) => ({
    ...item,
    id: generateLineItemId(),
  }));

  const totalAmount = calculateTotalAmount(lineItems);

  const requestData = {
    orgId,
    title: data.title.trim(),
    description: data.description?.trim() || null,
    lineItems,
    totalAmount,
    currency: data.currency,
    status: PRICING_STATUS.DRAFT as PricingStatus,
    clientName: data.clientName?.trim() || null,
    clientEmail: data.clientEmail?.trim().toLowerCase() || null,
    agencyNotes: data.agencyNotes?.trim() || null,
    validUntil: data.validUntil ? Timestamp.fromDate(data.validUntil) : null,
    createdBy: userId,
    createdByName: userName,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, PRICING_REQUESTS_COLLECTION), requestData);

  return {
    id: docRef.id,
    ...requestData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  } as PricingRequest;
}

// ============================================
// READ
// ============================================

export async function getPricingRequest(requestId: string): Promise<PricingRequest | null> {
  try {
    const docRef = doc(db, PRICING_REQUESTS_COLLECTION, requestId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as PricingRequest;
  } catch (error: unknown) {
    const firebaseError = error as { code?: string };
    if (firebaseError.code === 'permission-denied') {
      console.error('Permission denied accessing pricing request:', requestId);
      return null;
    }
    throw error;
  }
}

export async function getPricingRequestsByOrg(
  orgId: string,
  options?: {
    status?: PricingStatus | PricingStatus[];
    limit?: number;
    createdBy?: string;
  }
): Promise<PricingRequest[]> {
  let q = query(
    collection(db, PRICING_REQUESTS_COLLECTION),
    where('orgId', '==', orgId),
    orderBy('createdAt', 'desc')
  );

  if (options?.status) {
    const statuses = Array.isArray(options.status) ? options.status : [options.status];
    q = query(q, where('status', 'in', statuses));
  }

  if (options?.createdBy) {
    q = query(q, where('createdBy', '==', options.createdBy));
  }

  if (options?.limit) {
    q = query(q, limit(options.limit));
  }

  try {
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PricingRequest[];
  } catch (error: unknown) {
    const firebaseError = error as { code?: string };
    if (firebaseError.code === 'permission-denied') {
      console.error('Permission denied accessing pricing requests for org:', orgId);
      return [];
    }
    throw error;
  }
}

export async function getClientPricingRequests(orgId: string): Promise<PricingRequest[]> {
  // Get pricing requests that have been sent to the client (not drafts)
  return getPricingRequestsByOrg(orgId, {
    status: [
      PRICING_STATUS.SENT,
      PRICING_STATUS.CLIENT_EDITED,
      PRICING_STATUS.ACCEPTED,
      PRICING_STATUS.PAID,
      PRICING_STATUS.DECLINED,
    ],
  });
}

export async function getPendingClientPricingRequests(orgId: string): Promise<PricingRequest[]> {
  // Get pricing requests pending client action
  return getPricingRequestsByOrg(orgId, {
    status: [PRICING_STATUS.SENT, PRICING_STATUS.ACCEPTED],
  });
}

// ============================================
// UPDATE
// ============================================

export async function updatePricingRequest(
  requestId: string,
  data: UpdatePricingRequestData
): Promise<void> {
  const docRef = doc(db, PRICING_REQUESTS_COLLECTION, requestId);
  const updateData: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };

  if (data.title !== undefined) updateData.title = data.title.trim();
  if (data.description !== undefined) updateData.description = data.description?.trim() || null;
  if (data.lineItems !== undefined) {
    updateData.lineItems = data.lineItems;
    updateData.totalAmount = calculateTotalAmount(data.lineItems);
  }
  if (data.currency !== undefined) updateData.currency = data.currency;
  if (data.validUntil !== undefined) {
    updateData.validUntil = data.validUntil ? Timestamp.fromDate(data.validUntil) : null;
  }
  if (data.clientName !== undefined) updateData.clientName = data.clientName?.trim() || null;
  if (data.clientEmail !== undefined) {
    updateData.clientEmail = data.clientEmail?.trim().toLowerCase() || null;
  }
  if (data.clientNotes !== undefined) updateData.clientNotes = data.clientNotes?.trim() || null;
  if (data.agencyNotes !== undefined) updateData.agencyNotes = data.agencyNotes?.trim() || null;
  if (data.status !== undefined) updateData.status = data.status;

  await updateDoc(docRef, updateData);
}

export async function sendPricingRequest(requestId: string): Promise<void> {
  const docRef = doc(db, PRICING_REQUESTS_COLLECTION, requestId);
  await updateDoc(docRef, {
    status: PRICING_STATUS.SENT,
    sentAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function acceptPricingRequest(requestId: string, clientNotes?: string): Promise<void> {
  const docRef = doc(db, PRICING_REQUESTS_COLLECTION, requestId);
  const updateData: Record<string, unknown> = {
    status: PRICING_STATUS.ACCEPTED,
    acceptedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (clientNotes !== undefined) {
    updateData.clientNotes = clientNotes.trim() || null;
  }

  await updateDoc(docRef, updateData);
}

export async function declinePricingRequest(requestId: string, reason?: string): Promise<void> {
  const docRef = doc(db, PRICING_REQUESTS_COLLECTION, requestId);
  const updateData: Record<string, unknown> = {
    status: PRICING_STATUS.DECLINED,
    declinedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (reason !== undefined) {
    updateData.clientNotes = reason.trim() || null;
  }

  await updateDoc(docRef, updateData);
}

export async function submitClientEdits(
  requestId: string,
  lineItems: PricingLineItem[],
  clientNotes?: string
): Promise<void> {
  const docRef = doc(db, PRICING_REQUESTS_COLLECTION, requestId);
  await updateDoc(docRef, {
    status: PRICING_STATUS.CLIENT_EDITED,
    lineItems,
    totalAmount: calculateTotalAmount(lineItems),
    clientNotes: clientNotes?.trim() || null,
    updatedAt: serverTimestamp(),
  });
}

export async function markPricingRequestPaid(
  requestId: string,
  paymentId: string,
  paymentMethod: 'paypal' = 'paypal'
): Promise<void> {
  const docRef = doc(db, PRICING_REQUESTS_COLLECTION, requestId);
  await updateDoc(docRef, {
    status: PRICING_STATUS.PAID,
    paymentId,
    paymentMethod,
    paidAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function cancelPricingRequest(requestId: string): Promise<void> {
  const docRef = doc(db, PRICING_REQUESTS_COLLECTION, requestId);
  await updateDoc(docRef, {
    status: PRICING_STATUS.CANCELED,
    updatedAt: serverTimestamp(),
  });
}

// ============================================
// DELETE
// ============================================

export async function deletePricingRequest(requestId: string): Promise<void> {
  const docRef = doc(db, PRICING_REQUESTS_COLLECTION, requestId);
  await deleteDoc(docRef);
}

// ============================================
// REAL-TIME SUBSCRIPTIONS
// ============================================

export function subscribeToPricingRequest(
  requestId: string,
  callback: (request: PricingRequest | null) => void
): () => void {
  const docRef = doc(db, PRICING_REQUESTS_COLLECTION, requestId);
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }
      callback({
        id: snapshot.id,
        ...snapshot.data(),
      } as PricingRequest);
    },
    (error) => {
      console.error('Error in pricing request snapshot:', error);
      callback(null);
    }
  );
}

export function subscribeToOrgPricingRequests(
  orgId: string,
  callback: (requests: PricingRequest[]) => void,
  options?: {
    status?: PricingStatus[];
    excludeDrafts?: boolean;
  }
): () => void {
  let q = query(
    collection(db, PRICING_REQUESTS_COLLECTION),
    where('orgId', '==', orgId),
    orderBy('createdAt', 'desc')
  );

  // For clients, exclude drafts
  if (options?.excludeDrafts) {
    q = query(
      collection(db, PRICING_REQUESTS_COLLECTION),
      where('orgId', '==', orgId),
      where('status', '!=', PRICING_STATUS.DRAFT),
      orderBy('status'),
      orderBy('createdAt', 'desc')
    );
  }

  return onSnapshot(
    q,
    (snapshot) => {
      let requests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PricingRequest[];

      // Client-side filtering for status if needed
      if (options?.status && options.status.length > 0) {
        requests = requests.filter((r) => options.status!.includes(r.status));
      }

      callback(requests);
    },
    (error) => {
      console.error('Error in org pricing requests snapshot:', error);
      callback([]);
    }
  );
}

// ============================================
// STATS
// ============================================

export async function getPricingStats(orgId: string): Promise<{
  total: number;
  draft: number;
  pending: number;
  accepted: number;
  paid: number;
  totalRevenue: number;
}> {
  const requests = await getPricingRequestsByOrg(orgId);

  const paidRequests = requests.filter((r) => r.status === PRICING_STATUS.PAID);
  const totalRevenue = paidRequests.reduce((sum, r) => sum + r.totalAmount, 0);

  return {
    total: requests.length,
    draft: requests.filter((r) => r.status === PRICING_STATUS.DRAFT).length,
    pending: requests.filter((r) =>
      ([PRICING_STATUS.SENT, PRICING_STATUS.CLIENT_EDITED, PRICING_STATUS.ACCEPTED] as PricingStatus[]).includes(
        r.status
      )
    ).length,
    accepted: requests.filter((r) => r.status === PRICING_STATUS.ACCEPTED).length,
    paid: paidRequests.length,
    totalRevenue,
  };
}
