'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PortalCard } from '@/components/portal/ui/PortalCard';
import { PortalInput } from '@/components/portal/ui/PortalInput';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import {
  Shield,
  CreditCard,
  Save,
  Settings2,
  Building2,
  Loader2,
  Camera,
  User as UserIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, getFirebaseAuth } from '@/lib/firebase';
import { getAgencyTeam } from '@/lib/services/portal-agency';
import { updatePortalUser } from '@/lib/services/portal-users';
import { getFirebaseStorage, waitForAuth } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { PortalUser, Invite } from '@/lib/types/portal';
import { subscribeToAgencyInvites, cancelInvite } from '@/lib/services/portal-organizations';
import { useTranslations } from 'next-intl';
import { PortalAvatar } from '@/components/portal/ui/PortalAvatar';
import { InviteTeamMemberForm } from '@/components/portal/forms/InviteTeamMemberForm';
import { ManageServiceForm } from '@/components/portal/forms/ManageServiceForm';
import { subscribeToServices, deleteService } from '@/lib/services/portal-services';
import { Service, formatCurrency } from '@/lib/types/portal';
import { Plus, Edit2, Trash2, Tag, MessageSquare, Zap } from 'lucide-react';
import {
  GoogleCalendarIntegration,
  IntegrationCard,
  CalendarConnection,
} from '@/components/portal/integrations';
import {
  initiateGoogleOAuth,
  getCalendarConnection,
  disconnectCalendar,
  isGoogleCalendarConfigured,
} from '@/lib/services/portal-google-calendar';

interface AgencyProfile {
  name: string;
  email: string;
  website: string;
  phone?: string;
  description?: string;
}

