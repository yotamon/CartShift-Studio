import RequestsClient from './RequestsClient';
import { getPortalStaticOrgParams } from '@/lib/portal-static-params';

export async function generateStaticParams() {
  return getPortalStaticOrgParams();
}

export default function RequestsPage() {
  return <RequestsClient />;
}
