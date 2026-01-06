import { setRequestLocale } from 'next-intl/server';
import PricingListClient from './PricingListClient';

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as 'en' | 'he');
  return <PricingListClient />;
}
