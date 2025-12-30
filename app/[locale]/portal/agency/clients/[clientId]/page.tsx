import { setRequestLocale } from 'next-intl/server';
import AgencyClientDetailClient from './AgencyClientDetailClient';
import { getPortalStaticClientParams } from '@/lib/portal-static-params';

export const dynamicParams = false;

export async function generateStaticParams() {
  return getPortalStaticClientParams();
}

export default async function AgencyClientDetailPage({
  params,
}: {
  params: Promise<{ locale: string; clientId: string }>;
}) {
  const { locale, clientId } = await params;
  setRequestLocale(locale as 'en' | 'he');
  return <AgencyClientDetailClient clientId={clientId} />;
}
