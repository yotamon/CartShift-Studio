import { ShopifyTemplate } from "@/components/templates/ShopifyTemplate";
import { generateMetadata as genMeta, generateServiceSchema } from "@/lib/seo";
import Script from "next/script";
import type { Metadata } from "next";

export const metadata: Metadata = genMeta({
  title: "Shopify Development & Support | CartShift Studio",
  description: "Sell more with a store built for growth. We handle the design, setup, and code so you can focus on your business.",
  url: "/solutions/shopify",
});

export default function ShopifyPage() {
  const serviceSchema = generateServiceSchema(
    "Shopify Development",
    "Expert Shopify development services including store setup, custom features, performance optimization, and ongoing support."
  );

  return (
    <>
      <Script
        id="shopify-service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <ShopifyTemplate />
    </>
  );
}

