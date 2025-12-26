import TeamClient from './TeamClient';
import { getPortalStaticOrgParams } from '@/lib/portal-static-params';

export async function generateStaticParams() {
  return getPortalStaticOrgParams();
}

export default function TeamPage() {
  return <TeamClient />;
}
