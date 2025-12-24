'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function PortalRoot() {
  const router = useRouter();

  useEffect(() => {
    // In a real app, we'd fetch the user's default orgId from auth
    // For now, redirect to default-org
    router.replace('/portal/org/default-org/dashboard/');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      <p className="text-slate-500 font-medium">Redirecting to your workspace...</p>
    </div>
  );
}
