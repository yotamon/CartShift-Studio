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
import { db } from '@/lib/firebase';
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

  const docRef = await addDoc(collection(db, COMMENTS_COLLECTION), commentData);

  // Increment comment count on request
  await incrementCommentCount(requestId);

  return {
    id: docRef.id,
    ...commentData,
    createdAt: Timestamp.now(),
  } as Comment;
}

// ============================================
// READ
// ============================================

export async function getCommentsByRequest(
  requestId: string,
  includeInternal = false
): Promise<Comment[]> {
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
}

// ============================================
// UPDATE
// ============================================

export async function updateComment(
  commentId: string,
  content: string
): Promise<void> {
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
  const docRef = doc(db, COMMENTS_COLLECTION, commentId);
  await deleteDoc(docRef);
}

// ============================================
// REAL-TIME SUBSCRIPTIONS
// ============================================

export function subscribeToRequestComments(
  requestId: string,
  callback: (comments: Comment[]) => void,
  includeInternal = false
): () => void {
  let q = query(
    collection(db, COMMENTS_COLLECTION),
    where('requestId', '==', requestId),
    orderBy('createdAt', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    let comments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Comment[];

    if (!includeInternal) {
      comments = comments.filter((c) => !c.isInternal);
    }

    callback(comments);
  });
}
