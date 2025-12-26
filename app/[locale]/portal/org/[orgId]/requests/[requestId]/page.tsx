import RequestDetailClient from './RequestDetailClient';
import { getPortalStaticRequestParams } from '@/lib/portal-static-params';

export async function generateStaticParams() {
  return getPortalStaticRequestParams();
}

export default function RequestDetailPage() {
  return <RequestDetailClient />;
}
