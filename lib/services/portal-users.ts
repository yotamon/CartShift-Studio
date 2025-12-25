import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { getFirestoreDb } from '@/lib/firebase';
import { PortalUser } from '@/lib/types/portal';

const db = getFirestoreDb();
const USERS_COLLECTION = 'portal_users';

export async function getPortalUser(userId: string): Promise<PortalUser | null> {
  const docRef = doc(db, USERS_COLLECTION, userId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as PortalUser;
}

export async function updatePortalUser(
  userId: string,
  data: Partial<PortalUser>
): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, userId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function updateNotificationPreferences(
  userId: string,
  preferences: PortalUser['notificationPreferences']
): Promise<void> {
  return updatePortalUser(userId, { notificationPreferences: preferences });
}
