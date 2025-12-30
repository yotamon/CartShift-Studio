import { setRequestLocale } from 'next-intl/server';
import AgencyInboxClient from './AgencyInboxClient';



export default async function AgencyInboxPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as 'en' | 'he');
  return <AgencyInboxClient />;
}
