'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';

export default function PortalRoot() {
  const router = useRouter();
  const t = useTranslations();
  const { userData, loading, isAuthenticated } = usePortalAuth();

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
    }

    router.replace('/portal/org/');
  }, [router, userData, loading, isAuthenticated]);

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

