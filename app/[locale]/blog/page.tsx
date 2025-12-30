import { setRequestLocale } from 'next-intl/server';
import { BlogTemplate } from "@/components/templates/BlogTemplate";
import { getAllPosts } from "@/lib/markdown";
import { generateMetadata as genMeta, generateBreadcrumbSchema } from "@/lib/seo";
import Script from "next/script";
import type { Metadata } from "next";

export const metadata: Metadata = genMeta({
  title: "E-commerce Blog | Shopify & WordPress Guides | CartShift Studio",
  description: "Expert e-commerce tips, Shopify guides, and WordPress tutorials. Learn how to optimize your online store and content sites for success.",
  url: "/blog",
});

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as 'en' | 'he');
  const posts = await getAllPosts();
  const categories = Array.from(new Set(posts.map((post) => post.category)));

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
  ]);

  return (
    <>
      <Script
        id="blog-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BlogTemplate posts={posts} categories={categories} />
    </>
  );
}

