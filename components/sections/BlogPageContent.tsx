"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

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

interface BlogPageContentProps {
  posts: BlogPost[];
  categories: string[];
}

import { useLanguage } from "@/components/providers/LanguageProvider";

export const BlogPageContent: React.FC<BlogPageContentProps> = ({ posts, categories }) => {
  const { t, language } = useLanguage();
  const isHe = language === "he";

  return (
    <section className="py-20 md:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 relative bg-slate-50 dark:bg-surface-900">
      <div className="max-w-7xl mx-auto relative z-10">
        {categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 flex flex-wrap gap-3"
          >
            <span className="text-sm font-semibold text-slate-700 dark:text-surface-200 me-2">{t("blog.categories") as string}</span>
            {categories.map((category) => (
              <span
                key={category}
                className="px-4 py-2 glass-effect text-primary-300 rounded-full text-sm font-medium"
              >
                {category}
              </span>
            ))}
          </motion.div>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-base md:text-lg text-slate-600 dark:text-surface-300">{t("blog.noPosts") as string}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => {
              const title = isHe && post.translation?.title ? post.translation.title : post.title;
              const category = isHe && post.translation?.category ? post.translation.category : post.category;
              const excerpt = isHe && post.translation?.excerpt ? post.translation.excerpt : post.excerpt;
              const formattedDate = new Date(post.date).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US');

              return (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover glow className="h-full group relative overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-accent-600 dark:text-primary-400 uppercase tracking-wider">
                        {category}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-surface-400">
                        {formattedDate}
                      </span>
                    </div>
                    <CardTitle>
                      <Link href={`/blog/${post.slug}`} className="text-slate-900 dark:text-white hover:text-accent-600 dark:hover:text-primary-400 transition-colors">
                        {title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-6 text-base md:text-lg text-slate-600 dark:text-surface-300 leading-relaxed">{excerpt}</p>
                    <Link href={`/blog/${post.slug}`}>
                      <button className="text-accent-600 dark:text-primary-400 font-bold hover:text-accent-700 dark:hover:text-primary-300 transition-colors text-base md:text-lg flex items-center gap-2 group/link">
                        {t("blog.readMore") as string}
                        <svg className="w-5 h-5 group-hover/link:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover/link:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            );})}
          </div>
        )}
      </div>
    </section>
  );
};

