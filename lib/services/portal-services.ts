import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { getFirestoreDb } from '@/lib/firebase';
import { Service } from '@/lib/types/portal';

const SERVICES_COLLECTION = 'portal_services';

export async function createService(data: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const db = getFirestoreDb();
  const docRef = await addDoc(collection(db, SERVICES_COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateService(id: string, data: Partial<Omit<Service, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
  const db = getFirestoreDb();
  const serviceRef = doc(db, SERVICES_COLLECTION, id);
  await updateDoc(serviceRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteService(id: string): Promise<void> {
  const db = getFirestoreDb();
  await deleteDoc(doc(db, SERVICES_COLLECTION, id));
}

export async function getService(id: string): Promise<Service | null> {
  const db = getFirestoreDb();
  const serviceSnap = await getDoc(doc(db, SERVICES_COLLECTION, id));
  if (serviceSnap.exists()) {
    return { id: serviceSnap.id, ...serviceSnap.data() } as Service;
  }
  return null;
}

export function subscribeToServices(callback: (services: Service[]) => void): () => void {
  const db = getFirestoreDb();
  const q = query(
    collection(db, SERVICES_COLLECTION),
    orderBy('name', 'asc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const services = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];
      callback(services);
    },
    (error) => {
      console.error('Error in services subscription:', error);
      callback([]);
    }
  );
}
