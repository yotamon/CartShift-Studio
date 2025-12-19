'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { logError } from '@/lib/logger';

interface RelatedPost {
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
  readingTime,
}) => {
  const { t, language } = useLanguage();
  const isHe = language === 'he';
  const [readingProgress, setReadingProgress] = useState(0);
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  const processedContentRef = useRef<string>('');

  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;

    // Initialize interactive checkboxes
    const initializeCheckboxes = () => {
      const checkboxes = article.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
      if (checkboxes.length === 0) return;

      // First, remove disabled attribute from all checkboxes
      checkboxes.forEach(checkbox => {
        checkbox.removeAttribute('disabled');
        checkbox.disabled = false;
      });

      // Use a more reliable storage key based on the page URL
      const storageKey =
        typeof window !== 'undefined'
          ? `blog-checklist-${window.location.pathname.replace(/\//g, '-')}`
          : `blog-checklist-${title.replace(/\s+/g, '-').toLowerCase()}`;

      // Load saved state from localStorage
      const savedState = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
      const savedChecks: Record<string, boolean> = savedState ? JSON.parse(savedState) : {};

      checkboxes.forEach(checkbox => {
        const checkboxId = checkbox.id;

        // Restore saved state
        if (savedChecks[checkboxId] !== undefined) {
          checkbox.checked = savedChecks[checkboxId];
        }
        // Always initialize the visual state
        updateCheckboxState(checkbox);

        // Add change handler - this fires after the checkbox state changes
        const handleChange = (_e: Event) => {
          // Don't prevent default - let the checkbox toggle naturally
          // Update visual state based on current checked property
          requestAnimationFrame(() => {
            updateCheckboxState(checkbox);

            // Save to localStorage
            savedChecks[checkboxId] = checkbox.checked;
            if (typeof window !== 'undefined') {
              localStorage.setItem(storageKey, JSON.stringify(savedChecks));
            }
          });
        };

        // Listen to change event (fires after checkbox state changes)
        checkbox.addEventListener('change', handleChange);
      });
    };

    const updateCheckboxState = (checkbox: HTMLInputElement) => {
      const listItem = checkbox.closest('.task-list-item');
      if (!listItem) return;

      // Update the checked attribute to ensure CSS :checked selector works
      if (checkbox.checked) {
        checkbox.setAttribute('checked', 'checked');
        listItem.classList.remove('task-incomplete');
        listItem.classList.add('task-complete');
      } else {
        checkbox.removeAttribute('checked');
        listItem.classList.remove('task-complete');
        listItem.classList.add('task-incomplete');
      }
    };

    const processHeadings = () => {
      // Skip if we've already processed this exact content
      if (processedContentRef.current === content) return;

      const h2Elements = article.querySelectorAll('h2');
      const extractedHeadings = Array.from(h2Elements).map((h2, index) => {
        const rawText = h2.textContent || '';
        // Remove leading numbers like "1.", "2.", "1)", etc. from the heading text
        const text = rawText.replace(/^\d+[\.\)\:]\s*/, '').trim();
        let id = text
          .toLowerCase()
          .replace(/[^a-z0-9\u0590-\u05FF]+/g, '-')
          .replace(/^-+|-+$/g, '');
        if (!id || id.length === 0) {
          id = `heading-${index}`;
        }

        // Only set id and styles if not already set to avoid triggering MutationObserver
        if (!h2.id) {
          h2.id = id;
        }
        if (!h2.style.scrollMarginTop) {
          h2.style.scrollMarginTop = '120px';
        }
        if (!h2.style.scrollPaddingTop) {
          h2.style.scrollPaddingTop = '120px';
        }

        return {
          id,
          text,
          level: 2,
        };
      });
      setHeadings(extractedHeadings);
      processedContentRef.current = content;
    };

    // Small delay to ensure DOM is updated after dangerouslySetInnerHTML
    const timer = setTimeout(() => {
      processHeadings();
      initializeCheckboxes();
    }, 100);

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight - windowHeight;
          const scrollTop = window.scrollY;
          const progress = (scrollTop / documentHeight) * 100;
          setReadingProgress(Math.min(100, Math.max(0, progress)));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [content]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = title;

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  const shareToLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch (err) {
      logError('Failed to copy link', err);
    }
  };

  const scrollToHeading = (headingId: string) => {
    setTimeout(() => {
      let element = document.getElementById(headingId);

      if (!element && articleRef.current) {
        const h2Elements = articleRef.current.querySelectorAll('h2');
        const matchingHeading = Array.from(h2Elements).find(h2 => {
          const rawText = h2.textContent || '';
          // Remove leading numbers like "1.", "2.", "1)", etc. - same as in processHeadings
          const text = rawText.replace(/^\d+[\.\)\:]\s*/, '').trim();
          const id = text
            .toLowerCase()
            .replace(/[^a-z0-9\u0590-\u05FF]+/g, '-')
            .replace(/^-+|-+$/g, '');
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
          behavior: 'smooth',
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
            <aside className="lg:col-span-3 hidden lg:block relative">
              <div className="lg:sticky lg:top-28">
                {headings.length > 0 && (
                  <Card className="p-6 mb-6">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-primary-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h7"
                        />
                      </svg>
                      {isHe ? 'תוכן עניינים' : 'Contents'}
                    </h3>
                    <nav className="space-y-1" dir={isHe ? 'rtl' : 'ltr'}>
                      {headings.map((heading, index) => (
                        <button
                          key={heading.id}
                          type="button"
                          onClick={() => scrollToHeading(heading.id)}
                          className="w-full text-start block text-sm text-slate-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all py-2 ps-3 border-s-2 border-slate-200 dark:border-surface-700 hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 rounded-e-lg group"
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 dark:text-surface-500 font-mono group-hover:text-primary-500 transition-colors">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="line-clamp-2">{heading.text}</span>
                          </span>
                        </button>
                      ))}
                    </nav>
                  </Card>
                )}

                {/* Quick Actions */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border border-primary-200/50 dark:border-primary-800/30">
                  <p className="text-xs font-medium text-slate-600 dark:text-surface-400 mb-3 uppercase tracking-wider">
                    {isHe ? 'שתף מאמר' : 'Share Article'}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={shareToTwitter}
                      className="flex-1 p-2.5 rounded-lg bg-white dark:bg-surface-800 hover:bg-slate-50 dark:hover:bg-surface-700 transition-colors border border-slate-200 dark:border-surface-700 group"
                      aria-label="Share on Twitter"
                    >
                      <svg
                        className="w-4 h-4 mx-auto text-slate-500 dark:text-surface-400 group-hover:text-[#1DA1F2] transition-colors"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </button>
                    <button
                      onClick={shareToLinkedIn}
                      className="flex-1 p-2.5 rounded-lg bg-white dark:bg-surface-800 hover:bg-slate-50 dark:hover:bg-surface-700 transition-colors border border-slate-200 dark:border-surface-700 group"
                      aria-label="Share on LinkedIn"
                    >
                      <svg
                        className="w-4 h-4 mx-auto text-slate-500 dark:text-surface-400 group-hover:text-[#0A66C2] transition-colors"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </button>
                    <button
                      onClick={copyLink}
                      className="flex-1 p-2.5 rounded-lg bg-white dark:bg-surface-800 hover:bg-slate-50 dark:hover:bg-surface-700 transition-colors border border-slate-200 dark:border-surface-700 group"
                      aria-label="Copy link"
                    >
                      <svg
                        className="w-4 h-4 mx-auto text-slate-500 dark:text-surface-400 group-hover:text-primary-500 transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            <main className="lg:col-span-9">
              {/* Mobile TOC */}
              {headings.length > 0 && (
                <div className="lg:hidden mb-8">
                  <button
                    onClick={() => setMobileTocOpen(!mobileTocOpen)}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all shadow-sm"
                  >
                    <span className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                      <svg
                        className="w-5 h-5 text-primary-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h7"
                        />
                      </svg>
                      {isHe ? 'תוכן עניינים' : 'Table of Contents'}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 px-2 py-0.5 rounded-full">
                        {headings.length} {isHe ? 'חלקים' : 'sections'}
                      </span>
                      <svg
                        className={`w-5 h-5 text-slate-500 dark:text-surface-400 transition-transform duration-300 ${mobileTocOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>
                  {mobileTocOpen && (
                    <Card className="mt-3 p-5 animate-in slide-in-from-top-2 duration-200">
                      <nav className="space-y-1" dir={isHe ? 'rtl' : 'ltr'}>
                        {headings.map((heading, index) => (
                          <button
                            key={heading.id}
                            type="button"
                            onClick={() => {
                              setMobileTocOpen(false);
                              scrollToHeading(heading.id);
                            }}
                            className="w-full text-start flex items-center gap-3 text-sm text-slate-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 py-2.5 px-3 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all"
                          >
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 dark:bg-surface-700 text-slate-500 dark:text-surface-400 text-xs font-semibold flex items-center justify-center">
                              {index + 1}
                            </span>
                            <span className="line-clamp-1">{heading.text}</span>
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
                {/* Article Meta Card */}
                <div className="mb-10 p-6 rounded-2xl bg-gradient-to-br from-white via-white to-slate-50 dark:from-surface-800 dark:via-surface-800 dark:to-surface-900 border border-slate-200 dark:border-surface-700 shadow-sm">
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-sm">
                      {category}
                    </span>
                    <time
                      dateTime={date}
                      className="flex items-center gap-2 text-slate-600 dark:text-surface-400"
                    >
                      <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-surface-700">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </span>
                      <span className="font-medium">
                        {new Date(date).toLocaleDateString(isHe ? 'he-IL' : 'en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </time>
                    {readingTime && (
                      <span className="flex items-center gap-2 text-slate-600 dark:text-surface-400">
                        <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-surface-700">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </span>
                        <span className="font-medium">
                          {readingTime} {isHe ? 'דקות קריאה' : 'min read'}
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Mobile Share Buttons */}
                  <div className="lg:hidden flex items-center gap-3 pt-4 mt-4 border-t border-slate-200 dark:border-surface-700">
                    <span className="text-sm font-medium text-slate-600 dark:text-surface-400">
                      {isHe ? 'שתף:' : 'Share:'}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={shareToTwitter}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-surface-700 transition-colors group"
                        aria-label="Share on Twitter"
                      >
                        <svg
                          className="w-5 h-5 text-slate-500 dark:text-surface-400 group-hover:text-[#1DA1F2] transition-colors"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </button>
                      <button
                        onClick={shareToLinkedIn}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-surface-700 transition-colors group"
                        aria-label="Share on LinkedIn"
                      >
                        <svg
                          className="w-5 h-5 text-slate-500 dark:text-surface-400 group-hover:text-[#0A66C2] transition-colors"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </button>
                      <button
                        onClick={shareToFacebook}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-surface-700 transition-colors group"
                        aria-label="Share on Facebook"
                      >
                        <svg
                          className="w-5 h-5 text-slate-500 dark:text-surface-400 group-hover:text-[#1877F2] transition-colors"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </button>
                      <button
                        onClick={copyLink}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-surface-700 transition-colors group"
                        aria-label="Copy link"
                      >
                        <svg
                          className="w-5 h-5 text-slate-500 dark:text-surface-400 group-hover:text-primary-500 transition-colors"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Main Article Card */}
                <Card className="overflow-hidden">
                  <CardContent className="p-6 sm:p-8 md:p-10 lg:p-12">
                    <article
                      ref={articleRef}
                      className="prose-article"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  </CardContent>
                </Card>

                {/* Related Services Box */}
                {category && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="mt-12 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-surface-800 dark:via-surface-800/50 dark:to-surface-900 border border-slate-200 dark:border-surface-700 relative overflow-hidden"
                  >
                    {/* Decorative element */}
                    <div className="absolute top-0 end-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30">
                          <svg
                            className="w-6 h-6 text-primary-600 dark:text-primary-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2">
                            {category === 'Shopify'
                              ? (t('blogPost.relatedServices.shopifyTitle') as string)
                              : category === 'WordPress'
                                ? (t('blogPost.relatedServices.wordpressTitle') as string)
                                : (t('blogPost.relatedServices.title') as string)}
                          </h3>
                          <p className="text-slate-600 dark:text-surface-300 mb-4 text-sm md:text-base">
                            {category === 'Shopify'
                              ? (t('blogPost.relatedServices.shopifyDescription') as string)
                              : category === 'WordPress'
                                ? (t('blogPost.relatedServices.wordpressDescription') as string)
                                : (t('blogPost.relatedServices.description') as string)}
                          </p>
                          <div className="flex flex-wrap gap-3">
                            {category === 'Shopify' ? (
                              <Link
                                href="/solutions/shopify"
                                className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold text-sm group"
                              >
                                {t('blogPost.relatedServices.shopifyLink') as string}
                                <svg
                                  className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                  />
                                </svg>
                              </Link>
                            ) : category === 'WordPress' ? (
                              <Link
                                href="/solutions/wordpress"
                                className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold text-sm group"
                              >
                                {t('blogPost.relatedServices.wordpressLink') as string}
                                <svg
                                  className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                  />
                                </svg>
                              </Link>
                            ) : (
                              <>
                                <Link
                                  href="/solutions/shopify"
                                  className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold text-sm group"
                                >
                                  {t('blogPost.relatedServices.shopifyServices') as string}
                                  <svg
                                    className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                                    />
                                  </svg>
                                </Link>
                                <span className="text-slate-300 dark:text-surface-600">|</span>
                                <Link
                                  href="/solutions/wordpress"
                                  className="inline-flex items-center gap-2 text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 font-semibold text-sm group"
                                >
                                  {t('blogPost.relatedServices.wordpressServices') as string}
                                  <svg
                                    className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                                    />
                                  </svg>
                                </Link>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* CTA Banner */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mt-12 relative"
                >
                  {/* Animated gradient border wrapper */}
                  <div className="absolute -inset-[2px] bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 rounded-2xl opacity-75 blur-sm animate-gradient-x" />
                  <div className="absolute -inset-[1px] bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 rounded-2xl opacity-90 animate-gradient-x" />

                  {/* Inner content */}
                  <div className="relative rounded-2xl p-8 md:p-10 lg:p-12 bg-white dark:bg-surface-900 text-center overflow-hidden">
                    {/* Inner decorative orb */}
                    <div className="absolute top-0 start-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-b from-primary-500/10 to-transparent rounded-full blur-3xl" />

                    {/* Floating geometric shapes */}
                    <motion.div
                      className="absolute top-8 start-[10%] w-12 h-12 border border-primary-500/20 rounded-lg"
                      animate={{
                        rotate: [0, 90, 0],
                        y: [0, -10, 0],
                      }}
                      transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div
                      className="absolute bottom-8 end-[10%] w-10 h-10 border border-accent-500/20 rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    <div className="relative z-10 space-y-5">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 text-primary-700 dark:text-primary-300 text-xs font-semibold tracking-wide uppercase">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                          />
                        </svg>
                        {isHe ? 'שירותי מומחים' : 'Expert Services'}
                      </div>

                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                        {t('blogPost.cta.title') as string}{' '}
                        <span className="gradient-text text-glow-subtle">
                          {t('blogPost.cta.titleSpan') as string}
                        </span>
                      </h3>

                      <p className="text-base md:text-lg text-slate-600 dark:text-surface-300 font-light leading-relaxed max-w-2xl mx-auto">
                        {t('blogPost.cta.description') as string}
                      </p>

                      <div className="pt-2">
                        <Link href="/contact">
                          <Button
                            size="lg"
                            variant="secondary"
                            className="text-base md:text-lg px-8 md:px-12 py-4 md:py-5 font-bold shadow-glow-primary group"
                          >
                            <span className="flex items-center gap-3 justify-center">
                              {t('blogPost.cta.button') as string}
                              <motion.svg
                                className="w-5 h-5 rtl:rotate-180"
                                animate={{ x: isHe ? [-5, 0] : [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                                />
                              </motion.svg>
                            </span>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </main>
          </div>

          {/* Related Posts Section */}
          {relatedPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-20 pt-16 border-t border-slate-200 dark:border-surface-700"
            >
              <div className="text-center mb-12">
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-4">
                  {isHe ? 'המשך לקרוא' : 'Keep Reading'}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white font-display leading-tight tracking-tight">
                  {t('blog.relatedPosts.title') as string}{' '}
                  <span className="gradient-text">{t('blog.relatedPosts.span') as string}</span>
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                {relatedPosts.map((relatedPost, index) => {
                  const postTitle =
                    isHe && relatedPost.translation?.title
                      ? relatedPost.translation.title
                      : relatedPost.title;
                  const postCategory =
                    isHe && relatedPost.translation?.category
                      ? relatedPost.translation.category
                      : relatedPost.category;
                  const postExcerpt =
                    isHe && relatedPost.translation?.excerpt
                      ? relatedPost.translation.excerpt
                      : relatedPost.excerpt;
                  const formattedDate = new Date(relatedPost.date).toLocaleDateString(
                    language === 'he' ? 'he-IL' : 'en-US'
                  );

                  return (
                    <motion.article
                      key={relatedPost.slug}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-100px' }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Link href={`/blog/${relatedPost.slug}`} className="block h-full">
                        <Card className="h-full !p-6">
                          <CardHeader>
                            <div className="flex items-center justify-between mb-3">
                              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                                {postCategory}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-surface-400 font-medium">
                                {formattedDate}
                              </span>
                            </div>
                            <CardTitle className="text-base font-semibold text-slate-900 dark:text-white line-clamp-2 leading-snug mb-2">
                              {postTitle}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="mb-4 text-sm text-slate-600 dark:text-surface-300 leading-relaxed line-clamp-4">
                              {postExcerpt}
                            </p>
                            <span className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold text-sm">
                              {t('blog.readMore') as string}
                              <svg
                                className="w-4 h-4 rtl:rotate-180"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                                />
                              </svg>
                            </span>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.article>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
};
