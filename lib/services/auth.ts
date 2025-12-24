import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  type Auth,
  type User
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only on client side
let auth: Auth | null = null;

function initializeFirebase() {
  if (typeof window === 'undefined') {
    return null;
  }

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  return getAuth(app);
}

export function getAuthInstance(): Auth {
  if (!auth) {
    auth = initializeFirebase();
  }

  if (!auth) {
    throw new Error('Firebase Auth not available on server side');
  }

  return auth;
}

export async function loginWithEmail(email: string, password: string): Promise<User> {
  const authInstance = getAuthInstance();
  const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
  return userCredential.user;
}

export async function signUpWithEmail(email: string, password: string, name?: string): Promise<User> {
  const authInstance = getAuthInstance();
  const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);

  // Update user profile with display name if provided
  if (name && userCredential.user) {
    await updateProfile(userCredential.user, {
      displayName: name
    });
  }

  // Create portal user document
  const user = userCredential.user;
  await setDoc(doc(db, 'portal_users', user.uid), {
    email: user.email,
    name: name || user.displayName || null,
    photoUrl: user.photoURL || null,
    isAgency: false,
    organizations: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return user;
}

export async function logout(): Promise<void> {
  const authInstance = getAuthInstance();
  await signOut(authInstance);
}

export async function resetPassword(email: string): Promise<void> {
  const authInstance = getAuthInstance();
  await sendPasswordResetEmail(authInstance, email);
}

export function getCurrentUser(): User | null {
  try {
    const authInstance = getAuthInstance();
    return authInstance.currentUser;
  } catch {
    return null;
  }
}
