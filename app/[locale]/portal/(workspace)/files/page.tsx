import { setRequestLocale } from 'next-intl/server';
import FilesClient from './FilesClient';

export default async function FilesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as 'en' | 'he');
  return <FilesClient />;
}
