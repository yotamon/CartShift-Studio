import DashboardClient from './DashboardClient';
import { getPortalStaticOrgParams } from '@/lib/portal-static-params';

export async function generateStaticParams() {
  return getPortalStaticOrgParams();
}

export default function DashboardPage() {
  return <DashboardClient />;
}
