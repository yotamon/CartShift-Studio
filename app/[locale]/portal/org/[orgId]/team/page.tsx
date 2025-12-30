import { setRequestLocale } from 'next-intl/server';
import TeamClient from './TeamClient';
import { getPortalStaticOrgParams } from '@/lib/portal-static-params';

export const dynamicParams = process.env.NODE_ENV !== 'production';

export async function generateStaticParams() {
  return getPortalStaticOrgParams();
}

export default async function TeamPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as 'en' | 'he');
  return <TeamClient />;
}
