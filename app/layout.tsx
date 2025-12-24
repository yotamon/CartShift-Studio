import type { Metadata } from "next";
import { Inter, Poppins, JetBrains_Mono } from "next/font/google";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { generateOrganizationSchema } from "@/lib/seo";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap"
});

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["400", "600", "700"],
	variable: "--font-poppins",
	display: "optional"
});

const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-jetbrains",
	display: "swap"
});

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

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	const orgSchema = generateOrganizationSchema();

	return (
		<html lang="en">
			<head>
				<Script id="organization-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
			</head>
			<body className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable} font-sans`}>
				<ThemeProvider>
					<LanguageProvider>
						<GoogleAnalytics />
						<ConditionalLayout>{children}</ConditionalLayout>
					</LanguageProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
