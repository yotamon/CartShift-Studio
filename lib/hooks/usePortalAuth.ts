import { useState, useEffect } from 'react';
import { getAuthInstance } from '@/lib/services/auth';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PortalUser, AccountType, ACCOUNT_TYPE } from '@/lib/types/portal';

interface UserData {
  id: string;
  email: string;
  name?: string;
  accountType: AccountType;
  isAgency: boolean;
  organizations?: string[];
  notificationPreferences?: PortalUser['notificationPreferences'];
}

// Helper to derive account type from existing data (for backward compatibility)
function deriveAccountType(data: Partial<PortalUser>): AccountType {
  // If accountType is explicitly set, use it
  if (data.accountType && Object.values(ACCOUNT_TYPE).includes(data.accountType)) {
    return data.accountType;
  }
  // Fall back to isAgency field for backward compatibility
  return data.isAgency ? ACCOUNT_TYPE.AGENCY : ACCOUNT_TYPE.CLIENT;
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
      unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);

        if (currentUser) {
          // Ensure auth token is ready before accessing Firestore
          try {
            await currentUser.getIdToken();
          } catch (error) {
            console.error('Error getting auth token:', error);
            setUserData({
              id: currentUser.uid,
              email: currentUser.email || '',
              name: currentUser.displayName || undefined,
              accountType: ACCOUNT_TYPE.CLIENT,
              isAgency: false,
            });
            setLoading(false);
            return;
          }

          // Subscribe to user data from Firestore
          const userDocRef = doc(db, 'portal_users', currentUser.uid);
          unsubscribeUserData = onSnapshot(userDocRef, (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.data() as Partial<PortalUser>;
              const accountType = deriveAccountType(data);
              setUserData({
                id: currentUser.uid,
                email: currentUser.email || data.email || '',
                name: data.name || currentUser.displayName || undefined,
                accountType,
                isAgency: accountType === ACCOUNT_TYPE.AGENCY,
                organizations: data.organizations || [],
                notificationPreferences: data.notificationPreferences,
              });
            } else {
              // Fallback to auth user data if no Firestore doc
              setUserData({
                id: currentUser.uid,
                email: currentUser.email || '',
                name: currentUser.displayName || undefined,
                accountType: ACCOUNT_TYPE.CLIENT,
                isAgency: false,
                organizations: [],
              });
            }
            setLoading(false);
          }, (error) => {
            if (error.code === 'permission-denied') {
              console.error('Permission denied accessing user data. User may not be authenticated properly.');
            } else {
              console.error('Error fetching user data:', error);
            }
            setUserData({
              id: currentUser.uid,
              email: currentUser.email || '',
              name: currentUser.displayName || undefined,
              accountType: ACCOUNT_TYPE.CLIENT,
              isAgency: false,
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
    isAgency: userData?.accountType === ACCOUNT_TYPE.AGENCY,
    accountType: userData?.accountType || ACCOUNT_TYPE.CLIENT,
  };
}

