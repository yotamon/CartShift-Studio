'use client';

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function PortalLoadingState() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex flex-col items-center justify-center space-y-6">
      <div className="relative">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <div className="absolute inset-0 blur-xl bg-blue-500/20 animate-pulse scale-150 -z-10" />
      </div>
      <p className="text-surface-500 font-black font-outfit uppercase tracking-[0.2em] text-[10px]">
        {t('portal.loading.init')}
      </p>
    </div>
  );
}
