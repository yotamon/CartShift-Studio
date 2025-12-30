import { setRequestLocale } from 'next-intl/server';
import AgencyClientDetailClient from '../[clientId]/AgencyClientDetailClient';

export default async function AgencyClientDetailTemplatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as 'en' | 'he');

  // In production, this is a placeholder that gets rewritten by Firebase
  // In development, the rewrite provides the actual clientId
  return <AgencyClientDetailClient clientId="template" />;
}
