"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const { t, mounted } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setSolutionsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSolutionsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (solutionsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [solutionsOpen]);

  const navigation = mounted ? [
    { name: t("nav.home") as string, href: "/" },
    { name: t("nav.services") as string, href: "#", submenu: [
      { name: t("servicesOverview.shopify.title") as string, href: "/solutions/shopify" },
      { name: t("servicesOverview.wordpress.title") as string, href: "/solutions/wordpress" },
    ]},
    { name: t("nav.about") as string, href: "/about" },
    { name: t("nav.blog") as string, href: "/blog" },
    { name: t("nav.contact") as string, href: "/contact" },
  ] : [
    { name: "Home", href: "/" },
    { name: "Services", href: "#", submenu: [
      { name: "Shopify Solutions", href: "/solutions/shopify" },
      { name: "WordPress Solutions", href: "/solutions/wordpress" },
    ]},
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-surface-900/80 border-b border-slate-200 dark:border-white/5 supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-surface-900/70 transition-all duration-300 shadow-sm dark:shadow-premium">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex items-center justify-between h-18 md:h-20">
          <Logo size="md" />

          <div className="hidden md:flex md:items-center md:gap-8 lg:gap-10">
            {navigation.map((item) => {
              if (item.submenu) {
                return (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setSolutionsOpen(true)}
                    onMouseLeave={() => setSolutionsOpen(false)}
                    ref={dropdownRef}
                  >
                    <button
                      ref={buttonRef}
                      className="text-slate-700 dark:text-surface-200 hover:text-slate-900 dark:hover:text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded px-2 py-1"
                      aria-expanded={solutionsOpen}
                      aria-haspopup="true"
                      onClick={() => setSolutionsOpen(!solutionsOpen)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSolutionsOpen(!solutionsOpen);
                        }
                        if (e.key === "ArrowDown" && !solutionsOpen) {
                          e.preventDefault();
                          setSolutionsOpen(true);
                        }
                      }}
                    >
                      {item.name}
                    </button>
                    <AnimatePresence>
                      {solutionsOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full start-0 mt-2 w-64 glass-card border border-white/10 py-2 shadow-premium"
                          role="menu"
                        >
                          {item.submenu.map((subItem, index) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="block px-5 py-3 text-sm text-slate-700 dark:text-surface-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors font-medium text-start focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
                              role="menuitem"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Escape") {
                                  setSolutionsOpen(false);
                                  buttonRef.current?.focus();
                                }
                                if (e.key === "ArrowDown" && index < item.submenu.length - 1) {
                                  e.preventDefault();
                                  (e.currentTarget.nextElementSibling as HTMLElement)?.focus();
                                }
                                if (e.key === "ArrowUp" && index > 0) {
                                  e.preventDefault();
                                  (e.currentTarget.previousElementSibling as HTMLElement)?.focus();
                                }
                              }}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-slate-700 dark:text-surface-300 hover:text-slate-900 dark:hover:text-white font-semibold transition-colors px-2 py-1"
                >
                  {item.name}
                </Link>
              );
            })}
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <ThemeToggle />
              <Link href="/contact">
                <Button size="sm" className="shadow-premium hover:shadow-premium-hover">{mounted ? (t("common.getStarted") as string) : "Get Started"}</Button>
              </Link>
            </div>
          </div>

          <button
            type="button"
            className="md:hidden p-2 text-slate-700 dark:text-surface-200 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/5 py-4"
            >
              <div className="space-y-2">
                {navigation.map((item) => {
                  if (item.submenu) {
                    return (
                      <div key={item.name} className="space-y-1">
                            <div className="px-4 py-2 text-slate-900 dark:text-surface-200 font-bold">{item.name}</div>
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                              className="block px-8 py-2.5 text-sm text-slate-600 dark:text-surface-400 hover:bg-slate-100 dark:hover:bg-accent-500/10 hover:text-accent-600 dark:hover:text-accent-400 transition-colors font-medium text-start"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    );
                  }
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block px-4 py-2.5 text-slate-700 dark:text-surface-300 hover:bg-slate-100 dark:hover:bg-accent-500/10 hover:text-accent-600 dark:hover:text-accent-400 transition-colors font-semibold text-start"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  );
                })}
                <div className="px-4 pt-4 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                     <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Settings</span>
                     <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <ThemeToggle />
                     </div>
                  </div>
                  <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full">{mounted ? (t("common.getStarted") as string) : "Get Started"}</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

