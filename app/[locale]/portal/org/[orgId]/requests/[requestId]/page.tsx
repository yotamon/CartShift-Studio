import { setRequestLocale } from 'next-intl/server';
import RequestDetailClient from './RequestDetailClient';
import { getPortalStaticRequestParams } from '@/lib/portal-static-params';

export const dynamicParams = process.env.NODE_ENV !== 'production';

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
