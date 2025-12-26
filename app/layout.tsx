import type { Metadata } from "next";
import { Inter, Poppins, JetBrains_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "CartShift Studio",
  description: "Expert Shopify & WordPress development agency",
};

export default async function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<html suppressHydrationWarning>
			<body className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable} font-sans`} suppressHydrationWarning>
				{children}
			</body>
		</html>
	);
}
