import { PortalShell } from '@/components/portal/PortalShell';
import { setRequestLocale } from 'next-intl/server';

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as 'en' | 'he');
  // PortalShell no longer needs orgId prop - it uses OrgContext
  return <PortalShell>{children}</PortalShell>;
}
