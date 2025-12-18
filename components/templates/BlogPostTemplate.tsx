"use client";

import React from "react";
import { PageHero } from "@/components/sections/PageHero";
import { BlogPostContent } from "@/components/sections/BlogPostContent";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { BlogPost } from "@/lib/markdown";

interface BlogPostTemplateProps {
  post: BlogPost;
  relatedPosts: Array<{
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    date: string;
    translation?: {
      title: string;
      excerpt: string;
      category: string;
    };
  }>;
}

export const BlogPostTemplate: React.FC<BlogPostTemplateProps> = ({ post, relatedPosts }) => {
  const { language } = useLanguage();
  const isHe = language === "he";

  const title = isHe && post.translation?.title ? post.translation.title : post.title;
  const subtitle = isHe && post.translation?.category ? post.translation.category : post.category;

  const content = isHe && post.translation?.content ? post.translation.content : post.content;

  // Format date correctly based on locale
  const formattedDate = new Date(post.date).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US');
  const readingTimeText = post.readingTime
    ? (isHe ? ` • ${post.readingTime} דקות קריאה` : ` • ${post.readingTime} min read`)
    : '';

  const finalDescription = `${formattedDate}${readingTimeText}`;

  // Process related posts for current language
  const processedRelatedPosts = relatedPosts.map(p => ({
    slug: p.slug,
    title: isHe && p.translation?.title ? p.translation.title : p.title,
    excerpt: isHe && p.translation?.excerpt ? p.translation.excerpt : p.excerpt,
    category: isHe && p.translation?.category ? p.translation.category : p.category,
    date: p.date,
    translation: p.translation,
  }));

  const breadcrumbItems = [
    { name: isHe ? "ראשי" : "Home", url: "/" },
    { name: isHe ? "בלוג" : "Blog", url: "/blog" },
    { name: title, url: `/blog/${post.slug}` },
  ];

  return (
    <>
      <PageHero
        title={title}
        subtitle={subtitle}
        description={finalDescription}
        badge={isHe ? "פוסט בבלוג" : "Blog Post"}
        highlightLastWord={false}
        compact
      />
      <div className="bg-slate-50 dark:bg-surface-900 border-b border-slate-200 dark:border-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <BlogPostContent
        content={content}
        relatedPosts={processedRelatedPosts}
        title={title}
        date={post.date}
        category={subtitle}
        readingTime={post.readingTime}
      />
    </>
  );
};
