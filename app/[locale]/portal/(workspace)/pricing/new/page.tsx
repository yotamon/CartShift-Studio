import { setRequestLocale } from 'next-intl/server';
import CreatePricingForm from './CreatePricingForm';

export default async function NewPricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as 'en' | 'he');
  return <CreatePricingForm />;
}
