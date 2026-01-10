import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { getFirestoreDb, waitForAuth } from '@/lib/firebase';
import { withRetry } from '@/lib/utils/retry';

const TESTIMONIALS_COLLECTION = 'portal_testimonials';

// ============================================
// TYPES
// ============================================

export type TestimonialStatus = 'pending' | 'approved' | 'rejected';

export interface Testimonial {
  id: string;
  orgId: string;
  userId: string;
  userName: string;
  userEmail: string;
  companyName: string;
  role?: string;
  rating: number; // 1-5
  headline: string;
  content: string;
  projectHighlight?: string;
  wouldRecommend: boolean;
  status: TestimonialStatus;
  // Optional: specific aspects rated
  aspects?: {
    communication?: number;
    quality?: number;
    timeliness?: number;
    value?: number;
  };
  // Admin fields
  adminNotes?: string;
  approvedAt?: Timestamp;
  approvedBy?: string;
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateTestimonialData {
  rating: number;
  headline: string;
  content: string;
  projectHighlight?: string;
  wouldRecommend: boolean;
  role?: string;
  aspects?: {
    communication?: number;
    quality?: number;
    timeliness?: number;
    value?: number;
  };
}

// ============================================
// CREATE
// ============================================

export async function createTestimonial(
  orgId: string,
  userId: string,
  userName: string,
  userEmail: string,
  companyName: string,
  data: CreateTestimonialData
): Promise<Testimonial> {
  return withRetry(async () => {
    await waitForAuth();
    const db = getFirestoreDb();

    const testimonialData = {
      orgId,
      userId,
      userName,
      userEmail,
      companyName,
      role: data.role || '',
      rating: data.rating,
      headline: data.headline.trim(),
      content: data.content.trim(),
      projectHighlight: data.projectHighlight?.trim() || '',
      wouldRecommend: data.wouldRecommend,
      aspects: data.aspects || {},
      status: 'pending' as TestimonialStatus,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, TESTIMONIALS_COLLECTION), testimonialData);

    return {
      id: docRef.id,
      ...testimonialData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    } as Testimonial;
  });
}

// ============================================
// READ
// ============================================

export async function getTestimonialByOrg(orgId: string): Promise<Testimonial | null> {
  await waitForAuth();
  const db = getFirestoreDb();

  const q = query(
    collection(db, TESTIMONIALS_COLLECTION),
    where('orgId', '==', orgId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  // Return the most recent testimonial for this org
  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
  } as Testimonial;
}

export async function getTestimonialById(testimonialId: string): Promise<Testimonial | null> {
  await waitForAuth();
  const db = getFirestoreDb();
  const docRef = doc(db, TESTIMONIALS_COLLECTION, testimonialId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Testimonial;
}

export async function getAllTestimonials(status?: TestimonialStatus): Promise<Testimonial[]> {
  await waitForAuth();
  const db = getFirestoreDb();

  let q = query(collection(db, TESTIMONIALS_COLLECTION), orderBy('createdAt', 'desc'));

  if (status) {
    q = query(q, where('status', '==', status));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Testimonial[];
}

export async function getApprovedTestimonials(): Promise<Testimonial[]> {
  return getAllTestimonials('approved');
}

// ============================================
// UPDATE
// ============================================

export async function updateTestimonial(
  testimonialId: string,
  data: Partial<CreateTestimonialData>
): Promise<void> {
  return withRetry(async () => {
    await waitForAuth();
    const db = getFirestoreDb();
    const docRef = doc(db, TESTIMONIALS_COLLECTION, testimonialId);

    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  });
}

export async function updateTestimonialStatus(
  testimonialId: string,
  status: TestimonialStatus,
  approvedBy?: string,
  adminNotes?: string
): Promise<void> {
  return withRetry(async () => {
    await waitForAuth();
    const db = getFirestoreDb();
    const docRef = doc(db, TESTIMONIALS_COLLECTION, testimonialId);

    const updateData: Record<string, unknown> = {
      status,
      updatedAt: serverTimestamp(),
    };

    if (status === 'approved' && approvedBy) {
      updateData.approvedAt = serverTimestamp();
      updateData.approvedBy = approvedBy;
    }

    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }

    await updateDoc(docRef, updateData);
  });
}

// ============================================
// CHECK
// ============================================

export async function hasSubmittedTestimonial(orgId: string): Promise<boolean> {
  const testimonial = await getTestimonialByOrg(orgId);
  return testimonial !== null;
}
