import { WordPressTemplate } from "@/components/templates/WordPressTemplate";
import { generateMetadata as genMeta, generateServiceSchema } from "@/lib/seo";
import Script from "next/script";
import type { Metadata } from "next";

export const metadata: Metadata = genMeta({
  title: "WordPress Development & Website Design | CartShift Studio",
  description: "Get a powerful, custom WordPress website that you can actually manage. Beautiful design, solid code, zero stress.",
  url: "/solutions/wordpress",
});

export default function WordPressPage() {
  const serviceSchema = generateServiceSchema(
    "WordPress Development",
    "Expert WordPress development services including custom websites, theme customization, WooCommerce setup, and optimization."
  );

  return (
    <>
      <Script
        id="wordpress-service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <WordPressTemplate />
    </>
  );
}