export default function AgencySettingsClient() {
  const t = useTranslations('portal');
  const { user } = usePortalAuth();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const validTabs = ['profile', 'team', 'services', 'integrations', 'billing'];
  const initialTab = tabFromUrl && validTabs.includes(tabFromUrl) ? tabFromUrl : 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<AgencyProfile>({
    name: '',
    email: '',
    website: '',
    phone: '',
    description: '',
  });
  const [team, setTeam] = useState<PortalUser[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | undefined>(undefined);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [calendarConnection, setCalendarConnection] = useState<CalendarConnection | null>(null);
  const [cancellingInvite, setCancellingInvite] = useState<string | null>(null);
  const [profileFormData, setProfileFormData] = useState({
    name: '',
    photoUrl: '',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Sync activeTab with URL parameter when it changes
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && validTabs.includes(tabFromUrl) && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

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

    if (user) {
      setProfileFormData({
        name: user.displayName || '',
        photoUrl: user.photoURL || '',
      });
    }
  }, [user]);

  useEffect(() => {
    let mounted = true;
    let unsubscribeInvites: (() => void) | undefined;
    let unsubscribeServices: (() => void) | undefined;

    if (activeTab === 'team') {
      const fetchTeam = async () => {
        if (mounted) {
          setLoadingTeam(true);
        }
        try {
          const members = await getAgencyTeam();
          if (mounted) {
            setTeam(members);
          }
        } catch (error) {
          console.error('Error fetching agency team:', error);
        } finally {
          if (mounted) {
            setLoadingTeam(false);
          }
        }
      };

      fetchTeam();

      unsubscribeInvites = subscribeToAgencyInvites(data => {
        if (mounted) {
          setInvites(data);
        }
      });
    }

    if (activeTab === 'services') {
      if (mounted) {
        setLoadingServices(true);
      }
      unsubscribeServices = subscribeToServices(data => {
        if (mounted) {
          setServices(data);
          setLoadingServices(false);
        }
      });
    }

    if (activeTab === 'integrations') {
      getCalendarConnection().then(connection => {
        if (mounted) {
          setCalendarConnection(connection);
        }
      });
    }

    return () => {
      mounted = false;
      if (unsubscribeInvites) unsubscribeInvites();
      if (unsubscribeServices) unsubscribeServices();
    };
  }, [activeTab]);

  const handleCancelInvite = async (inviteId: string) => {
    if (!confirm(t('portal.common.confirm'))) return;
    setCancellingInvite(inviteId);
    try {
      await cancelInvite(inviteId);
    } catch (error) {
      console.error('Error cancelling invite:', error);
    } finally {
      setCancellingInvite(null);
    }
  };

  const handleSave = async () => {
    if (!user?.uid) return;

    setSaving(true);
    try {
      const auth = getFirebaseAuth();
      const currentUser = auth.currentUser;

      if (!currentUser || !currentUser.uid) {
        throw new Error(t('portal.common.userNotAuthenticated'));
      }

      const userId = currentUser.uid;

      if (userId !== user.uid) {
        console.warn('UID mismatch:', { hookUid: user.uid, authUid: userId });
      }

      const token = await currentUser.getIdToken(true);
      if (!token) {
        throw new Error(t('portal.common.failedToGetAuthToken'));
      }

      console.log('Saving agency profile:', { userId, agencyId: userId });

      const agencyRef = doc(db, 'agencies', userId);
      const agencyDoc = await getDoc(agencyRef);

      const data = {
        name: profile.name,
        email: profile.email,
        website: profile.website,
        phone: profile.phone,
        description: profile.description,
        updatedAt: serverTimestamp(),
      };

      if (agencyDoc.exists()) {
        await updateDoc(agencyRef, data);
      } else {
        await setDoc(agencyRef, {
          ...data,
          createdAt: serverTimestamp(),
        });
      }
      alert(t('agency.settings.profile.success'));
    } catch (error) {
      console.error('Error saving agency profile:', error);
      const errorMessage = error instanceof Error ? error.message : t('portal.common.unknownError');
      alert(`Failed to save settings: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  const handleServiceSuccess = () => {
    setIsServiceModalOpen(false);
    setEditingService(undefined);
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm(t('portal.common.confirm'))) return;
    try {
      await deleteService(serviceId);
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleInviteSuccess = () => {
    setIsInviteModalOpen(false);
    // Refresh team if we are on team tab
    if (activeTab === 'team') {
      const fetchTeam = async () => {
        setLoadingTeam(true);
        try {
          const members = await getAgencyTeam();
          setTeam(members);
        } catch (error) {
          console.error('Error refreshing agency team:', error);
        } finally {
          setLoadingTeam(false);
        }
      };
      fetchTeam();
    }
  };

  const tabs = [
    { id: 'profile', label: t('agency.settings.tabs.profile'), icon: Building2 },
    { id: 'user-profile', label: t('settings.tabs.profile'), icon: UserIcon },
    { id: 'services', label: t('agency.settings.tabs.services'), icon: Settings2 },
    { id: 'team', label: t('agency.settings.tabs.team'), icon: UserIcon },
    { id: 'integrations', label: t('agency.settings.tabs.integrations'), icon: Shield },
    { id: 'billing', label: t('agency.settings.tabs.billing'), icon: CreditCard },
  ];

  const handleProfileSave = async () => {
    if (!user) return;
    setProfileSaving(true);
    try {
      await updatePortalUser(user.uid, {
        name: profileFormData.name,
        photoUrl: profileFormData.photoUrl,
      });
      alert(t('settings.profile.success'));
    } catch (error) {
      console.error('Error saving profile:', error);
      alert(t('settings.profile.error'));
    } finally {
      setProfileSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Image size must be less than 2MB');
      return;
    }

    setUploadingAvatar(true);
    try {
      await waitForAuth();
      const storage = getFirebaseStorage();
      const storageRef = ref(storage, `avatars/${user.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setProfileFormData(prev => ({ ...prev, photoUrl: url }));

      // Auto-save
      await updatePortalUser(user.uid, { photoUrl: url });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert(t('agency.settings.profile.failedToUpload'));
    } finally {
      setUploadingAvatar(false);
    }
  };

  const removeAvatar = async () => {
    if (!user) return;
    try {
      setProfileFormData(prev => ({ ...prev, photoUrl: '' }));
      await updatePortalUser(user.uid, { photoUrl: '' });
    } catch (error) {
      console.error('Error removing avatar:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white font-outfit">
          {t('agency.settings.title')}
        </h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">
          {t('agency.settings.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-colors font-outfit',
                  activeTab === tab.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800'
                )}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'user-profile' && (
            <PortalCard className="border-surface-200 dark:border-surface-800 shadow-sm">
              <div className="flex items-center gap-3 mb-10">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 border border-blue-100 dark:border-blue-900/30">
                  <UserIcon size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-surface-900 dark:text-white font-outfit">
                    {t('settings.profile.title')}
                  </h3>
                  <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest mt-0.5">
                    {t('settings.profile.subtitle')}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Avatar Section */}
                <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-3xl bg-surface-50/50 dark:bg-surface-900/30 border border-surface-100 dark:border-surface-800/50">
                  <div className="relative group">
                    <PortalAvatar
                      src={profileFormData.photoUrl}
                      name={profileFormData.name}
                      size="lg"
                      className="w-24 h-24 ring-4 ring-white dark:ring-surface-900 shadow-2xl"
                    />
                    {uploadingAvatar && (
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                      </div>
                    )}
                    <label className="absolute -bottom-1 -end-1 p-2 bg-blue-600 text-white rounded-xl shadow-lg cursor-pointer hover:bg-blue-700 transition-all hover:scale-110 active:scale-95">
                      <Camera size={16} />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        disabled={uploadingAvatar}
                      />
                    </label>
                  </div>

                  <div className="flex-1 text-center md:text-start">
                    <h4 className="font-bold text-surface-900 dark:text-white mb-1 font-outfit">
                      {t('settings.profile.avatar.title')}
                    </h4>
                    <p className="text-xs text-surface-500 dark:text-surface-400 mb-4 font-medium max-w-xs">
                      {t('settings.profile.avatar.desc')}
                    </p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                      <PortalButton
                        variant="outline"
                        size="sm"
                        className="h-9 px-4 text-xs font-bold border-surface-200 dark:border-surface-800"
                        onClick={() =>
                          document.querySelector<HTMLInputElement>('input[type="file"]')?.click()
                        }
                      >
                        {profileFormData.photoUrl
                          ? t('settings.profile.avatar.change')
                          : t('settings.profile.avatar.upload')}
                      </PortalButton>
                      {profileFormData.photoUrl && (
                        <button
                          onClick={removeAvatar}
                          className="text-xs font-bold text-rose-500 hover:text-rose-600 px-3 py-2 transition-colors"
                        >
                          {t('settings.profile.avatar.remove')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PortalInput
                      label={t('settings.profile.name')}
                      value={profileFormData.name}
                      onChange={e =>
                        setProfileFormData({ ...profileFormData, name: e.target.value })
                      }
                      placeholder={t('settings.profile.namePlaceholder')}
                    />
                    <div className="opacity-60 grayscale pointer-events-none">
                      <PortalInput
                        label={t('settings.profile.email')}
                        value={user?.email || ''}
                        readOnly
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-surface-200 dark:border-surface-800 flex justify-end">
                <PortalButton
                  onClick={handleProfileSave}
                  isLoading={profileSaving}
                  className="flex items-center gap-2 shadow-xl shadow-blue-500/20 font-outfit px-8"
                >
                  <Save size={18} />
                  {profileSaving ? t('settings.general.saving') : t('settings.profile.save')}
                </PortalButton>
              </div>
            </PortalCard>
          )}

          {activeTab === 'profile' && (
            <PortalCard className="border-surface-200 dark:border-surface-800 shadow-sm">
              <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-6 font-outfit">
                {t('agency.settings.profile.title')}
              </h3>
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <PortalInput
                    label={t('agency.settings.profile.nameLabel')}
                    value={profile.name}
                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                    placeholder={t('agency.settings.profile.namePlaceholder')}
                    className="font-outfit"
                  />
                  <PortalInput
                    label={t('agency.settings.profile.emailLabel')}
                    type="email"
                    value={profile.email}
                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                    placeholder={t('agency.settings.profile.emailPlaceholder')}
                    className="font-outfit"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <PortalInput
                    label={t('agency.settings.profile.websiteLabel')}
                    type="url"
                    value={profile.website}
                    onChange={e => setProfile({ ...profile, website: e.target.value })}
                    placeholder={t('agency.settings.profile.websitePlaceholder')}
                    className="font-outfit"
                  />
                  <PortalInput
                    label={t('agency.settings.profile.phoneLabel')}
                    type="tel"
                    value={profile.phone}
                    onChange={e => setProfile({ ...profile, phone: e.target.value })}
                    placeholder={t('agency.settings.profile.phonePlaceholder')}
                    className="font-outfit"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2 font-outfit">
                    {t('agency.settings.profile.descLabel')}
                  </label>
                  <textarea
                    value={profile.description}
                    onChange={e => setProfile({ ...profile, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-white/10 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none text-surface-900 dark:text-white font-medium"
                    placeholder={t('agency.settings.profile.descPlaceholder')}
                  />
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-surface-200 dark:border-surface-800 flex justify-end">
                <PortalButton
                  onClick={handleSave}
                  isLoading={saving}
                  className="flex items-center gap-2 shadow-lg shadow-blue-500/20 font-outfit"
                >
                  <Save size={18} />
                  {saving ? t('agency.settings.profile.saving') : t('agency.settings.profile.save')}
                </PortalButton>
              </div>
            </PortalCard>
          )}

          {activeTab === 'services' && (
            <PortalCard className="border-surface-200 dark:border-surface-800 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-bold text-surface-900 dark:text-white font-outfit">
                    {t('agency.settings.tabs.services')}
                  </h3>
                  <p className="text-sm text-surface-500 dark:text-surface-400">
                    Configure your service offerings and pricing tiers.
                  </p>
                </div>
                <PortalButton
                  size="sm"
                  className="h-10 font-outfit"
                  onClick={() => {
                    setEditingService(undefined);
                    setIsServiceModalOpen(true);
                  }}
                >
                  <Plus size={18} className="me-2" />
                  Add Service
                </PortalButton>
              </div>

              {loadingServices ? (
                <div className="py-20 flex justify-center">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              ) : services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map(service => (
                    <div
                      key={service.id}
                      className={cn(
                        'p-5 rounded-2xl border transition-all hover:shadow-md group',
                        service.isActive
                          ? 'bg-white dark:bg-surface-950 border-surface-200 dark:border-surface-800'
                          : 'bg-surface-50/50 dark:bg-surface-900/30 border-surface-100 dark:border-surface-800/50 opacity-60'
                      )}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 border border-blue-100 dark:border-blue-900/30">
                          <Tag size={18} />
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingService(service);
                              setIsServiceModalOpen(true);
                            }}
                            className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-bold text-surface-900 dark:text-white font-outfit flex items-center gap-2">
                          {service.name}
                          {!service.isActive && (
                            <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-surface-200 dark:bg-surface-800 text-surface-500">
                              Inactive
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-surface-500 line-clamp-2 min-h-[2rem]">
                          {service.description || t('portal.common.noDescription')}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-surface-100 dark:border-surface-800 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-surface-400 uppercase tracking-widest">
                            Base Price
                          </span>
                          <span className="text-sm font-black text-surface-900 dark:text-white font-outfit">
                            {formatCurrency(service.basePrice, service.currency)}
                          </span>
                        </div>
                        {service.category && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400 font-outfit">
                            {service.category}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center bg-surface-50/50 dark:bg-surface-900/30 rounded-3xl border-2 border-dashed border-surface-200 dark:border-surface-800">
                  <Tag className="w-12 h-12 text-surface-300 dark:text-surface-700 mx-auto mb-4 opacity-20" />
                  <h4 className="text-lg font-bold text-surface-900 dark:text-white font-outfit mb-1">
                    Your Catalog is Empty
                  </h4>
                  <p className="text-sm text-surface-500 dark:text-surface-400 max-w-sm mx-auto mb-8">
                    Add services to your catalog to quickly create pricing offers for client
                    requests.
                  </p>
                  <PortalButton
                    variant="outline"
                    onClick={() => {
                      setEditingService(undefined);
                      setIsServiceModalOpen(true);
                    }}
                  >
                    Create Your First Service
                  </PortalButton>
                </div>
              )}
            </PortalCard>
          )}

          {activeTab === 'team' && (
            <PortalCard className="border-surface-200 dark:border-surface-800 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-surface-900 dark:text-white font-outfit">
                    {t('agency.settings.team.title')}
                  </h3>
                  <p className="text-sm text-surface-500 dark:text-surface-400">
                    {t('agency.settings.team.subtitle')}
                  </p>
                </div>
                <PortalButton
                  size="sm"
                  variant="outline"
                  className="h-10 font-outfit"
                  onClick={() => setIsInviteModalOpen(true)}
                >
                  {t('agency.settings.team.invite')}
                </PortalButton>
              </div>

              {loadingTeam ? (
                <div className="py-12 flex justify-center">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              ) : team.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-surface-100 dark:border-surface-800">
                  <table className="w-full text-start">
                    <thead className="bg-surface-50 dark:bg-surface-900/50 text-[10px] font-black text-surface-400 uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-4">{t('agency.settings.team.table.member')}</th>
                        <th className="px-6 py-4">{t('agency.settings.team.table.status')}</th>
                        <th className="px-6 py-4">{t('agency.settings.team.table.joined')}</th>
                        <th className="px-6 py-4 text-end">
                          {t('agency.settings.team.table.action')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                      {team.map((member: PortalUser) => (
                        <tr
                          key={member.id}
                          className="hover:bg-surface-50/50 dark:hover:bg-surface-800/20 transition-all group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <PortalAvatar
                                name={member.name || t('portal.consultations.userFallback')}
                                size="sm"
                                className="ring-2 ring-white dark:ring-surface-900 shadow-sm"
                              />
                              <div>
                                <p className="text-sm font-bold text-surface-900 dark:text-white font-outfit">
                                  {member.name || t('portal.common.unnamedUser')}
                                </p>
                                <p className="text-[10px] font-bold text-surface-400 uppercase tracking-tight">
                                  {member.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={cn(
                                'inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border',
                                member.status === 'inactive'
                                  ? 'bg-slate-50 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-800'
                                  : member.status === 'suspended'
                                    ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30'
                                    : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30'
                              )}
                            >
                              {t(`agency.settings.team.${member.status || 'active'}` as never)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[10px] font-bold text-surface-500 uppercase tracking-tighter">
                              {member.createdAt?.toDate
                                ? member.createdAt.toDate().toLocaleDateString()
                                : 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-end">
                            <button className="text-xs font-bold text-surface-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-widest">
                              {t('agency.settings.team.edit')}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center opacity-30">
                  <UserIcon className="w-12 h-12 text-surface-300 dark:text-surface-700 mx-auto mb-3" />
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    {t('agency.settings.team.noMembers')}
                  </p>
                </div>
              )}

              {/* Pending Invites Section */}
              <div className="mt-10">
                <div className="flex items-center gap-2 mb-4 px-1">
                  <UserIcon className="text-blue-500" size={16} />
                  <h4 className="text-[10px] font-black text-surface-400 uppercase tracking-widest">
                    {t('agency.settings.team.pendingInvites')}
                  </h4>
                </div>

                {invites.length > 0 ? (
                  <div className="space-y-3">
                    {invites.map(invite => (
                      <div
                        key={invite.id}
                        className="p-4 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-100 dark:border-surface-800 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-bold text-surface-900 dark:text-white font-outfit">
                            {invite.email}
                          </p>
                          <p className="text-[10px] font-bold text-surface-400 uppercase tracking-tight">
                            {invite.role}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-bold text-surface-400 uppercase tracking-tighter">
                            {invite.createdAt?.toDate
                              ? invite.createdAt.toDate().toLocaleDateString()
                              : t('portal.common.sentRecently')}
                          </span>
                          <button
                            onClick={() => handleCancelInvite(invite.id)}
                            disabled={cancellingInvite === invite.id}
                            className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-600 disabled:opacity-50"
                          >
                            {cancellingInvite === invite.id
                              ? '...'
                              : t('agency.settings.team.cancelInvite')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center bg-surface-50/50 dark:bg-surface-900/30 rounded-xl border border-dashed border-surface-200 dark:border-surface-800">
                    <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest">
                      No pending invitations
                    </p>
                  </div>
                )}
              </div>
            </PortalCard>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <PortalCard className="border-surface-200 dark:border-surface-800 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 border border-purple-100 dark:border-purple-900/30">
                    <Zap size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-surface-900 dark:text-white font-outfit">
                      {t('agency.settings.tabs.integrations')}
                    </h3>
                    <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest mt-0.5">
                      {t('agency.settings.integrations.subtitle')}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Google Calendar Integration */}
                  <GoogleCalendarIntegration
                    connection={calendarConnection}
                    onConnect={async () => {
                      if (!isGoogleCalendarConfigured()) {
                        alert(
                          'Google Calendar integration requires configuration. Please add NEXT_PUBLIC_GOOGLE_CLIENT_ID to your environment variables.'
                        );
                        return;
                      }
                      initiateGoogleOAuth();
                    }}
                    onDisconnect={async () => {
                      await disconnectCalendar();
                      setCalendarConnection(null);
                    }}
                    onSync={async () => {
                      // Refresh connection status
                      const connection = await getCalendarConnection();
                      setCalendarConnection(connection);
                    }}
                  />

                  {/* Coming Soon - Slack */}
                  <IntegrationCard
                    title={t('agency.settings.integrations.slack.title')}
                    description={
                      t('agency.settings.integrations.slack.description') ||
                      'Get notifications in your Slack workspace'
                    }
                    icon={MessageSquare}
                    iconGradient="from-purple-500 to-pink-500"
                    comingSoon
                  />

                  {/* Coming Soon - Stripe */}
                  <IntegrationCard
                    title={t('agency.settings.integrations.stripe.title')}
                    description={
                      t('agency.settings.integrations.stripe.description')
                    }
                    icon={CreditCard}
                    iconGradient="from-indigo-500 to-purple-600"
                    comingSoon
                  />
                </div>
              </PortalCard>
            </div>
          )}

          {activeTab === 'billing' && (
            <PortalCard className="border-surface-200 dark:border-surface-800 shadow-sm">
              <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-4 font-outfit">
                {t('agency.settings.tabs.billing')}
              </h3>
              <p className="text-sm text-surface-500 dark:text-surface-400 mb-6 underline-offset-4">
                Configure payment methods and billing information.
              </p>
              <div className="py-12 text-center opacity-40">
                <CreditCard className="w-12 h-12 text-surface-300 dark:text-surface-700 mx-auto mb-3" />
                <p className="text-[10px] font-black uppercase tracking-widest text-surface-500 dark:text-surface-400">
                  Billing configuration coming soon
                </p>
              </div>
            </PortalCard>
          )}
        </div>
      </div>

      {isInviteModalOpen && (
        <InviteTeamMemberForm
          isAgency={true}
          onSuccess={handleInviteSuccess}
          onCancel={() => setIsInviteModalOpen(false)}
        />
      )}

      {isServiceModalOpen && (
        <ManageServiceForm
          service={editingService}
          onSuccess={handleServiceSuccess}
          onCancel={() => {
            setIsServiceModalOpen(false);
            setEditingService(undefined);
          }}
        />
      )}
    </div>
  );
}
