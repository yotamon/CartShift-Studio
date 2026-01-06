import { setRequestLocale } from 'next-intl/server';
import TeamClient from './TeamClient';

export default async function TeamPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as 'en' | 'he');
  return <TeamClient />;
}
