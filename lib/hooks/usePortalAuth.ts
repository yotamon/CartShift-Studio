import { useState, useEffect, useRef } from 'react';
import { getAuthInstance } from '@/lib/services/auth';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PortalUser, AccountType, ACCOUNT_TYPE } from '@/lib/types/portal';
import { PortalErrorCode, getPortalError } from '@/lib/constants/error-codes';

interface UserData {
  id: string;
  email: string;
  name?: string;
  photoUrl?: string;
  accountType: AccountType;
  isAgency: boolean;
  organizations?: string[];
  notificationPreferences?: PortalUser['notificationPreferences'];
  onboardingComplete?: boolean;
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
  const [error, setError] = useState<PortalErrorCode | null>(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    let unsubscribeAuth: (() => void) | undefined;
    let unsubscribeUserData: (() => void) | undefined;

    // Load cached data
    try {
      const cached = localStorage.getItem('portal_user_data');
      if (cached) {
        const parsed = JSON.parse(cached);
        // Only use cache if it's less than 1 hour old to avoid very stale data
        const cacheTime = parsed._cacheTime;
        if (cacheTime && Date.now() - cacheTime < 1000 * 60 * 60) {
          setUserData(parsed);
          // Set loading to false temporarily to show cached data
          // Real data will update this shortly
          setLoading(false);
        }
      }
    } catch (e) {
      console.error('Error reading auth cache:', e);
    }

    try {
      const auth = getAuthInstance();

      // Listen to auth state changes
      unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
        if (!isMountedRef.current) return;
        setUser(currentUser);

        if (currentUser) {
          // Ensure auth token is ready before accessing Firestore
          try {
            await currentUser.getIdToken();
          } catch (err) {
            if (!isMountedRef.current) return;
            console.error('Error getting auth token:', err);
            setError(getPortalError(err));
            setUserData({
              id: currentUser.uid,
              email: currentUser.email || '',
              name: currentUser.displayName || undefined,
              photoUrl: currentUser.photoURL || undefined,
              accountType: ACCOUNT_TYPE.CLIENT,
              isAgency: false,
            });
            setLoading(false);
            return;
          }

          // Subscribe to user data from Firestore
          const userDocRef = doc(db, 'portal_users', currentUser.uid);
          unsubscribeUserData = onSnapshot(userDocRef, (snapshot) => {
            if (!isMountedRef.current) return;
            if (snapshot.exists()) {
              const data = snapshot.data() as Partial<PortalUser>;
              const accountType = deriveAccountType(data);
              const newUserData: UserData = {
                id: currentUser.uid,
                email: currentUser.email || data.email || '',
                name: data.name || currentUser.displayName || undefined,
                photoUrl: data.photoUrl || currentUser.photoURL || undefined,
                accountType,
                isAgency: accountType === ACCOUNT_TYPE.AGENCY,
                organizations: data.organizations || [],
                notificationPreferences: data.notificationPreferences,
                onboardingComplete: data.onboardingComplete ?? false,
              };

              setUserData(newUserData);

              // Update cache
              localStorage.setItem('portal_user_data', JSON.stringify({
                ...newUserData,
                _cacheTime: Date.now()
              }));
            } else {
              // Fallback to auth user data if no Firestore doc
              const fallbackData = {
                id: currentUser.uid,
                email: currentUser.email || '',
                name: currentUser.displayName || undefined,
                photoUrl: currentUser.photoURL || undefined,
                accountType: ACCOUNT_TYPE.CLIENT,
                isAgency: false,
                organizations: [],
              };
              setUserData(fallbackData);
              // Clear cache if user exists in Auth but not Firestore (rare edge case or new user)
              localStorage.removeItem('portal_user_data');
            }
            setLoading(false);
          }, (err) => {
            if (!isMountedRef.current) return;
            console.error('Error fetching user data:', err);
            setError(getPortalError(err));
            // Keep existing userData if available (from cache), otherwise set basic
            setLoading(false);
          });
        } else {
          if (!isMountedRef.current) return;
          setUserData(null);
          localStorage.removeItem('portal_user_data');
          setLoading(false);
        }
      });
    } catch (err) {
      if (!isMountedRef.current) return;
      console.error('Auth initialization error:', err);
      setError(getPortalError(err));
      setLoading(false);
    }

    // Cleanup subscriptions on unmount
    return () => {
      isMountedRef.current = false;
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
    isAuthenticated: !!user || !!userData,
    isAgency: userData?.accountType === ACCOUNT_TYPE.AGENCY,
    accountType: userData?.accountType || ACCOUNT_TYPE.CLIENT,
    error,
  };
}

