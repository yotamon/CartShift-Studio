import PricingListClient from './PricingListClient';
import { getPortalStaticOrgParams } from '@/lib/portal-static-params';

export async function generateStaticParams() {
  return getPortalStaticOrgParams();
}

export default function PricingPage() {
  return <PricingListClient />;
}
