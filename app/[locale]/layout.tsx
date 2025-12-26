import type { Metadata } from "next";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LocaleAttributes } from "@/components/providers/LocaleAttributes";
import { generateOrganizationSchema } from "@/lib/seo";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cartshiftstudio.com";

export const metadata: Metadata = {
	title: {
		default: "CartShift Studio | Shopify & WordPress E-commerce Development Agency",
		template: "%s | CartShift Studio"
	},
	description: "Expert Shopify & WordPress development agency. Custom e-commerce stores, migrations, and optimization. Get a free consultation for your online store project.",
	metadataBase: new URL(siteUrl),
	alternates: {
		canonical: siteUrl,
		languages: {
			en: siteUrl,
			he: siteUrl,
			"x-default": siteUrl
		}
	}
};

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
	children,
	params
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;

	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	setRequestLocale(locale);

	const messages = await getMessages();
	const orgSchema = generateOrganizationSchema();

	return (
		<>
			<Script id="organization-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
			<ThemeProvider>
				<NextIntlClientProvider messages={messages} locale={locale}>
					<LocaleAttributes />
					<GoogleAnalytics />
					<ConditionalLayout>{children}</ConditionalLayout>
				</NextIntlClientProvider>
			</ThemeProvider>
		</>
	);
}
