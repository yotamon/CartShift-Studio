import NewRequestClient from './NewRequestClient';
import { getPortalStaticOrgParams } from '@/lib/portal-static-params';

export async function generateStaticParams() {
  return getPortalStaticOrgParams();
}

export default function NewRequestPage() {
  return <NewRequestClient />;
}
