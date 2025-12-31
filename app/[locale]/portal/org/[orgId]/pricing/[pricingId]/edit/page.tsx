import { setRequestLocale } from 'next-intl/server';
import EditPricingForm from './EditPricingForm';
import { getPortalStaticPricingParams } from '@/lib/portal-static-params';

export const dynamicParams = false;

export async function generateStaticParams() {
  return getPortalStaticPricingParams();
}

export default async function EditPricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as 'en' | 'he');
  return <EditPricingForm />;
}
