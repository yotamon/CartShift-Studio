'use client';

import { usePathname } from '@/i18n/navigation';
import { MainLayout } from './MainLayout';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPortalRoute = pathname?.includes('/portal');

  // Portal routes don't need MainLayout (header/footer)
  if (isPortalRoute) {
    return <>{children}</>;
  }

  // Regular site routes use MainLayout
  return <MainLayout>{children}</MainLayout>;
}

