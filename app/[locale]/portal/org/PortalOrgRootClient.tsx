'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { Loader2 } from 'lucide-react';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';

export default function PortalOrgRootClient() {
  const router = useRouter();
  const { userData, loading, isAuthenticated } = usePortalAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.push('/portal/login/');
      return;
    }

    if (userData) {
      if (userData.organizations && userData.organizations.length > 0) {
        router.replace(`/portal/org/${userData.organizations[0]}/dashboard/`);
        return;
      }
    }

    router.replace('/portal/');
  }, [router, userData, loading, isAuthenticated]);

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      <p className="text-surface-500 font-medium">Redirecting to your workspace...</p>
    </div>
  );
}
