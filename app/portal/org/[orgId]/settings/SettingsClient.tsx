'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PortalCard } from '@/components/portal/ui/PortalCard';
import { PortalInput } from '@/components/portal/ui/PortalInput';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import { PortalBadge } from '@/components/portal/ui/PortalBadge';
import { User, Bell, Shield, CreditCard, Save, Loader2, Trash2, Plus, CheckCircle2, ShieldCheck } from 'lucide-react';
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

  const handleSave = async () => {
    if (!orgId || typeof orgId !== 'string') return;

    // Check if we're using the default placeholder org
    if (orgId === 'default-org') {
      alert(
        'Default Organization Notice:\n\n' +
        'You are viewing a placeholder organization. To save settings:\n\n' +
        '1. Create a real organization by signing up\n' +
        '2. Or create an organization manually in Firestore\n\n' +
        'The "default-org" is just for preview purposes and cannot be modified.'
      );
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
      alert('Settings saved successfully!');
    } catch (error: any) {
      console.error('Error saving settings:', error);

      // Provide helpful error message based on error type
      if (error.code === 'not-found' || error.message?.includes('No document to update')) {
        alert(
          'Organization Not Found\n\n' +
          `The organization "${orgId}" does not exist in the database yet.\n\n` +
          'Please create the organization first before updating its settings.'
        );
      } else if (error.code === 'permission-denied') {
        alert('Permission denied. You do not have access to update this organization.');
      } else {
        alert(`Failed to save settings: ${error.message || 'Unknown error'}`);
      }
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
      alert('Failed to send reset email. Please try again.');
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your organization and workspace preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-colors',
                  activeTab === tab.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                )}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'general' && (
            <>
              <PortalCard className="border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Organization Profile</h3>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <PortalInput
                      label="Organization Name"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your Organization Name"
                    />
                    <PortalInput
                      label="Industry"
                      value={formData.industry}
                      onChange={e => setFormData({ ...formData, industry: e.target.value })}
                      placeholder="e.g. E-commerce, SaaS, Marketing"
                    />
                  </div>
                  <PortalInput
                    label="Website URL"
                    type="url"
                    value={formData.website}
                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://yourwebsite.com"
                  />
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Business Description
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={e => setFormData({ ...formData, bio: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-white/10 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none text-surface-900 dark:text-white"
                      placeholder="Tell us about your business..."
                    />
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                  <PortalButton
                    onClick={handleSave}
                    isLoading={saving}
                    className="flex items-center gap-2 shadow-lg shadow-blue-500/20"
                  >
                    <Save size={18} />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </PortalButton>
                </div>
              </PortalCard>

              <PortalCard className="border-red-200 dark:border-red-900/20 bg-red-50/50 dark:bg-red-900/5 shadow-sm">
                <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                  <Trash2 size={20} />
                  Danger Zone
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 font-medium leading-relaxed">
                  Once you delete your organization, there is no going back. All data, requests, files, and team members will be permanently removed. Please be certain.
                </p>
                <PortalButton variant="danger" size="sm" className="shadow-lg shadow-red-500/20">
                  Delete Organization
                </PortalButton>
              </PortalCard>

              <PortalCard className="border-emerald-200 dark:border-emerald-900/20 bg-emerald-50/50 dark:bg-emerald-900/5 shadow-sm">
                <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-2">
                  <Plus size={20} />
                  Create New Organization
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 font-medium leading-relaxed">
                  Need another workspace? Create a new organization for a different team or project. You'll be the owner and can invite members separately.
                </p>
                <PortalButton
                  onClick={() => setShowCreateOrgModal(true)}
                  className="shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus size={18} />
                  Create Organization
                </PortalButton>
              </PortalCard>
            </>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <PortalCard className="border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                    <Bell size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Email Notifications</h3>
                    <p className="text-xs font-medium text-slate-500">Choose when you want to receive emails from us.</p>
                  </div>
                </div>

                <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
                  <PortalSwitch
                    label="Request Updates"
                    description="Receive an email when a request status changes or is updated."
                    checked={notificationPrefs.emailOnRequestUpdate}
                    onChange={(checked) => handleSaveNotificationPrefs({...notificationPrefs, emailOnRequestUpdate: checked})}
                  />
                  <div className="pt-4">
                    <PortalSwitch
                      label="New Comments"
                      description="Get notified when a specialist or team member leaves a comment."
                      checked={notificationPrefs.emailOnNewComment}
                      onChange={(checked) => handleSaveNotificationPrefs({...notificationPrefs, emailOnNewComment: checked})}
                    />
                  </div>
                  <div className="pt-4">
                    <PortalSwitch
                      label="Status Milestone"
                      description="Special alerts when requests reach 'Delivered' or 'Completed' status."
                      checked={notificationPrefs.emailOnStatusChange}
                      onChange={(checked) => handleSaveNotificationPrefs({...notificationPrefs, emailOnStatusChange: checked})}
                    />
                  </div>
                  <div className="pt-4">
                    <PortalSwitch
                      label="Marketing & Tips"
                      description="Occasional emails with design tips, case studies, and studio news."
                      checked={notificationPrefs.marketingEmails}
                      onChange={(checked) => handleSaveNotificationPrefs({...notificationPrefs, marketingEmails: checked})}
                    />
                  </div>
                </div>

                {notifSaving && (
                  <div className="mt-6 flex items-center gap-2 text-xs font-bold text-blue-600 animate-pulse">
                    <Loader2 size={12} className="animate-spin" />
                    SAVING PREFERENCES...
                  </div>
                )}
              </PortalCard>

              <PortalCard className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-center py-8">
                 <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                   Looking for push notifications? We're working on mobile and browser alerts. Stay tuned!
                 </p>
              </PortalCard>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <PortalCard className="border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Security & Access</h3>
                    <p className="text-xs font-medium text-slate-500">Manage how you access your account.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">Update Password</h4>
                      <p className="text-xs text-slate-500 mt-1">We'll send you a secure link to change your password.</p>
                    </div>
                    <PortalButton
                      variant="outline"
                      size="sm"
                      onClick={handlePasswordReset}
                      disabled={resetSent}
                      className={cn(resetSent && "text-emerald-500 border-emerald-500 hover:bg-emerald-50")}
                    >
                      {resetSent ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={16} /> Link Sent
                        </div>
                      ) : "Reset via Email"}
                    </PortalButton>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 opacity-60">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">Two-Factor Authentication</h4>
                      <p className="text-xs text-slate-500 mt-1">Add an extra layer of security to your account.</p>
                    </div>
                    <PortalBadge variant="gray">Coming Soon</PortalBadge>
                  </div>
                </div>
              </PortalCard>

              <PortalCard className="border-slate-200 dark:border-slate-800 shadow-sm">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Account Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                     <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.email}</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Auth Provider</p>
                     <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">{user?.providerData[0]?.providerId.split('.')[0] || 'Email'}</p>
                   </div>
                </div>
              </PortalCard>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <PortalCard className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-0">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <PortalBadge className="bg-white/20 text-white border-white/20 uppercase font-black tracking-widest text-[10px]">Active Plan</PortalBadge>
                    <span className="text-xs font-bold text-blue-100 uppercase tracking-widest">Client Pro</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">Premium Unlimited</h3>
                  <p className="text-sm text-blue-100/80">Next billing date: January 15, 2026</p>
                </div>

                <div className="p-6 space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Cost</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">$2,499.00</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Requests</p>
                        <p className="text-lg font-bold text-emerald-500">Unlimited</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Seats</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">Up to 10</p>
                      </div>
                   </div>

                   <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-4">
                      <PortalButton size="sm" className="flex items-center gap-2">
                        <CreditCard size={16} /> Manage Billing
                      </PortalButton>
                      <PortalButton variant="outline" size="sm" className="flex items-center gap-2">
                        View Past Invoices
                      </PortalButton>
                   </div>
                </div>
              </PortalCard>

              <PortalCard className="border-blue-100 dark:border-blue-900/20 bg-blue-50/30 dark:bg-blue-900/5 shadow-sm">
                 <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 mt-1">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">Secure Billing</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        All payments are processed securely through Stripe. Your card information never touches our servers. We use 256-bit SSL encryption to protect your data.
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
