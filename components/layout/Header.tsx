'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Icon } from '@/components/ui/Icon';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useTheme } from 'next-themes';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const [mobileCompanyOpen, setMobileCompanyOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const t = useTranslations();
  const { resolvedTheme } = useTheme();
  const { user } = usePortalAuth();
  const isDark = resolvedTheme === 'dark';
  const isLoggedIn = !!user;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const companyDropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const companyButtonRef = useRef<HTMLButtonElement>(null);
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
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setSolutionsOpen(false);
      }
      if (
        companyDropdownRef.current &&
        !companyDropdownRef.current.contains(event.target as Node) &&
        companyButtonRef.current &&
        !companyButtonRef.current.contains(event.target as Node)
      ) {
        setCompanyOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSolutionsOpen(false);
        setCompanyOpen(false);
        buttonRef.current?.focus();
        companyButtonRef.current?.focus();
      }
    };

    if (solutionsOpen || companyOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [solutionsOpen, companyOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      setMobileSolutionsOpen(false);
      setMobileCompanyOpen(false);
    }
  }, [mobileMenuOpen]);

  const navigation = [
    { name: t('nav.home'), href: '/' },
    {
      name: t('nav.services'),
      href: '#',
      submenu: [
        { name: t('servicesOverview.shopify.title'), href: '/solutions/shopify' },
        { name: t('servicesOverview.wordpress.title'), href: '/solutions/wordpress' },
        { name: t('nav.maintenance'), href: '/maintenance' },
      ],
    },
    {
      name: t('nav.company'),
      href: '#',
      submenu: [
        { name: t('nav.work'), href: '/work' },
        { name: t('nav.pricing'), href: '/pricing' },
        { name: t('nav.about'), href: '/about' },
      ],
    },
    { name: t('nav.blog'), href: '/blog' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{
        y: isVisible ? 0 : -100,
      }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={`
        fixed top-0 start-0 end-0 z-50
        transition-all duration-300 ease-out
        ${
          isAtTop
            ? 'bg-transparent border-transparent shadow-none'
            : 'border-b border-surface-200/40 dark:border-white/8'
        }
      `}
      style={{
        backdropFilter: isAtTop ? 'none' : 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: isAtTop ? 'none' : 'blur(20px) saturate(180%)',
        backgroundColor: 'transparent',
        boxShadow: isAtTop
          ? 'none'
          : isDark
            ? '0 4px 24px -8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
            : '0 4px 24px -8px rgba(30, 41, 59, 0.1), 0 2px 8px -4px rgba(30, 41, 59, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
      }}
    >
      {/* Top highlight line when scrolled */}
      {!isAtTop && (
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/15 pointer-events-none" />
      )}

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex items-center justify-between h-16 md:h-18">
          <Logo size="md" />

          <div className="hidden md:flex md:items-center md:gap-6 lg:gap-8">
            {navigation.map(item => {
              if (item.submenu) {
                const isCompany = item.name === t('nav.company');
                const isOpen = isCompany ? companyOpen : solutionsOpen;
                const setIsOpen = isCompany ? setCompanyOpen : setSolutionsOpen;
                const ref = isCompany ? companyDropdownRef : dropdownRef;
                const buttonRefToUse = isCompany ? companyButtonRef : buttonRef;

                return (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                    ref={ref}
                  >
                    <button
                      ref={buttonRefToUse}
                      className="text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded px-2 py-1"
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      onClick={() => setIsOpen(!isOpen)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setIsOpen(!isOpen);
                        }
                        if (e.key === 'ArrowDown' && !isOpen) {
                          e.preventDefault();
                          setIsOpen(true);
                        }
                      }}
                    >
                      {item.name}
                    </button>
                    <AnimatePresence>
                      {isOpen && (
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
                              className="block px-5 py-3 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100/50 dark:hover:bg-white/5 hover:text-surface-900 dark:hover:text-white transition-colors font-medium text-start focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset first:rounded-t-2xl last:rounded-b-2xl"
                              role="menuitem"
                              tabIndex={0}
                              onKeyDown={e => {
                                if (e.key === 'Escape') {
                                  setIsOpen(false);
                                  buttonRefToUse.current?.focus();
                                }
                                if (e.key === 'ArrowDown' && index < item.submenu.length - 1) {
                                  e.preventDefault();
                                  (e.currentTarget.nextElementSibling as HTMLElement)?.focus();
                                }
                                if (e.key === 'ArrowUp' && index > 0) {
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
                  className="text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white font-medium transition-colors px-2 py-1"
                >
                  {item.name}
                </Link>
              );
            })}
            <div className="flex items-center gap-3">
              <Link
                href={isLoggedIn ? '/portal/org' : '/portal/login'}
                className="text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white font-medium transition-colors px-2 py-1"
              >
                {isLoggedIn ? t('nav.portal') : t('nav.login')}
              </Link>
              <LanguageSwitcher />
              <ThemeToggle />
              <Link href="/contact">
                <Button size="sm" className="shadow-premium hover:shadow-premium-hover">
                  {t('common.getStarted')}
                </Button>
              </Link>
            </div>
          </div>

          <button
            type="button"
            className="md:hidden p-3 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-white/5 hover:text-surface-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded transition-colors touch-manipulation"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <Icon name={mobileMenuOpen ? 'x' : 'menu'} size={24} />
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
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden fixed top-[4.5rem] md:top-20 inset-x-0 bottom-0 z-50 backdrop-blur-xl border-t border-white/5 flex flex-col overflow-hidden bg-white/95 dark:bg-surface-950/95"
              style={{
                minHeight: 'calc(100dvh - 4.5rem)',
              }}
            >
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 portal-scrollbar no-overscroll-y">
                <div className="space-y-2">
                  {navigation.map(item => {
                    if (item.submenu) {
                      const isCompany = item.name === t('nav.company');
                      const isSolutions = item.name === t('nav.services');
                      const isExpanded = isCompany
                        ? mobileCompanyOpen
                        : isSolutions
                          ? mobileSolutionsOpen
                          : false;
                      const setIsExpanded = isCompany
                        ? setMobileCompanyOpen
                        : isSolutions
                          ? setMobileSolutionsOpen
                          : () => {};

                      return (
                        <div key={item.name} className="space-y-1">
                          <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="w-full flex items-center justify-between px-4 py-2 text-surface-800 dark:text-surface-200 font-medium hover:bg-surface-100 dark:hover:bg-accent-500/10 transition-colors text-start"
                          >
                            <span>{item.name}</span>
                            <Icon
                              name={isExpanded ? 'chevron-up' : 'chevron-down'}
                              size={20}
                              className="text-surface-500 dark:text-surface-400"
                            />
                          </button>
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                {item.submenu.map(subItem => (
                                  <Link
                                    key={subItem.name}
                                    href={subItem.href}
                                    className="block px-8 py-2.5 text-sm text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-accent-500/10 hover:text-accent-600 dark:hover:text-accent-400 transition-colors font-normal text-start"
                                    onClick={() => setMobileMenuOpen(false)}
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
                        className="block px-4 py-3.5 min-h-[48px] text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-accent-500/10 hover:text-accent-600 dark:hover:text-accent-400 transition-colors font-medium text-start rounded-xl active:scale-[0.98] touch-manipulation"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
              <div className="flex-shrink-0 px-4 sm:px-6 py-4 pb-safe border-t border-white/10 dark:border-surface-800/50 bg-white/50 dark:bg-surface-950/50 backdrop-blur-md">
                <div className="flex flex-col gap-4">
                  <Link
                    href={isLoggedIn ? '/portal/org' : '/portal/login'}
                    className="block px-4 py-3.5 min-h-[48px] text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-accent-500/10 hover:text-accent-600 dark:hover:text-accent-400 transition-colors font-medium text-start rounded-xl active:scale-[0.98] touch-manipulation"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {isLoggedIn ? t('nav.portal') : t('nav.login')}
                  </Link>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-surface-600 dark:text-surface-400">
                      {t('nav.settings' as any)}
                    </span>
                    <div className="flex items-center gap-3">
                      <LanguageSwitcher />
                      <ThemeToggle />
                    </div>
                  </div>
                  <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full">
                      {t('common.getStarted')}
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
