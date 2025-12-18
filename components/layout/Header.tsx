"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Icon } from "@/components/ui/Icon";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useTheme } from "@/components/providers/ThemeProvider";

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const { t, mounted } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Smart scroll behavior - hide on scroll down, show on scroll up
  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollY.current;

        // Close mobile menu on scroll
        if (mobileMenuOpen) {
          setMobileMenuOpen(false);
        }

        // Update at-top state
        setIsAtTop(currentScrollY < 10);

        // Only hide/show after scrolling past threshold (50px from top)
        if (currentScrollY > 50) {
          // Scrolling down - hide header
          if (scrollDelta > 5) {
            setIsVisible(false);
          }
          // Scrolling up - show header
          else if (scrollDelta < -5) {
            setIsVisible(true);
          }
        } else {
          // Always show when near top
          setIsVisible(true);
        }

        lastScrollY.current = currentScrollY;
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

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
      { name: t("nav.maintenance") as string || "Maintenance", href: "/maintenance" },
    ]},
    { name: t("nav.work") as string || "Work", href: "/work" },
    { name: t("nav.pricing") as string || "Pricing", href: "/pricing" },
    { name: t("nav.about") as string, href: "/about" },
    { name: t("nav.blog") as string, href: "/blog" },
    { name: t("nav.contact") as string, href: "/contact" },
  ] : [
    { name: "Home", href: "/" },
    { name: "Services", href: "#", submenu: [
      { name: "Shopify Solutions", href: "/solutions/shopify" },
      { name: "WordPress Solutions", href: "/solutions/wordpress" },
      { name: "Maintenance", href: "/maintenance" },
    ]},
    { name: "Work", href: "/work" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{
        y: isVisible ? 0 : -100,
      }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300 ease-out
        ${isAtTop
          ? "bg-transparent border-transparent shadow-none"
          : "border-b border-slate-300/50 dark:border-white/10"
        }
      `}
      style={{
        backdropFilter: isAtTop ? "none" : "blur(24px) saturate(180%)",
        WebkitBackdropFilter: isAtTop ? "none" : "blur(24px) saturate(180%)",
        backgroundColor: "transparent",
        boxShadow: isAtTop
          ? "none"
          : isDark
            ? "0 8px 32px -8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.2)"
            : "0 8px 32px -8px rgba(30, 41, 59, 0.15), 0 4px 12px -4px rgba(30, 41, 59, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.7), inset 0 -1px 0 rgba(148, 163, 184, 0.2)",
      }}
    >
      {/* Top highlight line when scrolled */}
      {!isAtTop && (
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/20 pointer-events-none" />
      )}

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
                          transition={{ duration: 0.2 }}
                          className="absolute top-full start-0 mt-2 w-64 z-[60] rounded-2xl py-2 border shadow-lg"
                          role="menu"
                          style={{
                            backdropFilter: 'blur(24px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                            backgroundColor: isDark
                              ? 'rgba(15, 23, 42, 0.8)'
                              : 'rgba(255, 255, 255, 0.8)',
                            borderColor: isDark
                              ? 'rgba(255, 255, 255, 0.1)'
                              : 'rgba(148, 163, 184, 0.3)',
                            boxShadow: isDark
                              ? '0 8px 32px -8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.2)'
                              : '0 8px 32px -8px rgba(30, 41, 59, 0.15), 0 4px 12px -4px rgba(30, 41, 59, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.7), inset 0 -1px 0 rgba(148, 163, 184, 0.2)',
                          }}
                        >
                          {item.submenu.map((subItem, index) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="block px-5 py-3 text-sm text-slate-700 dark:text-surface-300 hover:bg-slate-100/50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors font-medium text-start focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset first:rounded-t-2xl last:rounded-b-2xl"
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
            className="md:hidden p-3 text-slate-700 dark:text-surface-200 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded transition-colors touch-manipulation"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <Icon name={mobileMenuOpen ? "x" : "menu"} size={24} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-[4.5rem] md:top-20 inset-x-0 bottom-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/5 py-4 relative z-50 backdrop-blur-lg w-full"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

