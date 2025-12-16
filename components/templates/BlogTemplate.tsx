"use client";

import React from "react";
import { PageHero } from "@/components/sections/PageHero";
import { BlogPageContent } from "@/components/sections/BlogPageContent";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  translation?: {
    title: string;
    excerpt: string;
    category: string;
  };
}

interface BlogTemplateProps {
  posts: BlogPost[];
  categories: string[];
}

export const BlogTemplate: React.FC<BlogTemplateProps> = ({ posts, categories }) => {
  const { t } = useLanguage();

  return (
    <>
      <PageHero
        title={t("blog.hero.title") as string}
        subtitle={t("blog.hero.subtitle") as string}
        description=""
        badge={t("blog.hero.badge") as string}
      />
      <BlogPageContent posts={posts} categories={categories} />
    </>
  );
};
