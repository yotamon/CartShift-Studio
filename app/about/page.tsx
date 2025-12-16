import { AboutTemplate } from "@/components/templates/AboutTemplate";
import { generateMetadata as genMeta, generateOrganizationSchema } from "@/lib/seo";
import Script from "next/script";
import type { Metadata } from "next";

export const metadata: Metadata = genMeta({
  title: "About Us | CartShift Studio",
  description: "Two friends. One Mission. We build high-performance websites with a human touch. Meet the team behind CartShift Studio.",
  url: "/about",
});

export default function AboutPage() {
  const orgSchema = generateOrganizationSchema();

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <AboutTemplate />
    </>
  );
}

