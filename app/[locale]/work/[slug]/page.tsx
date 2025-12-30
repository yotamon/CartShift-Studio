import { setRequestLocale } from 'next-intl/server';
import { notFound } from "next/navigation";
import { generateMetadata as genMeta, generateBreadcrumbSchema } from "@/lib/seo";
import Script from "next/script";
import type { Metadata } from "next";
import { getCaseStudyBySlug, getCaseStudySlugs } from "@/lib/case-studies";
import { CaseStudyDetailContent } from "@/components/sections/CaseStudyDetailContent";

export async function generateStaticParams() {
  const locales = ['en', 'he'];
  const slugs = getCaseStudySlugs();

  return locales.flatMap((locale) =>
    slugs.map((slug) => ({
      locale,
      slug,
    }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) {
    return genMeta({
      title: "Case Study Not Found",
      description: "The requested case study could not be found.",
      url: `/work/${slug}`,
    });
  }

  return genMeta({
    title: `${caseStudy.title} | Case Study`,
    description: caseStudy.summary,
    url: `/work/${slug}`,
  });
}

export default async function CaseStudyPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale as 'en' | 'he');
  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Work", url: "/work" },
    { name: caseStudy.title, url: `/work/${slug}` }
  ]);

  return (
    <>
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CaseStudyDetailContent caseStudy={caseStudy} />
    </>
  );
}
