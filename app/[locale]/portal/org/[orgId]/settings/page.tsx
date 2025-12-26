import SettingsClient from './SettingsClient';
import { getPortalStaticOrgParams } from '@/lib/portal-static-params';

export async function generateStaticParams() {
  return getPortalStaticOrgParams();
}

export default function SettingsPage() {
  return <SettingsClient />;
}
