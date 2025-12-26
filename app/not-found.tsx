import { NextIntlClientProvider } from 'next-intl';
import { routing } from '@/i18n/routing';
import NotFoundClient from '@/components/NotFoundClient';
import enMessages from '@/messages/en.json';
import heMessages from '@/messages/he.json';

const messages = {
  en: enMessages,
  he: heMessages,
};

export default function NotFound() {
  const locale = routing.defaultLocale;
  const localeMessages = messages[locale as 'en' | 'he'];

  return (
    <NextIntlClientProvider messages={localeMessages} locale={locale}>
      <NotFoundClient />
    </NextIntlClientProvider>
  );
}

