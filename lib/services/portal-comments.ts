import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { getFirestoreDb } from '@/lib/firebase';
import { Comment, CreateCommentData } from '@/lib/types/portal';
import { incrementCommentCount } from './portal-requests';

const COMMENTS_COLLECTION = 'portal_comments';

// ============================================
// CREATE
// ============================================

export async function createComment(
  requestId: string,
  orgId: string,
  userId: string,
  userName: string,
  userPhotoUrl: string | undefined,
  data: CreateCommentData
): Promise<Comment> {
  const db = getFirestoreDb();
  const commentData = {
    requestId,
    orgId,
    userId,
    userName,
    userPhotoUrl: userPhotoUrl || null,
    content: data.content.trim(),
    attachmentIds: data.attachmentIds || [],
    isInternal: data.isInternal || false,
    createdAt: serverTimestamp(),
  };

  try {
    const docRef = await addDoc(collection(db, COMMENTS_COLLECTION), commentData);

    // Increment comment count on request
    await incrementCommentCount(requestId);

    return {
      id: docRef.id,
      ...commentData,
      createdAt: Timestamp.now(),
    } as Comment;
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied: You do not have permission to create comments on this request.');
    }
    throw error;
  }
}

// ============================================
// READ
// ============================================

export async function getCommentsByRequest(
  requestId: string,
  includeInternal = false
): Promise<Comment[]> {
  const db = getFirestoreDb();
  try {
    let q = query(
      collection(db, COMMENTS_COLLECTION),
      where('requestId', '==', requestId),
      orderBy('createdAt', 'asc')
    );

    if (!includeInternal) {
      q = query(q, where('isInternal', '==', false));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Comment[];
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      console.error('Permission denied accessing comments for request:', requestId);
      return [];
    }
    throw error;
  }
}

// ============================================
// UPDATE
// ============================================

export async function updateComment(
  commentId: string,
  content: string
): Promise<void> {
  const db = getFirestoreDb();
  const docRef = doc(db, COMMENTS_COLLECTION, commentId);
  await updateDoc(docRef, {
    content: content.trim(),
    updatedAt: serverTimestamp(),
  });
}

// ============================================
// DELETE
// ============================================

export async function deleteComment(commentId: string): Promise<void> {
  const db = getFirestoreDb();
  const docRef = doc(db, COMMENTS_COLLECTION, commentId);
  await deleteDoc(docRef);
}

// ============================================
// REAL-TIME SUBSCRIPTIONS
// ============================================

export function subscribeToRequestComments(
  requestId: string,
  callback: (comments: Comment[]) => void,
  includeInternal = false,
  orgId?: string
): () => void {
  const db = getFirestoreDb();
  const isAgency = Boolean(includeInternal);

  let q;

  if (orgId) {
    q = query(
      collection(db, COMMENTS_COLLECTION),
      where('requestId', '==', requestId),
      where('orgId', '==', orgId),
      orderBy('createdAt', 'asc')
    );
  } else {
    q = query(
      collection(db, COMMENTS_COLLECTION),
      where('requestId', '==', requestId),
      orderBy('createdAt', 'asc')
    );
  }

  return onSnapshot(q, (snapshot) => {
    let comments = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      } as Comment;
    });

    if (!isAgency) {
      comments = comments.filter((c) => !c.isInternal);
    }

    callback(comments);
  }, (error) => {
    console.error('Error in comments snapshot:', error);
    if (error.code === 'failed-precondition') {
      console.error('Missing Firestore index. Please create a composite index for:', {
        collection: COMMENTS_COLLECTION,
        fields: orgId ? ['requestId', 'orgId', 'createdAt'] : ['requestId', 'createdAt']
      });
    } else if (error.code === 'permission-denied') {
      console.error('Permission denied accessing comments. User may not have access to this request.');
    }
    callback([]);
  });
}
