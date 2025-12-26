import {
  collection,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import { getFirestoreDb } from '@/lib/firebase';
import { Notification } from '@/lib/types/portal';

const NOTIFICATIONS_COLLECTION = 'portal_notifications';

export async function getNotifications(userId: string, options?: { limit?: number }): Promise<Notification[]> {
  const db = getFirestoreDb();
  const q = query(
    collection(db, NOTIFICATIONS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    ...(options?.limit ? [limit(options.limit)] : [])
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Notification[];
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const db = getFirestoreDb();
  const q = query(
    collection(db, NOTIFICATIONS_COLLECTION),
    where('userId', '==', userId),
    where('read', '==', false)
  );

  const snapshot = await getDocs(q);
  return snapshot.size;
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const db = getFirestoreDb();
  const docRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
  await updateDoc(docRef, {
    read: true,
  });
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  const db = getFirestoreDb();
  const q = query(
    collection(db, NOTIFICATIONS_COLLECTION),
    where('userId', '==', userId),
    where('read', '==', false)
  );

  const snapshot = await getDocs(q);
  const updates = snapshot.docs.map((doc) =>
    updateDoc(doc.ref, { read: true })
  );

  await Promise.all(updates);
}

export function subscribeToNotifications(
  userId: string,
  callback: (notifications: Notification[]) => void,
  options?: { limit?: number }
): () => void {
  const db = getFirestoreDb();
  const q = query(
    collection(db, NOTIFICATIONS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    ...(options?.limit ? [limit(options.limit)] : [])
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Notification[];
    callback(notifications);
  }, (error) => {
    console.error('Error in notifications snapshot:', error);
    callback([]);
  });
}

export function subscribeToUnreadCount(
  userId: string,
  callback: (count: number) => void
): () => void {
  const db = getFirestoreDb();
  const q = query(
    collection(db, NOTIFICATIONS_COLLECTION),
    where('userId', '==', userId),
    where('read', '==', false)
  );

  return onSnapshot(q, (snapshot) => {
    callback(snapshot.size);
  }, (error) => {
    console.error('Error in unread count snapshot:', error);
    callback(0);
  });
}

