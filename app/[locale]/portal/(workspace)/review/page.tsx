import { setRequestLocale } from 'next-intl/server';
import ReviewClient from './ReviewClient';

export default async function ReviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as 'en' | 'he');
  return <ReviewClient />;
}
