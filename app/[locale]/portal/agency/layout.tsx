import { PortalShell } from '@/components/portal/PortalShell';
import { setRequestLocale } from 'next-intl/server';

export default async function AgencyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PortalShell isAgency>{children}</PortalShell>;
}
