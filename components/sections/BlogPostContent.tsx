"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface RelatedPost {
  slug: string;
  title: string;
  excerpt: string;
}

interface BlogPostContentProps {
  content: string;
  relatedPosts: RelatedPost[];
  title: string;
  date: string;
  category: string;
  readingTime?: number;
}

export const BlogPostContent: React.FC<BlogPostContentProps> = ({
  content,
  relatedPosts,
  title,
  date,
  category,
  readingTime
}) => {
  const { t, language } = useLanguage();
  const [readingProgress, setReadingProgress] = useState(0);
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  const isHe = language === "he";

  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;

    const processHeadings = () => {
      const h2Elements = article.querySelectorAll("h2");
      const extractedHeadings = Array.from(h2Elements).map((h2, index) => {
        const text = h2.textContent || "";
        let id = text.toLowerCase().replace(/[^a-z0-9\u0590-\u05FF]+/g, "-").replace(/^-+|-+$/g, "");
        if (!id || id.length === 0) {
          id = `heading-${index}`;
        }
        h2.id = id;
        h2.style.scrollMarginTop = "120px";
        h2.style.scrollPaddingTop = "120px";
        return {
          id,
          text,
          level: 2,
        };
      });
      setHeadings(extractedHeadings);
    };

    processHeadings();

    const observer = new MutationObserver(() => {
      processHeadings();
    });

    observer.observe(article, {
      childList: true,
      subtree: true,
    });

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / documentHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [content]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = title;

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const scrollToHeading = (headingId: string) => {
    setTimeout(() => {
      let element = document.getElementById(headingId);

      if (!element && articleRef.current) {
        const h2Elements = articleRef.current.querySelectorAll("h2");
        const matchingHeading = Array.from(h2Elements).find((h2) => {
          const text = h2.textContent || "";
          const id = text.toLowerCase().replace(/[^a-z0-9\u0590-\u05FF]+/g, "-").replace(/^-+|-+$/g, "");
          return id === headingId || h2.id === headingId;
        });
        if (matchingHeading) {
          element = matchingHeading as HTMLElement;
        }
      }

      if (element) {
        const headerOffset = 120;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 50);
  };

  return (
    <>
      <div className="reading-progress" style={{ width: `${readingProgress}%` }} />
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 relative bg-slate-50 dark:bg-surface-900">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-8">
            <aside className="lg:col-span-3 hidden lg:block">
              <div className="sticky top-24">
                {headings.length > 0 && (
                  <Card className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                      {isHe ? "תוכן עניינים" : "Table of Contents"}
                    </h3>
                    <nav className="space-y-2" dir={isHe ? "rtl" : "ltr"}>
                      {headings.map((heading) => (
                        <button
                          key={heading.id}
                          type="button"
                          onClick={() => scrollToHeading(heading.id)}
                          className="w-full text-left block text-sm text-slate-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-1.5 pl-2 border-l-2 border-transparent hover:border-primary-500 dark:hover:border-primary-400"
                        >
                          {heading.text}
                        </button>
                      ))}
                    </nav>
                  </Card>
                )}
              </div>
            </aside>

            <main className="lg:col-span-9">
              {headings.length > 0 && (
                <div className="lg:hidden mb-6">
                  <button
                    onClick={() => setMobileTocOpen(!mobileTocOpen)}
                    className="w-full flex items-center justify-between p-4 rounded-lg bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 hover:bg-slate-50 dark:hover:bg-surface-700 transition-colors"
                  >
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {isHe ? "תוכן עניינים" : "Table of Contents"}
                    </span>
                    <svg
                      className={`w-5 h-5 text-slate-600 dark:text-surface-400 transition-transform ${mobileTocOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {mobileTocOpen && (
                    <Card className="mt-2 p-4">
                      <nav className="space-y-2" dir={isHe ? "rtl" : "ltr"}>
                        {headings.map((heading) => (
                          <button
                            key={heading.id}
                            type="button"
                            onClick={() => {
                              setMobileTocOpen(false);
                              scrollToHeading(heading.id);
                            }}
                            className="w-full text-left block text-sm text-slate-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-1.5"
                          >
                            {heading.text}
                          </button>
                        ))}
                      </nav>
                    </Card>
                  )}
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="mb-8 pb-6 border-b border-slate-200 dark:border-surface-700">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-surface-400 mb-4">
                    <span className="px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium">
                      {category}
                    </span>
                    <time dateTime={date} className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(date).toLocaleDateString(isHe ? "he-IL" : "en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    {readingTime && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {readingTime} {isHe ? "דקות קריאה" : "min read"}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-surface-700">
                    <span className="text-sm font-medium text-slate-700 dark:text-surface-300">
                      {isHe ? "שתף:" : "Share:"}
                    </span>
                    <button
                      onClick={shareToTwitter}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-800 transition-colors"
                      aria-label="Share on Twitter"
                    >
                      <svg className="w-5 h-5 text-slate-600 dark:text-surface-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </button>
                    <button
                      onClick={shareToLinkedIn}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-800 transition-colors"
                      aria-label="Share on LinkedIn"
                    >
                      <svg className="w-5 h-5 text-slate-600 dark:text-surface-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </button>
                    <button
                      onClick={shareToFacebook}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-800 transition-colors"
                      aria-label="Share on Facebook"
                    >
                      <svg className="w-5 h-5 text-slate-600 dark:text-surface-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </button>
                    <button
                      onClick={copyLink}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-800 transition-colors"
                      aria-label="Copy link"
                    >
                      <svg className="w-5 h-5 text-slate-600 dark:text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <Card glow>
                  <CardContent className="p-8 md:p-12">
                    <article
                      ref={articleRef}
                      className="prose-article"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  </CardContent>
                </Card>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 glass-card p-8 rounded-2xl bg-white dark:bg-surface-800/50 border border-slate-200 dark:border-white/10"
          >
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-4 text-center leading-tight tracking-tight">
              {t("blogPost.cta.title") as string} <span className="gradient-text">{t("blogPost.cta.titleSpan") as string}</span>
            </h3>
            <p className="text-slate-600 dark:text-surface-300 mb-6 text-base md:text-lg leading-relaxed">
              {t("blogPost.cta.description") as string}
            </p>
            <Link href="/contact">
              <Button size="lg" className="group">
                <span className="relative z-10 flex items-center gap-2">
                  {t("blogPost.cta.button") as string}
                  <svg className="w-5 h-5 transition-transform rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Button>
            </Link>
          </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mt-12 glass-card p-8 rounded-2xl bg-white dark:bg-surface-800/50 border border-slate-200 dark:border-white/10"
                >
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-4 text-center leading-tight tracking-tight">
                    {t("blogPost.cta.title") as string} <span className="gradient-text">{t("blogPost.cta.titleSpan") as string}</span>
                  </h3>
                  <p className="text-slate-600 dark:text-surface-300 mb-6 text-base md:text-lg leading-relaxed text-center">
                    {t("blogPost.cta.description") as string}
                  </p>
                  <div className="flex justify-center">
                    <Link href="/contact">
                      <Button size="lg" className="group">
                        <span className="relative z-10 flex items-center gap-2">
                          {t("blogPost.cta.button") as string}
                          <svg className="w-5 h-5 transition-transform rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            </main>
          </div>

          {relatedPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-20"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white font-display mb-12 text-center leading-tight tracking-tight">
                {t("blog.relatedPosts.title") as string} <span className="gradient-text">{t("blog.relatedPosts.span") as string}</span>
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost, index) => (
                  <motion.div
                    key={relatedPost.slug}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link href={`/blog/${relatedPost.slug}`}>
                      <Card hover glow className="h-full group relative overflow-hidden">
                        <CardContent className="p-6">
                          <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-base md:text-lg leading-tight">
                            {relatedPost.title}
                          </h3>
                          <p className="text-xs md:text-sm text-slate-600 dark:text-surface-300 leading-relaxed">{relatedPost.excerpt}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
};

