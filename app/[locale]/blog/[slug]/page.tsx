import { setRequestLocale } from 'next-intl/server';
import { notFound } from "next/navigation";
import { BlogPostTemplate } from "@/components/templates/BlogPostTemplate";
import { getAllPosts, getPostBySlug } from "@/lib/markdown";
import { generateMetadata as genMeta, generateArticleSchema, generateBreadcrumbSchema } from "@/lib/seo";
import Script from "next/script";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  const locales = ['en', 'he'];

  return locales.flatMap((locale) =>
    posts.map((post) => ({
      locale,
      slug: post.slug,
    }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cartshiftstudio.com";

  return genMeta({
    title: `${post.title} | CartShift Studio Blog`,
    description: post.excerpt,
    url: `${baseUrl}/blog/${post.slug}`,
    type: "article",
    publishedTime: post.date,
    author: "CartShift Studio",
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale as 'en' | 'he');
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cartshiftstudio.com";
  const articleUrl = `${baseUrl}/blog/${post.slug}`;

  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.excerpt,
    date: post.date,
    url: articleUrl,
    author: "CartShift Studio",
    category: post.category,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Blog", url: `${baseUrl}/blog` },
    { name: post.title, url: articleUrl },
  ]);

  const allPosts = await getAllPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      date: p.date,
      // Pass dictionary for client-side selection
      translation: p.translation ? {
        title: p.translation.title,
        excerpt: p.translation.excerpt,
        category: p.translation.category
      } : undefined
    }));

  return (
    <>
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BlogPostTemplate post={post} relatedPosts={relatedPosts} />
    </>
  );
}

