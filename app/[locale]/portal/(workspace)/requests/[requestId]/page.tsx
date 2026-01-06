import { setRequestLocale } from 'next-intl/server';
import RequestDetailClient from './RequestDetailClient';
import { PORTAL_STATIC_REQUEST_ID } from '@/lib/portal-static-params';

export const dynamicParams = false;

export async function generateStaticParams() {
  return [{ requestId: PORTAL_STATIC_REQUEST_ID }];
}

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ locale: string; requestId: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as 'en' | 'he');
  return <RequestDetailClient />;
}
