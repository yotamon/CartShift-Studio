import { useState, useEffect } from 'react';
import { getAuthInstance } from '@/lib/services/auth';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PortalUser } from '@/lib/types/portal';

interface UserData {
  id: string;
  email: string;
  name?: string;
  isAgency?: boolean;
  organizations?: string[];
}

export function usePortalAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeAuth: (() => void) | undefined;
    let unsubscribeUserData: (() => void) | undefined;

    try {
      const auth = getAuthInstance();

      // Listen to auth state changes
      unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);

        if (currentUser) {
          // Subscribe to user data from Firestore
          const userDocRef = doc(db, 'portal_users', currentUser.uid);
          unsubscribeUserData = onSnapshot(userDocRef, (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.data() as PortalUser;
              setUserData({
                id: currentUser.uid,
                email: currentUser.email || data.email,
                name: data.name || currentUser.displayName || undefined,
                isAgency: data.isAgency || false,
                organizations: data.organizations || [],
              });
            } else {
              // Fallback to auth user data if no Firestore doc
              setUserData({
                id: currentUser.uid,
                email: currentUser.email || '',
                name: currentUser.displayName || undefined,
                isAgency: false,
                organizations: [],
              });
            }
            setLoading(false);
          }, (error) => {
            console.error('Error fetching user data:', error);
            setUserData({
              id: currentUser.uid,
              email: currentUser.email || '',
              name: currentUser.displayName || undefined,
            });
            setLoading(false);
          });
        } else {
          setUserData(null);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      setLoading(false);
    }

    // Cleanup subscriptions on unmount
    return () => {
      if (unsubscribeAuth) {
        unsubscribeAuth();
      }
      if (unsubscribeUserData) {
        unsubscribeUserData();
      }
    };
  }, []);

  return {
    user,
    userData,
    loading,
    isAuthenticated: !!user,
    isAgency: userData?.isAgency || false,
  };
}
