// Quick debug script - paste this in your browser console while logged in

import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getFirestoreDb } from '@/lib/firebase/client-app';

async function checkUserStatus() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    console.error('❌ Not logged in');
    return;
  }

  console.log('✅ Logged in as:', user.email);
  console.log('User ID:', user.uid);

  const db = getFirestoreDb();
  const userDoc = await getDoc(doc(db, 'portal_users', user.uid));

  if (!userDoc.exists()) {
    console.error('❌ User document not found');
    return;
  }

  const userData = userDoc.data();
  console.log('👤 User Data:', userData);
  console.log('🏢 Account Type:', userData.accountType);
  console.log('🔧 Is Agency:', userData.isAgency);

  if (userData.accountType === 'AGENCY' || userData.isAgency === true) {
    console.log('✅ User is marked as AGENCY - should have access');
  } else {
    console.log('❌ User is NOT marked as agency - this is the problem!');
    console.log('Need to update user document to set accountType: "AGENCY"');
  }
}

checkUserStatus();
