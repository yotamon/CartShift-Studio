import PricingDetailClient from './PricingDetailClient';
import { getPortalStaticPricingParams } from '@/lib/portal-static-params';

export async function generateStaticParams() {
  return getPortalStaticPricingParams();
}

export default function PricingDetailPage() {
  return <PricingDetailClient />;
}
