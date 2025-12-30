import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { getFirestoreDb, waitForAuth } from '@/lib/firebase';
import { ActivityLog } from '@/lib/types/portal';

const ACTIVITIES_COLLECTION = 'portal_activities';

export async function logActivity(data: Omit<ActivityLog, 'id' | 'createdAt'>): Promise<void> {
  await waitForAuth();
  const db = getFirestoreDb();
  await addDoc(collection(db, ACTIVITIES_COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export function subscribeToOrgActivities(
  orgId: string,
  callback: (activities: ActivityLog[]) => void,
  maxItems: number = 20
): () => void {
  let unsubscribe: (() => void) | null = null;
  let isUnsubscribed = false;

  waitForAuth()
    .then(() => {
      if (isUnsubscribed) return;
      const db = getFirestoreDb();
      const q = query(
        collection(db, ACTIVITIES_COLLECTION),
        where('orgId', '==', orgId),
        orderBy('createdAt', 'desc'),
        limit(maxItems)
      );

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const activities = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as ActivityLog[];
          callback(activities);
        },
        (error) => {
          console.error('Error in activities snapshot:', error);
          callback([]);
        }
      );
    })
    .catch(error => {
      console.error('Error waiting for auth in subscribeToOrgActivities:', error);
      callback([]);
    });

  return () => {
    isUnsubscribed = true;
    if (unsubscribe) {
      unsubscribe();
    }
  };
}

export function subscribeToRequestActivities(
  requestId: string,
  callback: (activities: ActivityLog[]) => void
): () => void {
  let unsubscribe: (() => void) | null = null;
  let isUnsubscribed = false;

  waitForAuth()
    .then(() => {
      if (isUnsubscribed) return;
      const db = getFirestoreDb();
      const q = query(
        collection(db, ACTIVITIES_COLLECTION),
        where('requestId', '==', requestId),
        orderBy('createdAt', 'desc')
      );

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const activities = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as ActivityLog[];
          callback(activities);
        },
        (error) => {
          console.error('Error in request activities snapshot:', error);
          callback([]);
        }
      );
    })
    .catch(error => {
      console.error('Error waiting for auth in subscribeToRequestActivities:', error);
      callback([]);
    });

  return () => {
    isUnsubscribed = true;
    if (unsubscribe) {
      unsubscribe();
    }
  };
}
