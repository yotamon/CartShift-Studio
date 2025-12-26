'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function PortalRoot() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to default-org for now
    router.replace('/portal/org/default-org/dashboard/');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-6">
      <div className="relative">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <div className="absolute inset-0 blur-xl bg-blue-500/20 animate-pulse scale-150 -z-10" />
      </div>
      <p className="text-slate-500 font-black font-outfit uppercase tracking-[0.2em] text-[10px]">Accessing Secure Workspace</p>
    </div>
  );
}

