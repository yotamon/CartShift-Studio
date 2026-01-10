'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from '@/lib/motion';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Icon } from '@/components/ui/Icon';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';
import { cn } from '@/lib/utils';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const [mobileCompanyOpen, setMobileCompanyOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const t = useTranslations();
  const { user } = usePortalAuth();
  const isLoggedIn = !!user;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const companyDropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const companyButtonRef = useRef<HTMLButtonElement>(null);
  // Smart scroll behavior using framer-motion's useScroll
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const diff = latest - previous;

    // Update at-top state
    setIsAtTop(latest < 10);

    // Close mobile menu on scroll down
    if (latest > 50 && diff > 5 && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }

    // Smart hide/show
    if (latest > 100) {
      if (diff > 10) setIsVisible(false);
      else if (diff < -10) setIsVisible(true);
    } else {
      setIsVisible(true);
    }
  });

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [mobileMenuOpen]);

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

  const navigation = useMemo(() => [
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
  ], [t]);

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{
        y: isVisible ? 0 : -100,
      }}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        "fixed top-0 start-0 end-0 z-50 transition-all duration-500",
        isAtTop
          ? "bg-transparent border-transparent"
          : "bg-white/70 dark:bg-surface-950/70 backdrop-blur-xl border-b border-surface-200/50 dark:border-white/5 shadow-premium"
      )}
    >
      {/* Top highlight line when scrolled */}
      {!isAtTop && (
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent pointer-events-none" />
      )}

      <nav className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12" aria-label="Top">
        <div className="flex items-center justify-between h-20 md:h-24">
          <div className="flex items-center gap-12">
            <Logo size="md" className="hover:scale-105 transition-transform duration-300" />

            <div className="hidden lg:flex items-center gap-8">
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
                      className="relative group/nav"
                      onMouseEnter={() => setIsOpen(true)}
                      onMouseLeave={() => setIsOpen(false)}
                      ref={ref}
                    >
                      <button
                        ref={buttonRefToUse}
                        className={cn(
                          "flex items-center gap-1.5 py-2 text-sm font-bold tracking-tight transition-all duration-300 focus:outline-none",
                          isOpen
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white"
                        )}
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                        onClick={() => setIsOpen(!isOpen)}
                      >
                        {item.name}
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          className="opacity-50 group-hover/nav:opacity-100"
                        >
                          <Icon name="chevron-down" size={14} />
                        </motion.span>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute top-full start-[-1rem] mt-2 w-72 z-[60] p-2 rounded-3xl bg-white/90 dark:bg-surface-900/90 backdrop-blur-2xl border border-surface-200/50 dark:border-white/10 shadow-2xl overflow-hidden"
                            role="menu"
                          >
                            <div className="grid gap-1">
                              {item.submenu.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  className="flex flex-col px-4 py-3 rounded-2xl hover:bg-surface-100/80 dark:hover:bg-white/5 group/sub transition-all duration-300"
                                  role="menuitem"
                                >
                                  <span className="text-sm font-bold text-surface-900 dark:text-white tracking-tight">
                                    {subItem.name}
                                  </span>
                                </Link>
                              ))}
                            </div>
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
                    className="relative py-2 text-sm font-bold tracking-tight text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white transition-all duration-300 group/link"
                  >
                    {item.name}
                    <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-500 scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300 origin-left" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2 p-1 bg-surface-100/50 dark:bg-white/5 rounded-2xl border border-surface-200/50 dark:border-white/5">
              <LanguageSwitcher />
              <div className="w-[1px] h-4 bg-surface-200 dark:bg-white/10 mx-1" />
              <ThemeToggle />
            </div>

            <Link href={isLoggedIn ? '/portal' : '/portal/login'}>
              <Button
                size="md"
                className="font-outfit font-black tracking-tight shadow-xl shadow-blue-500/20 active:scale-95 px-6"
              >
                {isLoggedIn ? (
                  <span className="flex items-center gap-2">
                    <Icon name="layout" size={18} />
                    {t('nav.portal')}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Icon name="user" size={18} />
                    {t('nav.login')}
                  </span>
                )}
              </Button>
            </Link>

            <button
              type="button"
              className="lg:hidden w-12 h-12 flex items-center justify-center text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-white/5 hover:text-surface-900 dark:hover:text-white focus:outline-none rounded-2xl transition-all active:scale-90"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <Icon name={mobileMenuOpen ? 'x' : 'menu'} size={24} />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-surface-950/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 end-0 bottom-0 w-[85vw] max-w-sm z-50 bg-white/95 dark:bg-surface-950/95 backdrop-blur-2xl border-s border-white/10 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between h-20 px-6 border-b border-surface-200 dark:border-white/5">
                <Logo size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-100 dark:bg-white/5 text-surface-500"
                >
                  <Icon name="x" size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
                <div className="space-y-4">
                  {navigation.map(item => {
                    if (item.submenu) {
                      const isCompany = item.name === t('nav.company');
                      const isExpanded = isCompany ? mobileCompanyOpen : mobileSolutionsOpen;
                      const setIsExpanded = isCompany ? setMobileCompanyOpen : setMobileSolutionsOpen;

                      return (
                        <div key={item.name} className="space-y-2">
                          <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="w-full flex items-center justify-between py-2 text-lg font-black tracking-tight text-surface-900 dark:text-white"
                          >
                            <span>{item.name}</span>
                            <motion.span animate={{ rotate: isExpanded ? 180 : 0 }}>
                              <Icon name="chevron-down" size={20} className="text-surface-400" />
                            </motion.span>
                          </button>
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="ps-4 space-y-3"
                              >
                                {item.submenu.map(subItem => (
                                  <Link
                                    key={subItem.name}
                                    href={subItem.href}
                                    className="block py-2 text-surface-600 dark:text-surface-400 font-bold"
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
                        className="block py-2 text-lg font-black tracking-tight text-surface-900 dark:text-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>

                <div className="pt-8 border-t border-surface-200 dark:border-surface-800/50 space-y-6">
                  <div className="flex items-center gap-4">
                    <LanguageSwitcher />
                    <div className="w-px h-6 bg-surface-200 dark:bg-surface-800" />
                    <ThemeToggle />
                  </div>

                  <Link href={isLoggedIn ? '/portal' : '/portal/login'} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full h-14 text-lg">
                       {isLoggedIn ? t('nav.portal') : t('nav.login')}
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
