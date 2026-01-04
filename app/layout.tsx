import type { Metadata, Viewport } from "next";
import { Inter, Poppins, JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
	subsets: ["latin"],
	variable: "--font-outfit",
	display: "swap"
});

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

export const metadata: Metadata = {
  title: "CartShift Studio",
  description: "Expert Shopify & WordPress development agency",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f0f4f8' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default async function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<html suppressHydrationWarning>
			<body className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable} ${outfit.variable} font-sans`} suppressHydrationWarning>
				{children}
			</body>
		</html>
	);
}
