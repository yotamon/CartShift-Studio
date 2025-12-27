import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from 'firebase/firestore';
import { getFirestoreDb } from '@/lib/firebase';
import { PortalUser, ACCOUNT_TYPE } from '@/lib/types/portal';

const USERS_COLLECTION = 'portal_users';

export async function getAgencyTeam(): Promise<PortalUser[]> {
  const db = getFirestoreDb();
  const q = query(
    collection(db, USERS_COLLECTION),
    where('accountType', '==', ACCOUNT_TYPE.AGENCY),
    orderBy('name', 'asc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as PortalUser[];
}
