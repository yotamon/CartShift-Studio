'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import {
  UserPlus,
  Shield,
  Mail,
  MoreHorizontal,
  Clock,
  Loader2,
  ShieldAlert
} from 'lucide-react';
import { PortalCard } from '@/components/portal/ui/PortalCard';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import { PortalBadge } from '@/components/portal/ui/PortalBadge';
import { cancelInvite, subscribeToMembers, subscribeToInvites } from '@/lib/services/portal-organizations';
import { OrganizationMember, Invite } from '@/lib/types/portal';
import { format } from 'date-fns';
import { InviteTeamMemberForm } from '@/components/portal/forms/InviteTeamMemberForm';

export default function TeamClient() {
  const { orgId } = useParams();
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [cancellingInvite, setCancellingInvite] = useState<string | null>(null);

  const membersReceivedRef = useRef(false);
  const invitesReceivedRef = useRef(false);

  useEffect(() => {
    if (!orgId || typeof orgId !== 'string') return;

    setLoading(true);
    membersReceivedRef.current = false;
    invitesReceivedRef.current = false;

    const unsubscribeMembers = subscribeToMembers(orgId, (data) => {
      setMembers(data);
      membersReceivedRef.current = true;
      if (membersReceivedRef.current && invitesReceivedRef.current) {
        setLoading(false);
      }
    });

    const unsubscribeInvites = subscribeToInvites(orgId, (data) => {
      setInvites(data);
      invitesReceivedRef.current = true;
      if (membersReceivedRef.current && invitesReceivedRef.current) {
        setLoading(false);
      }
    });

    return () => {
      unsubscribeMembers();
      unsubscribeInvites();
    };
  }, [orgId]);

  const handleInviteSuccess = async () => {
    setShowInviteModal(false);
  };

  const handleCancelInvite = async (inviteId: string) => {
    if (!confirm('Are you sure you want to cancel this invitation?')) return;

    setCancellingInvite(inviteId);
    try {
      await cancelInvite(inviteId);
    } catch (error) {
      console.error('Error cancelling invite:', error);
      alert('Failed to cancel invite');
    } finally {
      setCancellingInvite(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">Gathering your team...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Team Members</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage collaborators and permissions for this organization.</p>
        </div>
        <PortalButton
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <UserPlus size={18} />
          Invite Colleague
        </PortalButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white px-1">Active Members</h3>
          <PortalCard noPadding className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {members.map((member) => (
                <div key={member.id} className="p-5 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-blue-600 shadow-sm">
                      {member.name ? member.name[0] : member.email[0].toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white leading-none mb-1">
                        {member.name || 'Anonymous User'}
                      </h4>
                      <p className="text-xs font-semibold text-slate-400">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="hidden lg:flex flex-col items-end">
                      <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{member.role}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Workspace Access</span>
                    </div>
                    <PortalBadge variant="green">
                        {member.role === 'owner' ? 'PRIMARY' : 'ACTIVE'}
                    </PortalBadge>
                    <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </PortalCard>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white px-1">Pending Invitations</h3>
          <PortalCard className="space-y-6 border-slate-200 dark:border-slate-800 shadow-sm">
            {invites.length > 0 ? (
              invites.map(invite => (
                <div key={invite.id} className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{invite.email}</p>
                      <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                        <Shield size={12} className="text-blue-500" /> {invite.role}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCancelInvite(invite.id)}
                      disabled={cancellingInvite === invite.id}
                      className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline px-2 py-1 bg-rose-50 dark:bg-rose-950/30 rounded-md disabled:opacity-50"
                    >
                      {cancellingInvite === invite.id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <>Cancel</>
                      )}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                    <span className="flex items-center gap-1 uppercase">
                      <Clock size={12} />
                      {invite.createdAt?.toDate ? `Sent ${format(invite.createdAt.toDate(), 'MMM d')}` : 'Recently'}
                    </span>
                    <button
                      onClick={() => {
                        const inviteLink = `${window.location.origin}/portal/invite/${invite.id}`;
                        navigator.clipboard.writeText(inviteLink);
                        alert('Invite link copied! Share it with your colleague.');
                      }}
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      COPY INVITE LINK
                    </button>
                  </div>
                  <div className="h-px bg-slate-100 dark:bg-slate-800 last:hidden" />
                </div>
              ))
            ) : (
              <div className="py-8 text-center bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                 <Mail className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                 <p className="text-sm font-bold text-slate-400">No pending invites</p>
                 <p className="text-xs text-slate-500 mt-1 max-w-[180px] mx-auto">Your team is fully active and synced up.</p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[11px] text-slate-500 mb-6 leading-relaxed font-medium">
                Team members will receive an email to join this organization. They will only have access to requests within this specific workspace.
              </p>
              <PortalButton variant="outline" size="sm" className="w-full h-10 text-xs font-bold uppercase tracking-widest bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30">
                Share Workspace Link
              </PortalButton>
            </div>
          </PortalCard>

          <PortalCard className="bg-slate-900 border-none shadow-xl">
             <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-sm text-white">License Usage</h4>
                <ShieldAlert size={16} className="text-amber-500" />
             </div>
             <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
                <div className="bg-blue-500 h-full w-[60%] shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
             </div>
             <p className="text-xs text-slate-400 font-medium">
               Using <span className="text-white font-bold">{members.length} of 5</span> available seats.
               <button className="text-blue-400 font-bold hover:underline ml-1">Add seats</button>
             </p>
          </PortalCard>
        </div>
      </div>

      {showInviteModal && orgId && typeof orgId === 'string' && (
        <InviteTeamMemberForm
          orgId={orgId}
          onSuccess={handleInviteSuccess}
          onCancel={() => setShowInviteModal(false)}
        />
      )}
    </div>
  );
}

