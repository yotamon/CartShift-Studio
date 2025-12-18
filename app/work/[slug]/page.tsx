import { notFound } from "next/navigation";
import { generateMetadata as genMeta, generateBreadcrumbSchema } from "@/lib/seo";
import Script from "next/script";
import type { Metadata } from "next";
import { CaseStudyContent } from "@/components/sections/CaseStudyContent";

interface CaseStudy {
  slug: string;
  name: string;
  industry: string;
  platform: "shopify" | "wordpress";
  brief: string;
  challenge: string;
  solution: string;
  results: Array<{ metric: string; before: string; after: string; change: string }>;
  testimonial?: {
    quote: string;
    name: string;
    title: string;
  };
}

const caseStudies: Record<string, CaseStudy> = {
  "artisan-creations": {
    slug: "artisan-creations",
    name: "Artisan Creations",
    industry: "Handmade Goods",
    platform: "shopify",
    brief: "Custom Shopify store with advanced product filtering and subscription features.",
    challenge: "Artisan Creations was struggling with a slow, outdated website that couldn't handle their growing product catalog. Their checkout process was confusing, leading to high cart abandonment rates.",
    solution: "We built a custom Shopify store with advanced filtering, a streamlined checkout experience, and subscription functionality for recurring orders. The new design showcases their handmade products beautifully while making it easy for customers to find exactly what they need.",
    results: [
      { metric: "Page Load Time", before: "4.2s", after: "1.8s", change: "-57%" },
      { metric: "Cart Abandonment", before: "68%", after: "42%", change: "-38%" },
      { metric: "Mobile Conversion", before: "1.2%", after: "2.8%", change: "+133%" }
    ],
    testimonial: {
      quote: "CartShift Studio rebuilt our store experience end-to-end. Conversions improved quickly, and the site finally feels premium.",
      name: "Sarah Johnson",
      title: "Founder, Artisan Creations"
    }
  },
  "techgear-pro": {
    slug: "techgear-pro",
    name: "TechGear Pro",
    industry: "Electronics",
    platform: "shopify",
    brief: "Migration from WooCommerce with 40% speed improvement and new checkout flow.",
    challenge: "TechGear Pro was running on WooCommerce but experienced frequent downtime and slow performance during sales events. They needed a more reliable platform that could handle their traffic spikes.",
    solution: "We migrated their entire store to Shopify Plus, optimizing every aspect of performance. We implemented a new checkout flow with express payment options and rebuilt their product pages for faster loading.",
    results: [
      { metric: "Page Speed", before: "5.1s", after: "2.1s", change: "-59%" },
      { metric: "Uptime", before: "97.2%", after: "99.9%", change: "+2.7%" },
      { metric: "Checkout Completion", before: "45%", after: "62%", change: "+38%" }
    ],
    testimonial: {
      quote: "They handled our migration flawlessly and made the store noticeably faster. Customers felt the difference immediately.",
      name: "Michael Chen",
      title: "CEO, TechGear Pro"
    }
  }
};

export async function generateStaticParams() {
  return Object.keys(caseStudies).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = caseStudies[slug];

  if (!caseStudy) {
    return genMeta({
      title: "Case Study Not Found",
      description: "The requested case study could not be found.",
      url: `/work/${slug}`,
    });
  }

  return genMeta({
    title: `${caseStudy.name} Case Study | ${caseStudy.platform === "shopify" ? "Shopify" : "WordPress"} Development`,
    description: caseStudy.brief,
    url: `/work/${slug}`,
  });
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const caseStudy = caseStudies[slug];

  if (!caseStudy) {
    notFound();
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Work", url: "/work" },
    { name: caseStudy.name, url: `/work/${slug}` }
  ]);

  return (
    <>
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CaseStudyContent caseStudy={caseStudy} />
    </>
  );
}


