"use client";

import React from "react";
import { PageHero } from "@/components/sections/PageHero";
import { BlogPageContent } from "@/components/sections/BlogPageContent";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
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
  const { t, language } = useLanguage();
  const isHe = language === "he";

  const breadcrumbItems = [
    { name: isHe ? "ראשי" : "Home", url: "/" },
    { name: isHe ? "בלוג" : "Blog", url: "/blog" },
  ];

  return (
    <>
      <PageHero
        title={t("blog.hero.title") as string}
        subtitle={t("blog.hero.subtitle") as string}
        description=""
        badge={t("blog.hero.badge") as string}
      />
      <div className="bg-slate-50 dark:bg-surface-900 border-b border-slate-200 dark:border-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <BlogPageContent posts={posts} categories={categories} />
    </>
  );
};
