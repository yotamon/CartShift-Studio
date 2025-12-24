import { PortalShell } from '@/components/portal/PortalShell';

export default function AgencyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalShell isAgency>{children}</PortalShell>;
}
