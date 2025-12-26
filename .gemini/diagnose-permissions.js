// Firebase Permission Diagnostics
// Run this in your browser console to diagnose permission issues

(async function diagn osePermissions() {
  console.log('🔍 Starting Firebase Permission Diagnostics...\n');

  try {
    // Check 1: Authentication
    console.log('1️⃣ Checking Authentication...');
    const { getAuth } = await import('firebase/auth');
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error('❌ NOT AUTHENTICATED');
      console.log('👉 Please sign in first');
      return;
    }

    console.log('✅ Authenticated');
    console.log(`   User ID: ${user.uid}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Token: ${(await user.getIdToken()).substring(0, 20)}...`);

    // Check 2: User Document
    console.log('\n2️⃣ Checking User Document...');
    const { getFirestore, doc, getDoc } = await import('firebase/firestore');
    const db = getFirestore();

    try {
      const userDocRef = doc(db, 'portal_users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        console.log('✅ User document exists');
        const userData = userDoc.data();
        console.log(`   Organizations: ${JSON.stringify(userData.organizations || [])}`);
        console.log(`   Is Agency: ${userData.isAgency || false}`);

        // Check 3: Organization Memberships
        console.log('\n3️⃣ Checking Organization Memberships...');
        const orgs = userData.organizations || [];

        if (orgs.length === 0) {
          console.warn('⚠️  No organizations found');
          console.log('👉 You need to join or create an organization');
        } else {
          for (const orgId of orgs) {
            const memberId = `${orgId}_${user.uid}`;
            const memberDocRef = doc(db, 'portal_members', memberId);
            const memberDoc = await getDoc(memberDocRef);

            if (memberDoc.exists()) {
              console.log(`✅ Membership found for org: ${orgId}`);
              console.log(`   Role: ${memberDoc.data().role}`);
            } else {
              console.error(`❌ Membership document MISSING for org: ${orgId}`);
              console.log(`   Expected document ID: ${memberId}`);
              console.log('👉 This is likely the cause of permission errors');
            }
          }
        }
      } else {
        console.error('❌ User document does NOT exist');
        console.log('👉 User profile needs to be created');
      }
    } catch (error) {
      console.error('❌ Error checking user document:', error.code);
      console.log(`   Error: ${error.message}`);

      if (error.code === 'permission-denied') {
        console.log('👉 Permission denied reading user document');
        console.log('   This means you might not be properly authenticated');
        console.log('   Try signing out and signing back in');
      }
    }

    // Check 4: Try to read a request
    console.log('\n4️⃣ Testing Request Read Permission...');
    try {
      const { collection, query, limit, getDocs } = await import('firebase/firestore');
      const requestsQuery = query(
        collection(db, 'portal_requests'),
        limit(1)
      );
      const snapshot = await getDocs(requestsQuery);
      console.log(`✅ Successfully queried requests (found ${snapshot.size} documents)`);
    } catch (error) {
      console.error('❌ Error querying requests:', error.code);
      console.log(`   Error: ${error.message}`);

      if (error.code === 'permission-denied') {
        console.log('👉 This confirms the permission issue');
        console.log('   Possible causes:');
        console.log('   - Missing membership document');
        console.log('   - Rules haven\'t propagated yet (wait 1-2 minutes)');
        console.log('   - Auth token needs refresh');
      }
    }

    // Summary
    console.log('\n📊 SUMMARY');
    console.log('━'.repeat(50));
    console.log('If you see ❌ errors above, those are the issues to fix.');
    console.log('Most common fix: Ensure membership documents exist.');
    console.log('\nNext steps:');
    console.log('1. If membership is missing, contact your org admin');
    console.log('2. If rules issue, wait 1-2 minutes for propagation');
    console.log('3. If auth issue, sign out and sign back in');

  } catch (error) {
    console.error('Fatal error running diagnostics:', error);
  }
})();
