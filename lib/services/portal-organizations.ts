import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { getFirestoreDb } from '@/lib/firebase';
import {
  Organization,
  OrganizationMember,
  Invite,
  InviteMemberData,
  USER_ROLE,
  UserRole,
} from '@/lib/types/portal';

// Initialize Firestore
const db = getFirestoreDb();

const ORGS_COLLECTION = 'portal_organizations';
const MEMBERS_COLLECTION = 'portal_members';
const INVITES_COLLECTION = 'portal_invites';
const USERS_COLLECTION = 'portal_users';

// ============================================
// ORGANIZATIONS
// ============================================

export async function createOrganization(
  name: string,
  userId: string,
  userEmail: string,
  userName?: string
): Promise<Organization> {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const orgData = {
    name: name.trim(),
    slug,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, ORGS_COLLECTION), orgData);
  const orgId = docRef.id;

  // Add creator as owner
  await addMember(orgId, userId, userEmail, USER_ROLE.OWNER, userName);

  // Update user's organizations array
  const userRef = doc(db, USERS_COLLECTION, userId);
  await setDoc(userRef, {
    email: userEmail,
    name: userName || null,
    organizations: arrayUnion(orgId),
    updatedAt: serverTimestamp(),
  }, { merge: true });

  return {
    id: orgId,
    ...orgData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  } as Organization;
}

