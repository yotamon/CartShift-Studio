'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { getFirestoreDb } from '@/lib/firebase';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';
import { PortalCard } from '@/components/portal/ui/PortalCard';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import { PortalBadge } from '@/components/portal/ui/PortalBadge';
import { Invite } from '@/lib/types/portal';
import { CheckCircle2, XCircle, Clock, Loader2, Mail, Shield, User } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

const INVITES_COLLECTION = 'portal_invites';
const MEMBERS_COLLECTION = 'portal_members';
const USERS_COLLECTION = 'portal_users';

export default function InviteClient() {
  const { code } = useParams();
  const router = useRouter();
  const { user, userData, loading: authLoading, isAuthenticated } = usePortalAuth();
  const [invite, setInvite] = useState<Invite | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchInvite() {
      // Only run on client side
      if (typeof window === 'undefined') return;

      if (!code || typeof code !== 'string') {
        setError('Invalid invite code');
        setLoading(false);
        return;
      }

      try {
        const db = getFirestoreDb();
        const inviteRef = doc(db, INVITES_COLLECTION, code);
        const inviteSnap = await getDoc(inviteRef);

        if (!inviteSnap.exists()) {
          setError('Invite not found');
          setLoading(false);
          return;
        }

        const inviteData = {
          id: inviteSnap.id,
          ...inviteSnap.data(),
        } as Invite;

        setInvite(inviteData);

        if (inviteData.status !== 'pending') {
          setError(inviteData.status === 'accepted' ? 'This invite has already been accepted' : 'This invite has expired');
        } else if (inviteData.expiresAt.toDate() < new Date()) {
          // Update expired status if user is authenticated, otherwise just show error
          if (isAuthenticated) {
            try {
              await updateDoc(inviteRef, { status: 'expired' });
            } catch (err) {
              console.error('Error updating invite status:', err);
            }
          }
          setError('This invite has expired');
        }
      } catch (err: any) {
        console.error('Error fetching invite:', err);
        setError('Failed to load invite');
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchInvite();
    }
  }, [code, authLoading]);

  const handleAcceptInvite = async () => {
    if (!invite || !user || !userData) return;

    setAccepting(true);
    setError(null);

    try {
      const db = getFirestoreDb();
      const inviteRef = doc(db, INVITES_COLLECTION, invite.id);
      const inviteSnap = await getDoc(inviteRef);

      if (!inviteSnap.exists()) {
        throw new Error('Invite not found');
      }

      const currentInvite = inviteSnap.data() as Invite;

      if (currentInvite.status !== 'pending') {
        throw new Error('This invite has already been used');
      }

      if (currentInvite.expiresAt.toDate() < new Date()) {
        await updateDoc(inviteRef, { status: 'expired' });
        throw new Error('This invite has expired');
      }

      if (currentInvite.email.toLowerCase() !== user.email?.toLowerCase()) {
        throw new Error('This invite was sent to a different email address');
      }

      const memberData = {
        orgId: invite.orgId,
        userId: user.uid,
        email: invite.email,
        role: invite.role,
        name: userData.name || null,
        addedBy: invite.invitedBy,
        addedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, MEMBERS_COLLECTION, `${invite.orgId}_${user.uid}`), memberData);

      const userRef = doc(db, USERS_COLLECTION, user.uid);
      await updateDoc(userRef, {
        email: invite.email,
        name: userData.name || null,
        organizations: arrayUnion(invite.orgId),
        updatedAt: serverTimestamp(),
      });

      await updateDoc(inviteRef, {
        status: 'accepted',
        acceptedAt: serverTimestamp(),
      });

      setSuccess(true);
      setTimeout(() => {
        router.push(`/portal/org/${invite.orgId}/dashboard`);
      }, 2000);
    } catch (err: any) {
      console.error('Error accepting invite:', err);
      setError(err.message || 'Failed to accept invite');
    } finally {
      setAccepting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !invite) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <PortalCard className="max-w-md w-full">
          <div className="text-center space-y-4">
            <XCircle className="w-12 h-12 text-destructive mx-auto" />
            <h1 className="text-2xl font-bold">Invite Error</h1>
            <p className="text-muted-foreground">{error}</p>
            <Link href="/portal/login">
              <PortalButton>Go to Login</PortalButton>
            </Link>
          </div>
        </PortalCard>
      </div>
    );
  }

  if (!invite) {
    return null;
  }

  const isExpired = invite.expiresAt.toDate() < new Date();
  const isAccepted = invite.status === 'accepted';
  const emailMatch = user?.email?.toLowerCase() === invite.email.toLowerCase();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <PortalCard className="max-w-md w-full">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            {success ? (
              <>
                <CheckCircle2 className="w-12 h-12 text-success mx-auto" />
                <h1 className="text-2xl font-bold">Invite Accepted!</h1>
                <p className="text-muted-foreground">Redirecting you to the organization...</p>
              </>
            ) : isAccepted ? (
              <>
                <CheckCircle2 className="w-12 h-12 text-success mx-auto" />
                <h1 className="text-2xl font-bold">Already Accepted</h1>
                <p className="text-muted-foreground">This invite has already been accepted.</p>
              </>
            ) : isExpired ? (
              <>
                <XCircle className="w-12 h-12 text-destructive mx-auto" />
                <h1 className="text-2xl font-bold">Invite Expired</h1>
                <p className="text-muted-foreground">This invite has expired.</p>
              </>
            ) : (
              <>
                <Mail className="w-12 h-12 text-primary mx-auto" />
                <h1 className="text-2xl font-bold">You're Invited!</h1>
                <p className="text-muted-foreground">You've been invited to join an organization</p>
              </>
            )}
          </div>

          {!success && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Invited email:</span>
                  <span className="font-medium">{invite.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Role:</span>
                  <PortalBadge variant="gray">{invite.role}</PortalBadge>
                </div>
                {invite.invitedByName && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Invited by:</span>
                    <span className="font-medium">{invite.invitedByName}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Expires:</span>
                  <span className="font-medium">{format(invite.expiresAt.toDate(), 'PPp')}</span>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {!isAuthenticated ? (
                <div className="space-y-3">
                  <p className="text-sm text-slate-600 dark:text-slate-400 text-center font-medium">
                    To accept this invite, you need an account
                  </p>
                  <div className="space-y-2">
                    <Link href={`/portal/signup?email=${encodeURIComponent(invite.email)}&redirect=/portal/invite/${invite.id}`} className="block">
                      <PortalButton className="w-full shadow-lg shadow-blue-500/20">
                        Create Account
                      </PortalButton>
                    </Link>
                    <Link href={`/portal/login?redirect=/portal/invite/${invite.id}`} className="block">
                      <PortalButton variant="outline" className="w-full">
                        Sign In
                      </PortalButton>
                    </Link>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                    Already have an account? Click "Sign In" above
                  </p>
                </div>
              ) : !emailMatch ? (
                <div className="p-3 bg-warning/10 border border-warning/20 rounded-md">
                  <p className="text-sm text-warning">
                    This invite was sent to {invite.email}, but you're signed in as {user?.email}.
                    Please sign in with the correct email address.
                  </p>
                </div>
              ) : !isExpired && !isAccepted ? (
                <PortalButton
                  onClick={handleAcceptInvite}
                  disabled={accepting}
                  className="w-full"
                >
                  {accepting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Accepting...
                    </>
                  ) : (
                    'Accept Invite'
                  )}
                </PortalButton>
              ) : null}
            </div>
          )}
        </div>
      </PortalCard>
    </div>
  );
}
