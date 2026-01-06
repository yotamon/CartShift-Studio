import { setRequestLocale } from 'next-intl/server';
import RequestsClient from './RequestsClient';

export default async function RequestsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as 'en' | 'he');
  return <RequestsClient />;
}
