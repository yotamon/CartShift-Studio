import { setRequestLocale } from 'next-intl/server';
import AgencySettingsClient from './AgencySettingsClient';

export default async function AgencySettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as 'en' | 'he');
  return <AgencySettingsClient />;
}

