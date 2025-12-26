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
  ShieldAlert,
  AlertCircle,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { PortalCard } from '@/components/portal/ui/PortalCard';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import { PortalBadge } from '@/components/portal/ui/PortalBadge';
import { cancelInvite, subscribeToMembers, subscribeToInvites } from '@/lib/services/portal-organizations';
import { OrganizationMember, Invite } from '@/lib/types/portal';
import { format } from 'date-fns';
import { InviteTeamMemberForm } from '@/components/portal/forms/InviteTeamMemberForm';
import { cn } from '@/lib/utils';

export default function TeamClient() {
  const { orgId } = useParams();
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [cancellingInvite, setCancellingInvite] = useState<string | null>(null);
  const [copiedInviteId, setCopiedInviteId] = useState<string | null>(null);

  const membersReceivedRef = useRef(false);
  const invitesReceivedRef = useRef(false);

  useEffect(() => {
    if (!orgId || typeof orgId !== 'string') return;

    setLoading(true);
    setError(null);
    membersReceivedRef.current = false;
    invitesReceivedRef.current = false;

    try {
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
    } catch (err) {
      console.error('Failed to subscribe to team data:', err);
      setError('Failed to load team information.');
      setLoading(false);
    }
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

  const copyInviteLink = (inviteId: string) => {
    const inviteLink = `${window.location.origin}/portal/invite/${inviteId}`;
    navigator.clipboard.writeText(inviteLink);
    setCopiedInviteId(inviteId);
    setTimeout(() => setCopiedInviteId(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-bold font-outfit uppercase tracking-widest text-xs">Gathering your team...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">Team Error</h2>
        <p className="text-slate-500 max-w-sm font-medium">{error}</p>
        <PortalButton onClick={() => window.location.reload()}>Retry</PortalButton>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-outfit">Team Members</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage collaborators and permissions for this organization.</p>
        </div>
        <PortalButton
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 shadow-lg shadow-blue-500/20 font-outfit"
        >
          <UserPlus size={18} />
          Invite Colleague
        </PortalButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Active Members</h3>
          <PortalCard noPadding className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden bg-white dark:bg-slate-950">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {members.map((member) => (
                <div key={member.id} className="p-5 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center font-bold text-blue-600 shadow-sm group-hover:scale-105 transition-transform">
                      {member.name ? member.name[0] : member.email[0].toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white leading-none mb-1.5 font-outfit">
                        {member.name || 'Anonymous User'}
                      </h4>
                      <p className="text-xs font-bold text-slate-400">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="hidden lg:flex flex-col items-end">
                      <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{member.role}</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Workspace Access</span>
                    </div>
                    <PortalBadge variant={member.role === 'owner' ? 'blue' : 'green'}>
                        {member.role === 'owner' ? 'PRIMARY' : 'ACTIVE'}
                    </PortalBadge>
                    <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </PortalCard>
        </div>

        <div className="space-y-6">
          <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Pending Invitations</h3>
          <PortalCard className="space-y-6 border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950">
            {invites.length > 0 ? (
              invites.map(invite => (
                <div key={invite.id} className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-white font-outfit">{invite.email}</p>
                      <p className="text-[9px] font-black text-slate-400 flex items-center gap-1.5 uppercase tracking-widest">
                        <Shield size={12} className="text-blue-500" /> {invite.role}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCancelInvite(invite.id)}
                      disabled={cancellingInvite === invite.id}
                      className="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-50 dark:hover:bg-rose-950/50 px-2.5 py-1.5 border border-rose-100 dark:border-rose-900/30 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {cancellingInvite === invite.id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        'Cancel'
                      )}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                    <span className="flex items-center gap-1.5 uppercase tracking-tighter">
                      <Clock size={12} className="text-slate-300" />
                      {invite.createdAt?.toDate ? `Sent ${format(invite.createdAt.toDate(), 'MMM d')}` : 'Recently'}
                    </span>
                    <button
                      onClick={() => copyInviteLink(invite.id)}
                      className={cn(
                        "flex items-center gap-1.5 uppercase tracking-widest transition-colors",
                        copiedInviteId === invite.id ? "text-emerald-500" : "text-blue-600 dark:text-blue-400 hover:underline"
                      )}
                    >
                      {copiedInviteId === invite.id ? (
                        <><CheckCircle2 size={12} /> COPIED</>
                      ) : (
                        <><Copy size={12} /> COPY LINK</>
                      )}
                    </button>
                  </div>
                  <div className="h-px bg-slate-100 dark:bg-slate-800 last:hidden" />
                </div>
              ))
            ) : (
              <div className="py-12 text-center bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                 <div className="w-12 h-12 bg-white dark:bg-slate-950 rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <Mail className="text-slate-300" size={20} />
                 </div>
                 <p className="text-sm font-bold text-slate-400 font-outfit uppercase tracking-widest">No pending invites</p>
                 <p className="text-xs text-slate-500 mt-1 max-w-[180px] mx-auto font-medium">Your team is fully active and synced up.</p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-900/20 mb-6">
                <p className="text-[11px] text-blue-600 dark:text-blue-400 leading-relaxed font-bold uppercase tracking-tight">
                  Team members will receive an email to join this workspace. They can only see requests within this organization.
                </p>
              </div>
              <PortalButton variant="outline" size="sm" className="w-full h-11 text-xs font-bold uppercase tracking-widest border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 font-outfit">
                Workspace Guide
              </PortalButton>
            </div>
          </PortalCard>

          <PortalCard className="bg-slate-900 border-none shadow-2xl relative overflow-hidden group">
             <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
             <div className="relative z-10">
               <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-sm text-white font-outfit">Seat Capacity</h4>
                  <ShieldAlert size={16} className="text-amber-500" />
               </div>
               <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-4 p-0.5">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000"
                    style={{ width: `${(members.length / 10) * 100}%` }}
                  />
               </div>
               <div className="flex items-center justify-between">
                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                   <span className="text-white">{members.length}</span> / 10 Active Seats
                 </p>
                 <button className="text-[10px] text-blue-400 font-black uppercase tracking-widest hover:text-blue-300 transition-colors">Upgrade</button>
               </div>
             </div>
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


