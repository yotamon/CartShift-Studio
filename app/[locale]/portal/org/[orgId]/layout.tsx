import { PortalShell } from '@/components/portal/PortalShell';
import { setRequestLocale } from 'next-intl/server';

export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgId: string; locale: string }>;
}) {
  const { orgId, locale } = await params;
  setRequestLocale(locale as 'en' | 'he');
  return <PortalShell orgId={orgId}>{children}</PortalShell>;
}