export async function getOrganization(orgId: string): Promise<Organization | null> {
  const docRef = doc(db, ORGS_COLLECTION, orgId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Organization;
}

export async function getUserOrganizations(userId: string): Promise<Organization[]> {
  // Get user's org IDs
  const userRef = doc(db, USERS_COLLECTION, userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return [];
  }

  const userData = userSnap.data();
  const orgIds = userData.organizations || [];

  if (orgIds.length === 0) {
    return [];
  }

  // Fetch all organizations
  const orgs: Organization[] = [];
  for (const orgId of orgIds) {
    const org = await getOrganization(orgId);
    if (org) {
      orgs.push(org);
    }
  }

  return orgs;
}

export async function getAllOrganizations(): Promise<Organization[]> {
  const q = query(collection(db, ORGS_COLLECTION), orderBy('name', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Organization[];
}

export async function updateOrganization(
  orgId: string,
  data: {
    name?: string;
    logoUrl?: string;
    website?: string;
    industry?: string;
    bio?: string;
  }
): Promise<void> {
  const docRef = doc(db, ORGS_COLLECTION, orgId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ============================================
// MEMBERS
// ============================================

async function addMember(
  orgId: string,
  userId: string,
  email: string,
  role: UserRole,
  name?: string,
  invitedBy?: string
): Promise<OrganizationMember> {
  const memberData = {
    orgId,
    userId,
    email,
    name: name || null,
    role,
    invitedBy: invitedBy || null,
    joinedAt: serverTimestamp(),
  };

  const memberId = `${orgId}_${userId}`;
  const docRef = doc(db, MEMBERS_COLLECTION, memberId);
  await setDoc(docRef, memberData);

  return {
    id: memberId,
    ...memberData,
    joinedAt: Timestamp.now(),
  } as OrganizationMember;
}

export async function getOrganizationMembers(orgId: string): Promise<OrganizationMember[]> {
  const q = query(
    collection(db, MEMBERS_COLLECTION),
    where('orgId', '==', orgId),
    orderBy('joinedAt', 'asc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as OrganizationMember[];
}

export async function getMemberByUserId(
  orgId: string,
  userId: string
): Promise<OrganizationMember | null> {
  const memberId = `${orgId}_${userId}`;
  const memberRef = doc(db, MEMBERS_COLLECTION, memberId);
  const memberSnap = await getDoc(memberRef);

  if (!memberSnap.exists()) {
    return null;
  }

  return {
    id: memberSnap.id,
    ...memberSnap.data(),
  } as OrganizationMember;
}

export async function updateMemberRole(
  memberId: string,
  role: UserRole
): Promise<void> {
  const docRef = doc(db, MEMBERS_COLLECTION, memberId);
  await updateDoc(docRef, { role });
}

export async function removeMember(
  memberId: string,
  orgId: string,
  userId: string
): Promise<void> {
  // Remove from members
  const memberRef = doc(db, MEMBERS_COLLECTION, memberId);
  await updateDoc(memberRef, { removedAt: serverTimestamp() });

  // Remove org from user's list
  const userRef = doc(db, USERS_COLLECTION, userId);
  await setDoc(userRef, {
    organizations: arrayRemove(orgId),
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

// ============================================
// INVITES
// ============================================

export async function createInvite(
  orgId: string,
  invitedBy: string,
  invitedByName: string,
  data: InviteMemberData
): Promise<Invite> {
  // Check if already a member
  const existingMembers = await getOrganizationMembers(orgId);
  if (existingMembers.some((m) => m.email === data.email)) {
    throw new Error('This user is already a member of this organization');
  }

  // Check for existing pending invite
  const existingInvite = await getPendingInviteByEmail(orgId, data.email);
  if (existingInvite) {
    throw new Error('An invite has already been sent to this email');
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 day expiry

  const inviteData = {
    orgId,
    email: data.email.toLowerCase().trim(),
    role: data.role,
    invitedBy,
    invitedByName,
    status: 'pending' as const,
    expiresAt: Timestamp.fromDate(expiresAt),
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, INVITES_COLLECTION), inviteData);

  return {
    id: docRef.id,
    ...inviteData,
    createdAt: Timestamp.now(),
  } as Invite;
}

export async function getPendingInviteByEmail(
  orgId: string,
  email: string
): Promise<Invite | null> {
  const q = query(
    collection(db, INVITES_COLLECTION),
    where('orgId', '==', orgId),
    where('email', '==', email.toLowerCase()),
    where('status', '==', 'pending')
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
  } as Invite;
}

export async function getInvitesByOrg(orgId: string): Promise<Invite[]> {
  const q = query(
    collection(db, INVITES_COLLECTION),
    where('orgId', '==', orgId),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Invite[];
}

export async function getInvitesByEmail(email: string): Promise<Invite[]> {
  const q = query(
    collection(db, INVITES_COLLECTION),
    where('email', '==', email.toLowerCase()),
    where('status', '==', 'pending')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Invite[];
}

export async function acceptInvite(
  inviteId: string,
  userId: string,
  userName?: string
): Promise<void> {
  const inviteRef = doc(db, INVITES_COLLECTION, inviteId);
  const inviteSnap = await getDoc(inviteRef);

  if (!inviteSnap.exists()) {
    throw new Error('Invite not found');
  }

  const invite = inviteSnap.data() as Invite;

  if (invite.status !== 'pending') {
    throw new Error('This invite has already been used');
  }

  // Check if expired
  if (invite.expiresAt.toDate() < new Date()) {
    await updateDoc(inviteRef, { status: 'expired' });
    throw new Error('This invite has expired');
  }

  // Add as member
  await addMember(invite.orgId, userId, invite.email, invite.role, userName, invite.invitedBy);

  // Update user's organizations
  const userRef = doc(db, USERS_COLLECTION, userId);
  await setDoc(userRef, {
    email: invite.email,
    name: userName || null,
    organizations: arrayUnion(invite.orgId),
    updatedAt: serverTimestamp(),
  }, { merge: true });

  // Mark invite as accepted
  await updateDoc(inviteRef, {
    status: 'accepted',
    acceptedAt: serverTimestamp(),
  });
}

export async function cancelInvite(inviteId: string): Promise<void> {
  const inviteRef = doc(db, INVITES_COLLECTION, inviteId);
  await updateDoc(inviteRef, { status: 'expired' });
}

/**
 * Helper function to invite a team member
 */
export async function inviteTeamMember(
  orgId: string,
  email: string,
  role: 'admin' | 'member' | 'viewer'
): Promise<Invite> {
  // In a real implementation, you'd get the current user from auth context
  // For now, we'll use placeholder values that should be replaced
  const invitedBy = 'current-user-id'; // Should come from auth
  const invitedByName = 'Current User'; // Should come from auth

  return createInvite(orgId, invitedBy, invitedByName, {
    email,
    role,
  });
}

export function subscribeToInvites(
  orgId: string,
  callback: (invites: Invite[]) => void
): () => void {
  const q = query(
    collection(db, INVITES_COLLECTION),
    where('orgId', '==', orgId),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const invites = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Invite[];
    callback(invites);
  }, (error) => {
    console.error('Error in invites snapshot:', error);
    callback([]);
  });
}

export function subscribeToMembers(
  orgId: string,
  callback: (members: OrganizationMember[]) => void
): () => void {
  const q = query(
    collection(db, MEMBERS_COLLECTION),
    where('orgId', '==', orgId),
    orderBy('joinedAt', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const members = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as OrganizationMember[];
    callback(members);
  }, (error) => {
    console.error('Error in members snapshot:', error);
    callback([]);
  });
}



