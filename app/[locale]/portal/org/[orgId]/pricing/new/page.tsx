import CreatePricingForm from './CreatePricingForm';
import { getPortalStaticOrgParams } from '@/lib/portal-static-params';

export async function generateStaticParams() {
  return getPortalStaticOrgParams();
}

export default function NewPricingPage() {
  return <CreatePricingForm />;
}
