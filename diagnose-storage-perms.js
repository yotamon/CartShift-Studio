/**
 * Diagnose Storage Permission Issue
 * Run this in browser console while logged in
 */

(async function diagnoseStoragePermissions() {
  console.log('🔍 Storage Permission Diagnostic\n' + '='.repeat(60));

  try {
    // Get Firebase instances
    const { getAuth } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
    const { getFirestore, doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');

    const auth = getAuth();
    const db = getFirestore();
    const user = auth.currentUser;

    if (!user) {
      console.error('❌ NOT AUTHENTICATED');
      return;
    }

    console.log('✅ Authenticated');
    console.log(`   User ID: ${user.uid}`);
    console.log(`   Email: ${user.email}\n`);

    // Check portal_users document
    console.log('📄 Checking portal_users document...');
    const userDoc = await getDoc(doc(db, 'portal_users', user.uid));

    if (!userDoc.exists()) {
      console.error('❌ portal_users document DOES NOT EXIST');
      return;
    }

    const userData = userDoc.data();
    console.log('✅ portal_users document exists');
    console.log(`   isAgency: ${userData.isAgency}`);
    console.log(`   accountType: ${userData.accountType}`);
    console.log(`   organizations: ${JSON.stringify(userData.organizations || [])}\n`);

    // Check each organization
    const orgs = userData.organizations || [];

    for (const orgId of orgs) {
      console.log(`📦 Checking organization: ${orgId}`);

      // Check portal_organizations
      const orgDoc = await getDoc(doc(db, 'portal_organizations', orgId));
      if (!orgDoc.exists()) {
        console.error(`   ❌ Organization document MISSING`);
        continue;
      }

      const orgData = orgDoc.data();
      console.log(`   ✅ Organization exists: ${orgData.name}`);
      console.log(`   createdBy: ${orgData.createdBy}`);
      console.log(`   Match: ${orgData.createdBy === user.uid ? '✅ YES' : '❌ NO'}`);

      // Check portal_members
      const memberId = `${orgId}_${user.uid}`;
      const memberDoc = await getDoc(doc(db, 'portal_members', memberId));

      if (!memberDoc.exists()) {
        console.error(`   ❌ Member document MISSING (ID: ${memberId})`);
      } else {
        const memberData = memberDoc.data();
        console.log(`   ✅ Member document exists (ID: ${memberId})`);
        console.log(`   Role: ${memberData.role}`);
      }

      console.log('');
    }

    // Summary for Storage Rules
    console.log('📋 STORAGE RULES EVALUATION SUMMARY');
    console.log('=' .repeat(60));
    console.log(`isAgencyUser(): ${userData.isAgency === true || userData.accountType === 'AGENCY' ? '✅ PASS' : '❌ FAIL'}`);

    for (const orgId of orgs) {
      const orgDoc = await getDoc(doc(db, 'portal_organizations', orgId));
      const memberId = `${orgId}_${user.uid}`;
      const memberDoc = await getDoc(doc(db, 'portal_members', memberId));

      const orgData = orgDoc.exists() ? orgDoc.data() : null;
      const isCreator = orgData?.createdBy === user.uid;
      const hasMembership = memberDoc.exists();
      const isAgency = userData.isAgency === true || userData.accountType === 'AGENCY';

      console.log(`\nisOrgMember(${orgId}):`);
      console.log(`  - isAgencyUser: ${isAgency ? '✅' : '❌'}`);
      console.log(`  - isOrgCreator: ${isCreator ? '✅' : '❌'}`);
      console.log(`  - hasMemberDoc: ${hasMembership ? '✅' : '❌'}`);
      console.log(`  RESULT: ${isAgency || isCreator || hasMembership ? '✅ SHOULD ALLOW UPLOAD' : '❌ WILL DENY UPLOAD'}`);
    }

  } catch (error) {
    console.error('❌ Diagnostic failed:', error);
  }
})();
