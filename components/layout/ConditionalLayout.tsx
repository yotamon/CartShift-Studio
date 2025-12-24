'use client';

import { usePathname } from 'next/navigation';
import { MainLayout } from './MainLayout';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPortalRoute = pathname?.startsWith('/portal');

  // Portal routes don't need MainLayout (header/footer)
  if (isPortalRoute) {
    return <>{children}</>;
  }

  // Regular site routes use MainLayout
  return <MainLayout>{children}</MainLayout>;
}
