import { setRequestLocale } from 'next-intl/server';
import InviteClient from './InviteClient';

export const dynamicParams = false;

export async function generateStaticParams() {
  // Return a placeholder for static export - actual routing happens client-side
  return [{ code: 'template' }];
}

export default async function InvitePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as 'en' | 'he');
  return <InviteClient />;
}
