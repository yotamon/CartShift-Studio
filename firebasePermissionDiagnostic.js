/**
 * Firebase Permission Diagnostic Tool
 *
 * Paste this entire script into your browser console to diagnose permission issues
 * Run it while accessing your site (after any permission errors occur)
 */

(async function diagnoseCarts ShiftFirebase() {
  console.log('🔍 CartShift Firebase Diagnostic Tool\n');
  console.log('=' .repeat(50));

  try {
    // Import Firebase SDKs
    const { getAuth } = await import('https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js');
    const { getFirestore, doc, getDoc, collection, getDocs, query, where } = await import('https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js');
    const { initializeApp, getApps } = await import('https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js');

    // Get Firebase instances from page context
    let auth, db;
    try {
      // Try to get existing instances from window
      if (window.__firebaseInstances) {
        auth = window.__firebaseInstances.auth;
        db = window.__firebaseInstances.db;
      } else {
        // Or try to get from React devtools
        auth = getAuth();
        db = getFirestore();
      }
    } catch (e) {
      console.error('❌ Could not access Firebase instances:', e.message);
      return;
    }

    // Test 1: Authentication
    console.log('\n1️⃣ AUTHENTICATION STATUS');
    console.log('-'.repeat(50));
    const user = auth.currentUser;

    if (!user) {
      console.error('❌ NOT AUTHENTICATED');
      console.log('👉 Action: Sign in to your CartShift account');
      return;
    }

    console.log('✅ Authenticated');
    console.log(`   User ID: ${user.uid}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Display Name: ${user.displayName || '(not set)'}`);

    // Test 2: User Document
    console.log('\n2️⃣ USER DOCUMENT (portal_users)');
    console.log('-'.repeat(50));

    let userDoc;
    try {
      userDoc = await getDoc(doc(db, 'portal_users', user.uid));

      if (!userDoc.exists()) {
        console.error('❌ User document does not exist');
        console.log('👉 Action: Create user document in portal_users collection');
        console.log('\nTemplate:');
        console.log(JSON.stringify({
          id: user.uid,
          email: user.email,
          name: user.displayName || 'User',
          organizations: [],
          createdAt: new Date().toISOString(),
        }, null, 2));
      } else {
        console.log('✅ User document exists');
        const data = userDoc.data();
        console.log(`   Email: ${data.email}`);
        console.log(`   Name: ${data.name}`);
        console.log(`   Organizations: ${JSON.stringify(data.organizations || [])}`);
      }
    } catch (error) {
      console.error('❌ Cannot read user document:', error.message);
      console.log('👉 This is a permission error - user document is protected');
    }

    if (!userDoc?.exists()) return;

    // Test 3: Organizations
    const orgs = userDoc.data().organizations || [];
    console.log('\n3️⃣ ORGANIZATIONS & MEMBERSHIP');
    console.log('-'.repeat(50));

    if (orgs.length === 0) {
      console.error('❌ No organizations found');
      console.log('👉 Action: Create an organization');
      return;
    }

    for (const orgId of orgs) {
      console.log(`\n   Organization: ${orgId}`);

      // Check org exists
      try {
        const orgDoc = await getDoc(doc(db, 'portal_organizations', orgId));
        if (!orgDoc.exists()) {
          console.error(`   ❌ Organization document missing`);
        } else {
          console.log(`   ✅ Organization exists: ${orgDoc.data().name}`);
        }
      } catch (e) {
        console.error(`   ❌ Cannot read org document:`, e.message);
      }

      // Check membership
      const memberId = `${orgId}_${user.uid}`;
      try {
        const memberDoc = await getDoc(doc(db, 'portal_members', memberId));
        if (!memberDoc.exists()) {
          console.error(`   ❌ Member document missing (ID: ${memberId})`);
        } else {
          console.log(`   ✅ Member document exists`);
          console.log(`      Role: ${memberDoc.data().role}`);
        }
      } catch (e) {
        console.error(`   ❌ Cannot read member document:`, e.message);
      }
    }

    // Test 4: Sample Collections
    console.log('\n4️⃣ SAMPLE COLLECTION ACCESS');
    console.log('-'.repeat(50));

    const collections = ['portal_requests', 'portal_invites', 'portal_files'];

    for (const collName of collections) {
      try {
        const snap = await getDocs(query(
          collection(db, collName),
          where('orgId', '==', orgs[0])
        ));
        console.log(`✅ ${collName}: Can read (${snap.size} docs)`);
      } catch (error) {
        console.error(`❌ ${collName}: ${error.message}`);
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Diagnostic complete!');

  } catch (error) {
    console.error('❌ Diagnostic failed:', error);
  }
})();
