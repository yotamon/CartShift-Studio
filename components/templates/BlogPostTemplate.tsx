"use client";

import React from "react";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { BlogPostContent } from "@/components/sections/BlogPostContent";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { BlogPost } from "@/lib/markdown";

interface BlogPostTemplateProps {
  post: BlogPost;
  relatedPosts: Array<{
    slug: string;
    title: string;
    excerpt: string;
    translation?: {
      title: string;
      excerpt: string;
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
  }));

  return (
    <>
      <PageHero
        title={title}
        subtitle={subtitle}
        description={finalDescription}
        badge={isHe ? "פוסט בבלוג" : "Blog Post"}
        highlightLastWord={false}
      />
      <div className="py-8 px-4 sm:px-6 lg:px-8 bg-surface-900">
        <div className="max-w-4xl mx-auto">
          <Link href="/blog" className="text-primary-400 hover:text-primary-300 mb-4 inline-flex items-center gap-2 transition-colors rtl:flex-row-reverse">
            <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {isHe ? "חזרה לבלוג" : "Back to Blog"}
          </Link>
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
