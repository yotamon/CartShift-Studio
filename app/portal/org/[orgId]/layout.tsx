import { PortalShell } from '@/components/portal/PortalShell';

export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  return <PortalShell orgId={orgId}>{children}</PortalShell>;
}
