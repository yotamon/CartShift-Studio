import { setRequestLocale, getMessages } from 'next-intl/server';
import DashboardClient from './DashboardClient';

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as 'en' | 'he');
  const messages = await getMessages();
  return <DashboardClient messages={messages} locale={locale} />;
}
