import { setRequestLocale } from 'next-intl/server';
import SettingsClient from './SettingsClient';
import { getPortalStaticOrgParams } from '@/lib/portal-static-params';

export const dynamicParams = false;

export async function generateStaticParams() {
  return getPortalStaticOrgParams();
}

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as 'en' | 'he');
  return <SettingsClient />;
}
