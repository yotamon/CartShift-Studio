import { setRequestLocale } from 'next-intl/server';
import PortalOrgRootClient from './PortalOrgRootClient';



export default async function PortalOrgRoot({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as 'en' | 'he');
  return <PortalOrgRootClient />;
}
