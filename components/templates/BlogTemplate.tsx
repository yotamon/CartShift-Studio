"use client";

import React from "react";
import { PageHero } from "@/components/sections/PageHero";
import { BlogPageContent } from "@/components/sections/BlogPageContent";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useTranslations, useLocale } from "next-intl";
import { isRTLLocale } from '@/lib/locale-config';

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
  const t = useTranslations();
  const locale = useLocale();
  const isHe = isRTLLocale(locale);

  const breadcrumbItems = [
    { name: t("navigation.home"), url: "/" },
    { name: t("navigation.blog"), url: "/blog" },
  ];

  return (
    <>
      <PageHero
        title={t("blog.hero.title")}
        subtitle={t("blog.hero.subtitle")}
        description=""
        badge={t("blog.hero.badge")}
      />
      <div className="bg-surface-50 dark:bg-surface-900 border-b border-surface-200 dark:border-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <BlogPageContent posts={posts} categories={categories} />
    </>
  );
};

