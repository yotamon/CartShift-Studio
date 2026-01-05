import { setRequestLocale } from 'next-intl/server';
import ConsultationsClient from './ConsultationsClient';
import { getPortalStaticOrgParams } from '@/lib/portal-static-params';

export const dynamicParams = false;

export async function generateStaticParams() {
  return getPortalStaticOrgParams();
}

export default async function ConsultationsPage({
  params,
}: {
  params: Promise<{ locale: string; orgId: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as 'en' | 'he');
  return <ConsultationsClient />;
}
