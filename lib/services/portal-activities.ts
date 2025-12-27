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
import { getFirestoreDb } from '@/lib/firebase';
import { ActivityLog } from '@/lib/types/portal';

const db = getFirestoreDb();
const ACTIVITIES_COLLECTION = 'portal_activities';

export async function logActivity(data: Omit<ActivityLog, 'id' | 'createdAt'>): Promise<void> {
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
  const q = query(
    collection(db, ACTIVITIES_COLLECTION),
    where('orgId', '==', orgId),
    orderBy('createdAt', 'desc'),
    limit(maxItems)
  );

  return onSnapshot(
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
}

export function subscribeToRequestActivities(
  requestId: string,
  callback: (activities: ActivityLog[]) => void
): () => void {
  const q = query(
    collection(db, ACTIVITIES_COLLECTION),
    where('requestId', '==', requestId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
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
}
