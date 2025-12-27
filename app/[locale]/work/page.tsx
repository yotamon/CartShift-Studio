import { WorkPageContent } from "@/components/sections/WorkPageContent";
import { generateMetadata as genMeta, generateBreadcrumbSchema } from "@/lib/seo";
import { getAllCaseStudies } from "@/lib/case-studies";
import Script from "next/script";
import type { Metadata } from "next";

export const metadata: Metadata = genMeta({
  title: "Our Work | Shopify & WordPress Projects",
  description: "See our recent e-commerce projects. Shopify stores, WordPress sites, migrations, and optimizations. Real results for real businesses.",
  url: "/work",
});

export default function WorkPage() {
  const caseStudies = getAllCaseStudies();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Work", url: "/work" }
  ]);

  return (
    <>
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <WorkPageContent caseStudies={caseStudies} />
    </>
  );
}
