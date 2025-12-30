import { setRequestLocale } from 'next-intl/server';
import DashboardClient from './DashboardClient';
import { getPortalStaticOrgParams } from '@/lib/portal-static-params';

export const dynamicParams = process.env.NODE_ENV !== 'production';

export async function generateStaticParams() {
  return getPortalStaticOrgParams();
}

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as 'en' | 'he');
  return <DashboardClient />;
}
