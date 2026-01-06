import { setRequestLocale } from 'next-intl/server';
import EditPricingForm from './EditPricingForm';
import { PORTAL_STATIC_PRICING_ID } from '@/lib/portal-static-params';

export const dynamicParams = false;

export async function generateStaticParams() {
  return [{ pricingId: PORTAL_STATIC_PRICING_ID }];
}

export default async function EditPricingPage({
  params,
}: {
  params: Promise<{ locale: string; pricingId: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as 'en' | 'he');
  return <EditPricingForm />;
}
