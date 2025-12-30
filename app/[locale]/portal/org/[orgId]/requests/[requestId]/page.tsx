import { setRequestLocale } from 'next-intl/server';
import RequestDetailClient from './RequestDetailClient';
import { getPortalStaticRequestParams } from '@/lib/portal-static-params';

export const dynamicParams = false;

export async function generateStaticParams() {
  return getPortalStaticRequestParams();
}

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as 'en' | 'he');
  return <RequestDetailClient />;
}
