'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PortalCard } from '@/components/portal/ui/PortalCard';
import { PortalInput } from '@/components/portal/ui/PortalInput';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import { PortalBadge } from '@/components/portal/ui/PortalBadge';
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Save,
  Loader2,
  Trash2,
  Plus,
  CheckCircle2,
  ShieldCheck,
  Globe,
  Building2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getOrganization, updateOrganization } from '@/lib/services/portal-organizations';
import { updatePortalUser } from '@/lib/services/portal-users';
import { resetPassword } from '@/lib/services/auth';
import { CreateOrganizationForm } from '@/components/portal/forms/CreateOrganizationForm';
import { useRouter } from 'next/navigation';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';
import { PortalSwitch } from '@/components/portal/ui/PortalSwitch';

export default function SettingsClient() {
  const { orgId } = useParams();
  const router = useRouter();
  const { user, userData } = usePortalAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [showCreateOrgModal, setShowCreateOrgModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    website: '',
    industry: '',
    bio: '',
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    emailOnRequestUpdate: true,
    emailOnNewComment: true,
    emailOnStatusChange: true,
    marketingEmails: false,
  });

  const [notifSaving, setNotifSaving] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    async function fetchOrganization() {
      if (!orgId || typeof orgId !== 'string') return;

      setLoading(true);
      try {
        const org = await getOrganization(orgId);
        if (org) {
          setFormData({
            name: org.name || '',
            website: org.website || '',
            industry: org.industry || '',
            bio: org.bio || '',
          });
        }
      } catch (error) {
        console.error('Error fetching organization:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrganization();

    if (userData?.notificationPreferences) {
      setNotificationPrefs({
        emailOnRequestUpdate: userData.notificationPreferences.emailOnRequestUpdate ?? true,
        emailOnNewComment: userData.notificationPreferences.emailOnNewComment ?? true,
        emailOnStatusChange: userData.notificationPreferences.emailOnStatusChange ?? true,
        marketingEmails: userData.notificationPreferences.marketingEmails ?? false,
      });
    }
  }, [orgId, userData]);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    if (type === 'success') {
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(null), 5000);
    } else {
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const handleSave = async () => {
    if (!orgId || typeof orgId !== 'string') return;

    if (orgId === 'default-org') {
      showFeedback('error', 'Default organization cannot be modified.');
      return;
    }

    setSaving(true);
    try {
      await updateOrganization(orgId, {
        name: formData.name,
        website: formData.website,
        industry: formData.industry,
        bio: formData.bio,
      });
      showFeedback('success', 'Profile updated successfully!');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      showFeedback('error', error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotificationPrefs = async (newPrefs: typeof notificationPrefs) => {
    if (!user) return;
    setNotifSaving(true);
    try {
      await updatePortalUser(user.uid, { notificationPreferences: newPrefs });
      setNotificationPrefs(newPrefs);
    } catch (error) {
      console.error('Error saving notification preferences:', error);
    } finally {
      setNotifSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    try {
      await resetPassword(user.email);
      setResetSent(true);
      setTimeout(() => setResetSent(false), 5000);
    } catch (error) {
      console.error('Error sending reset email:', error);
      showFeedback('error', 'Failed to send reset email.');
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-bold font-outfit uppercase tracking-widest text-xs">Loading preferences...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-outfit">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage your organization and workspace preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <nav className="space-y-1.5 sticky top-24">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-2xl transition-all font-outfit',
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 translate-x-1'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="lg:col-span-3 space-y-6">
          {/* Notifications */}
          {successMessage && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl flex items-center gap-3 text-emerald-600 dark:text-emerald-400 text-sm font-bold animate-in slide-in-from-top-2 duration-300">
              <CheckCircle2 size={18} />
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl flex items-center gap-3 text-rose-600 dark:text-rose-400 text-sm font-bold animate-in slide-in-from-top-2 duration-300">
              <AlertCircle size={18} />
              {errorMessage}
            </div>
          )}

          {activeTab === 'general' && (
            <div className="space-y-8">
              <PortalCard className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-outfit">Organization Profile</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Basic info & Appearance</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PortalInput
                      label="Organization Name"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Acme Corp"
                      icon={<Building2 size={16} />}
                    />
                    <PortalInput
                      label="Industry / Niche"
                      value={formData.industry}
                      onChange={e => setFormData({ ...formData, industry: e.target.value })}
                      placeholder="e.g. Technology, SaaS"
                    />
                  </div>
                  <PortalInput
                    label="Business Website"
                    type="url"
                    value={formData.website}
                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://acme.com"
                    icon={<Globe size={16} />}
                  />
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2.5">
                      Business Overview
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={e => setFormData({ ...formData, bio: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none text-slate-900 dark:text-white text-sm font-medium leading-relaxed"
                      placeholder="Give us a brief context about what you do..."
                    />
                  </div>
                </div>
                <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <PortalButton
                    onClick={handleSave}
                    isLoading={saving}
                    className="flex items-center gap-2 shadow-xl shadow-blue-500/20 font-outfit px-8"
                  >
                    <Save size={18} />
                    {saving ? 'Processing...' : 'Save Profile'}
                  </PortalButton>
                </div>
              </PortalCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PortalCard className="border-emerald-200 dark:border-emerald-900/20 bg-emerald-50/20 dark:bg-emerald-900/5 shadow-sm">
                  <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-2 font-outfit">
                    <Plus size={20} />
                    New Workspace
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium leading-relaxed">
                    Need another workspace? Create a separate organization for a different team.
                  </p>
                  <PortalButton
                    onClick={() => setShowCreateOrgModal(true)}
                    className="w-full shadow-lg shadow-emerald-500/10 bg-emerald-600 hover:bg-emerald-700 font-outfit"
                  >
                    <Plus size={18} className="mr-2" />
                    Create Organization
                  </PortalButton>
                </PortalCard>

                <PortalCard className="border-rose-200 dark:border-rose-900/20 bg-rose-50/20 dark:bg-rose-900/5 shadow-sm">
                  <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-2 font-outfit">
                    <Trash2 size={20} />
                    Danger Zone
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium leading-relaxed">
                    Permanently delete this organization and all its data. This cannot be undone.
                  </p>
                  <PortalButton variant="danger" size="sm" className="w-full shadow-lg shadow-rose-500/10 font-outfit">
                    Delete Workspace
                  </PortalButton>
                </PortalCard>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <PortalCard className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950">
                <div className="flex items-center gap-3 mb-10">
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 border border-blue-100 dark:border-blue-900/30">
                    <Bell size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-outfit">Channels & Alerts</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Email Delivery Settings</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <PortalSwitch
                    label="Request Milestone Updates"
                    description="Notifications for every movement in your project's lifecycle."
                    checked={notificationPrefs.emailOnRequestUpdate}
                    onChange={(checked) => handleSaveNotificationPrefs({...notificationPrefs, emailOnRequestUpdate: checked})}
                  />
                  <div className="h-px bg-slate-50 dark:bg-slate-900" />
                  <PortalSwitch
                    label="Real-time Comment Alerts"
                    description="Stay in the loop when specialists or team members engage."
                    checked={notificationPrefs.emailOnNewComment}
                    onChange={(checked) => handleSaveNotificationPrefs({...notificationPrefs, emailOnNewComment: checked})}
                  />
                   <div className="h-px bg-slate-50 dark:bg-slate-900" />
                  <PortalSwitch
                    label="Direct Delivery Status"
                    description="High-priority alerts for 'Delivered' and 'In Review' statuses."
                    checked={notificationPrefs.emailOnStatusChange}
                    onChange={(checked) => handleSaveNotificationPrefs({...notificationPrefs, emailOnStatusChange: checked})}
                  />
                   <div className="h-px bg-slate-50 dark:bg-slate-900" />
                  <PortalSwitch
                    label="Product & Design News"
                    description="Occasional insights from our studio on scaling your business."
                    checked={notificationPrefs.marketingEmails}
                    onChange={(checked) => handleSaveNotificationPrefs({...notificationPrefs, marketingEmails: checked})}
                  />
                </div>

                <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800">
                    {notifSaving ? (
                      <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 animate-pulse tracking-widest uppercase">
                        <Loader2 size={12} className="animate-spin" />
                        Syncing changes...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 tracking-widest uppercase">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        Settings are live
                      </div>
                    )}
                </div>
              </PortalCard>

              <PortalCard className="bg-slate-50/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 text-center py-10 rounded-3xl">
                 <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 max-w-sm mx-auto uppercase tracking-widest leading-relaxed">
                   Looking for browser push notifications? <br/>
                   <span className="text-blue-500 mt-2 block">Beta testing starting early 2026</span>
                 </p>
              </PortalCard>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <PortalCard className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950">
                <div className="flex items-center gap-3 mb-10">
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 border border-amber-100 dark:border-amber-900/30">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-outfit">Security Layer</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Control your access</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 group hover:border-blue-200 dark:hover:border-blue-900/30 transition-colors">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 dark:text-white text-base font-outfit">Change Password</h4>
                      <p className="text-xs font-medium text-slate-500 leading-relaxed">Reset your password via a secure verification link sent to your email.</p>
                    </div>
                    <PortalButton
                      variant="outline"
                      size="sm"
                      onClick={handlePasswordReset}
                      disabled={resetSent}
                      className={cn(
                        "font-outfit whitespace-nowrap px-6",
                        resetSent && "text-emerald-500 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                      )}
                    >
                      {resetSent ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={16} /> Link Dispatched
                        </div>
                      ) : "Request Reset Link"}
                    </PortalButton>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl bg-slate-50/50 dark:bg-slate-900/20 border border-slate-100/50 dark:border-slate-800/50 opacity-60">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 dark:text-white text-base font-outfit">Multi-Factor Auth (MFA)</h4>
                      <p className="text-xs font-medium text-slate-500 leading-relaxed">Add a mobile authenticator app for ultimate account protection.</p>
                    </div>
                    <PortalBadge variant="gray" className="font-black uppercase tracking-widest text-[9px]">Pipeline 2026</PortalBadge>
                  </div>
                </div>
              </PortalCard>

              <PortalCard className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-1">Active Session Info</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-1">
                   <div>
                     <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5">Email Identifier</p>
                     <p className="text-sm font-bold text-slate-900 dark:text-white font-outfit">{user?.email}</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5">Identity Provider</p>
                     <p className="text-sm font-bold text-slate-900 dark:text-white capitalize font-outfit flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        {user?.providerData[0]?.providerId.split('.')[0] || 'Mail Service'}
                     </p>
                   </div>
                </div>
              </PortalCard>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <PortalCard className="border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-0 bg-white dark:bg-slate-950">
                <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 text-white relative">
                  <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <PortalBadge className="bg-white/20 text-white border-white/20 uppercase font-black tracking-widest text-[9px] px-3">Priority Ecosystem</PortalBadge>
                      <span className="text-[10px] font-black text-blue-100 uppercase tracking-widest bg-blue-500/30 px-3 py-1 rounded-full">Pro Status</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-1 font-outfit">Premium Subscription</h3>
                    <p className="text-sm text-blue-100/70 font-medium font-outfit">Next payment cycle cycles on Jan 15, 2026</p>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Investment</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white font-outfit tracking-tight">$2,499<span className="text-sm font-medium opacity-40">/mo</span></p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Workflow limit</p>
                        <p className="text-2xl font-bold text-emerald-500 font-outfit flex items-center gap-2">
                           Unlimited
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Availability</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white font-outfit tracking-tight">10 Seats</p>
                      </div>
                   </div>

                   <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-4">
                      <PortalButton className="flex items-center gap-2 font-outfit px-8 shadow-xl shadow-blue-500/10 h-11">
                        <CreditCard size={18} /> Stripe Dashboard
                      </PortalButton>
                      <PortalButton variant="outline" className="flex items-center gap-2 font-outfit px-8 border-slate-200 dark:border-slate-800 h-11">
                        Invoicing History
                      </PortalButton>
                   </div>
                </div>
              </PortalCard>

              <PortalCard className="border-blue-100 dark:border-blue-900/20 bg-blue-50/20 dark:bg-blue-900/5 shadow-sm rounded-3xl">
                 <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 border border-blue-200/50 dark:border-blue-900/30">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1.5 font-outfit">Encrypted Billing Pipeline</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                        Transactions are handled exclusively via Stripe's certified PCI Level 1 infrastructure. Your financial signatures never leave the Stripe ecosystem.
                      </p>
                    </div>
                 </div>
              </PortalCard>
            </div>
          )}
        </div>
      </div>

      {showCreateOrgModal && (
        <CreateOrganizationForm
          onSuccess={(newOrgId) => {
            setShowCreateOrgModal(false);
            router.push(`/portal/org/${newOrgId}/dashboard`);
          }}
          onCancel={() => setShowCreateOrgModal(false)}
        />
      )}
    </div>
  );
}

