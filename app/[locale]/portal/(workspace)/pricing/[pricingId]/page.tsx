import { setRequestLocale } from 'next-intl/server';
import PricingDetailClient from './PricingDetailClient';
import { PORTAL_STATIC_PRICING_ID } from '@/lib/portal-static-params';

export const dynamicParams = false;

export async function generateStaticParams() {
  return [{ pricingId: PORTAL_STATIC_PRICING_ID }];
}

export default async function PricingDetailPage({
  params,
}: {
  params: Promise<{ locale: string; pricingId: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as 'en' | 'he');
  return <PricingDetailClient />;
}
