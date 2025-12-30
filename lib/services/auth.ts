import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebaseAuth, getFirestoreDb } from '@/lib/firebase';
import { ACCOUNT_TYPE } from '@/lib/types/portal';

/**
 * Get the Firebase Auth instance from the centralized Firebase configuration
 * This ensures we use a single, properly configured Firebase app instance
 */
export function getAuthInstance() {
  return getFirebaseAuth();
}

export async function loginWithEmail(email: string, password: string): Promise<User> {
  try {
    // Validate inputs
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    const authInstance = getAuthInstance();

    // Check if Firebase is properly configured
    if (!authInstance) {
      throw new Error(
        'Firebase Auth is not properly initialized. Please check your environment variables.'
      );
    }

    const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
    return userCredential.user;
  } catch (error: unknown) {
    // Re-throw Firebase auth errors with more context
    const authError = error as { code?: string; message?: string };
    if (authError.code) {
      // Firebase Auth error codes
      const errorMessage = authError.message || 'Authentication failed';
      const enhancedError = new Error(errorMessage) as Error & { code: string };
      enhancedError.code = authError.code;
      throw enhancedError;
    }
    throw error;
  }
}

export async function signUpWithEmail(
  email: string,
  password: string,
  name?: string
): Promise<User> {
  try {
    // Validate inputs
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Validate password length
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const authInstance = getAuthInstance();

    // Check if Firebase is properly configured
    if (!authInstance) {
      throw new Error(
        'Firebase Auth is not properly initialized. Please check your environment variables.'
      );
    }

    const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);

    // Update user profile with display name if provided
    if (name && userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: name,
      });
    }

    // Ensure auth token is ready before accessing Firestore
    const user = userCredential.user;
    await user.getIdToken(true);

    // Create portal user document
    const db = getFirestoreDb();
    await setDoc(doc(db, 'portal_users', user.uid), {
      email: user.email,
      name: name || user.displayName || null,
      photoUrl: user.photoURL || null,
      accountType: ACCOUNT_TYPE.CLIENT,
      isAgency: false,
      organizations: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return user;
  } catch (error: unknown) {
    // Re-throw Firebase auth errors with more context
    const authError = error as { code?: string; message?: string };
    if (authError.code) {
      const errorMessage = authError.message || 'Registration failed';
      const enhancedError = new Error(errorMessage) as Error & { code: string };
      enhancedError.code = authError.code;
      throw enhancedError;
    }
    throw error;
  }
}

export async function logout(): Promise<void> {
  try {
    const authInstance = getAuthInstance();
    if (!authInstance) {
      throw new Error('Firebase Auth is not properly initialized');
    }
    await signOut(authInstance);
  } catch (error: unknown) {
    console.error('Logout error:', error);
    throw error;
  }
}

export async function resetPassword(email: string): Promise<void> {
  try {
    if (!email) {
      throw new Error('Email is required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    const authInstance = getAuthInstance();
    if (!authInstance) {
      throw new Error('Firebase Auth is not properly initialized');
    }
    await sendPasswordResetEmail(authInstance, email);
  } catch (error: unknown) {
    const authError = error as { code?: string; message?: string };
    if (authError.code) {
      const errorMessage = authError.message || 'Password reset failed';
      const enhancedError = new Error(errorMessage) as Error & { code: string };
      enhancedError.code = authError.code;
      throw enhancedError;
    }
    throw error;
  }
}

export function getCurrentUser(): User | null {
  try {
    const authInstance = getAuthInstance();
    return authInstance?.currentUser || null;
  } catch {
    return null;
  }
}
