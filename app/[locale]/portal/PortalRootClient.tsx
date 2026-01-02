'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { Loader2, Building2, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';
import { PortalCard } from '@/components/portal/ui/PortalCard';
import { PortalButton } from '@/components/portal/ui/PortalButton';
import { createOrganization } from '@/lib/services/portal-organizations';

export default function PortalRootClient() {
  const router = useRouter();
  const t = useTranslations();
  const { userData, loading, isAuthenticated, user } = usePortalAuth();
  const [organizationName, setOrganizationName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.push('/portal/login/');
      return;
    }

    if (userData) {
      if (userData.isAgency) {
        router.replace('/portal/agency/inbox/');
        return;
      }

      if (userData.organizations && userData.organizations.length > 0) {
        router.replace(`/portal/org/${userData.organizations[0]}/dashboard/`);
        return;
      }

      // User has no organizations - stay on this page to show onboarding
      // Don't redirect to /portal/org/ as that would create a loop
    }
  }, [router, userData, loading, isAuthenticated]);

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !organizationName.trim()) {
      setError('Please enter an organization name');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const org = await createOrganization(
        organizationName.trim(),
        user.uid,
        user.email || '',
        user.displayName || undefined
      );

      // Redirect to the new organization's dashboard
      router.push(`/portal/org/${org.id}/dashboard/`);
    } catch (err) {
      console.error('Failed to create organization:', err);
      setError(err instanceof Error ? err.message : 'Failed to create organization. Please try again.');
      setIsCreating(false);
    }
  };

  // Show loading while authenticating
  if (loading || !userData) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <div className="absolute inset-0 blur-xl bg-blue-500/20 animate-pulse scale-150 -z-10" />
        </div>
        <p className="text-surface-500 font-black font-outfit uppercase tracking-[0.2em] text-[10px]">{t('portal.loading.workspace')}</p>
      </div>
    );
  }

  // Show organization creation form if user has no organizations
  if (userData && !userData.isAgency && (!userData.organizations || userData.organizations.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-surface-950 dark:via-surface-900 dark:to-surface-950 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8 animate-in fade-in duration-700">
          {/* Welcome Header */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-blue-500/30 transform hover:scale-105 transition-transform duration-300">
              <Building2 size={40} className="text-white" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-3xl font-black text-surface-900 dark:text-white">
                  {t('portal.onboarding.welcome.title') || 'Welcome!'}
                </h1>
                <Sparkles size={24} className="text-yellow-500 animate-pulse" />
              </div>
              <p className="text-surface-600 dark:text-surface-400 font-medium">
                {t('portal.onboarding.welcome.subtitle') || "Let's set up your workspace"}
              </p>
            </div>
          </div>

          {/* Organization Form */}
          <PortalCard className="border-surface-200 dark:border-surface-800 shadow-2xl">
            <form onSubmit={handleCreateOrganization} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-surface-500 dark:text-surface-400 mb-3 uppercase tracking-widest">
                  {t('portal.onboarding.form.orgNameLabel') || 'Organization Name'} *
                </label>
                <input
                  type="text"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder={t('portal.onboarding.form.orgNamePlaceholder') || 'e.g., My Company Inc.'}
                  className="portal-input w-full text-lg font-bold"
                  required
                  autoFocus
                  disabled={isCreating}
                />
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-2 font-medium">
                  {t('portal.onboarding.form.orgNameHint') || "This is your organization's display name. You can change it later."}
                </p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-xl">
                  <p className="text-sm text-red-600 dark:text-red-400 font-bold">{error}</p>
                </div>
              )}

              <PortalButton
                type="submit"
                className="w-full h-12 text-base font-black shadow-lg shadow-blue-500/30"
                disabled={isCreating || !organizationName.trim()}
              >
                {isCreating ? (
                  <>
                    <Loader2 size={20} className="animate-spin me-2" />
                    {t('portal.onboarding.form.creating') || 'Creating...'}
                  </>
                ) : (
                  <>
                    <Building2 size={20} className="me-2" />
                    {t('portal.onboarding.form.createButton') || 'Create Organization'}
                  </>
                )}
              </PortalButton>
            </form>
          </PortalCard>

          {/* Help Text */}
          <p className="text-center text-xs text-surface-500 dark:text-surface-400 font-medium">
            {t('portal.onboarding.help') || "You'll be able to invite team members and manage your workspace after creation."}
          </p>
        </div>
      </div>
    );
  }

  // Fallback loading state (shouldn't normally reach here)
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex flex-col items-center justify-center space-y-6">
      <div className="relative">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <div className="absolute inset-0 blur-xl bg-blue-500/20 animate-pulse scale-150 -z-10" />
      </div>
      <p className="text-surface-500 font-black font-outfit uppercase tracking-[0.2em] text-[10px]">{t('portal.loading.workspace')}</p>
    </div>
  );
}
