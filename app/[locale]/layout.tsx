import type { Metadata } from 'next';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { LocaleAttributes } from '@/components/providers/LocaleAttributes';
import { GeoLocaleRedirect } from '@/components/providers/GeoLocaleRedirect';
import { generateOrganizationSchema } from '@/lib/seo';
import { ConditionalLayout } from '@/components/layout/ConditionalLayout';
import Script from 'next/script';
import { NextIntlClientProvider } from 'next-intl';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
// Import messages directly for static export compatibility
import enMessages from '@/messages/en.json';
import heMessages from '@/messages/he.json';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cartshiftstudio.com';

// Messages map for static lookup
const messagesMap = {
  en: enMessages,
  he: heMessages,
} as const;

export const metadata: Metadata = {
  title: {
    default: 'CartShift Studio | Shopify & WordPress E-commerce Development Agency',
    template: '%s | CartShift Studio',
  },
  description:
    'Expert Shopify & WordPress development agency. Custom e-commerce stores, migrations, and optimization. Get a free consultation for your online store project.',
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
    languages: {
      en: siteUrl,
      he: siteUrl,
      'x-default': siteUrl,
    },
  },
};

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Enable static rendering by providing the locale to next-intl
  setRequestLocale(locale);

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Get messages directly from static import instead of getMessages()
  // This avoids the headers() call that breaks static export
  const messages = messagesMap[locale as keyof typeof messagesMap] || messagesMap.en;
  const orgSchema = generateOrganizationSchema();

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <ThemeProvider>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <LocaleAttributes />
          <GeoLocaleRedirect />
          <GoogleAnalytics />
          <ConditionalLayout>{children}</ConditionalLayout>
        </NextIntlClientProvider>
      </ThemeProvider>
    </>
  );
}
