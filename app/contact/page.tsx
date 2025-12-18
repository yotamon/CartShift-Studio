import { ContactTemplate } from "@/components/templates/ContactTemplate";
import type { Metadata } from "next";
import { generateMetadata as genMeta, generateBreadcrumbSchema, generateLocalBusinessSchema } from "@/lib/seo";
import Script from "next/script";

export const metadata: Metadata = genMeta({
  title: "Contact CartShift Studio | Free E-commerce Consultation",
  description: "Get in touch with CartShift Studio for a free consultation on your Shopify or WordPress project. Expert advice on e-commerce development.",
  url: "/contact",
});

export default function ContactPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Contact", url: "/contact" },
  ]);
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <>
      <Script
        id="contact-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <ContactTemplate />
    </>
  );
}

