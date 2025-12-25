'use client';

import { useState, useEffect } from 'react';
import { PortalCard } from '@/components/portal/ui/PortalCard';
import { PortalInput } from '@/components/portal/ui/PortalInput';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import { User, Shield, CreditCard, Save, Settings2, Building2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/services/firebase-client';

interface AgencyProfile {
  name: string;
  email: string;
  website: string;
  phone?: string;
  description?: string;
}

export default function AgencySettingsClient() {
  const { user } = usePortalAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<AgencyProfile>({
    name: '',
    email: '',
    website: '',
    phone: '',
    description: '',
  });

  useEffect(() => {
    async function fetchAgencyProfile() {
      if (!user?.uid) return;

      setLoading(true);
      try {
        const agencyDoc = await getDoc(doc(db, 'agencies', user.uid));
        if (agencyDoc.exists()) {
          const data = agencyDoc.data();
          setProfile({
            name: data.name || '',
            email: data.email || '',
            website: data.website || '',
            phone: data.phone || '',
            description: data.description || '',
          });
        }
      } catch (error) {
        console.error('Error fetching agency profile:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAgencyProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user?.uid) return;

    setSaving(true);
    try {
      await updateDoc(doc(db, 'agencies', user.uid), {
        name: profile.name,
        email: profile.email,
        website: profile.website,
        phone: profile.phone,
        description: profile.description,
        updatedAt: new Date(),
      });
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving agency profile:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Agency Profile', icon: Building2 },
    { id: 'services', label: 'Service Packages', icon: Settings2 },
    { id: 'team', label: 'Internal Team', icon: User },
    { id: 'integrations', label: 'Integrations', icon: Shield },
    { id: 'billing', label: 'Payouts', icon: CreditCard },
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
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Agency Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage global agency configurations and team defaults.
        </p>
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
          {activeTab === 'profile' && (
            <PortalCard className="border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                Agency Profile
              </h3>
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <PortalInput
                    label="Agency Name"
                    value={profile.name}
                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Your Agency Name"
                  />
                  <PortalInput
                    label="Support Email"
                    type="email"
                    value={profile.email}
                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                    placeholder="support@agency.com"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <PortalInput
                    label="Agency Website"
                    type="url"
                    value={profile.website}
                    onChange={e => setProfile({ ...profile, website: e.target.value })}
                    placeholder="https://agency.com"
                  />
                  <PortalInput
                    label="Phone Number"
                    type="tel"
                    value={profile.phone}
                    onChange={e => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Agency Description
                  </label>
                  <textarea
                    value={profile.description}
                    onChange={e => setProfile({ ...profile, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-white/10 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none text-surface-900 dark:text-white"
                    placeholder="Brief description of your agency and services..."
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
          )}

          {activeTab === 'services' && (
            <PortalCard className="border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Service Packages
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Configure your service offerings and pricing tiers.
              </p>
              <div className="py-12 text-center">
                <Settings2 className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">Service configuration coming soon</p>
              </div>
            </PortalCard>
          )}

          {activeTab === 'team' && (
            <PortalCard className="border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Internal Team
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Manage your agency team members and permissions.
              </p>
              <div className="py-12 text-center">
                <User className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">Team management coming soon</p>
              </div>
            </PortalCard>
          )}

          {activeTab === 'integrations' && (
            <PortalCard className="border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Integrations
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Connect third-party tools and services.
              </p>
              <div className="py-12 text-center">
                <Shield className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">Integrations coming soon</p>
              </div>
            </PortalCard>
          )}

          {activeTab === 'billing' && (
            <PortalCard className="border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Payouts & Billing
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Configure payment methods and billing information.
              </p>
              <div className="py-12 text-center">
                <CreditCard className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">Billing configuration coming soon</p>
              </div>
            </PortalCard>
          )}
        </div>
      </div>
    </div>
  );
}
