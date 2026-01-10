'use client';

import { cva } from 'class-variance-authority';
import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter, Link } from '@/i18n/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  FolderOpen,
  Inbox,
  Kanban,
  LogOut,
  ChevronLeft,
  Loader2,
  AlertCircle,
  DollarSign,
  Calendar,
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from '@/lib/motion';
import { createPortal } from 'react-dom';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';
import { useOrg } from '@/lib/context/OrgContext';
import { logout, isLoggingOut } from '@/lib/services/auth';
import { useTranslations, useLocale } from 'next-intl';
import { getMemberByUserId, ensureMembership } from '@/lib/services/portal-organizations';
import { PortalButton } from './ui/PortalButton';
import {
  subscribeToNotifications,
  subscribeToUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '@/lib/services/portal-notifications';
import { Notification } from '@/lib/types/portal';
import {
  getLocaleDirection,
  getLocaleFontFamily,
  isRTLLocale,
} from '@/lib/locale-config';
import { OnboardingTour } from './OnboardingTour';
import { OfflineIndicator } from './ui/OfflineIndicator';
import { Breadcrumbs } from './ui/Breadcrumbs';
import { MobileSearch } from './ui/MobileSearch';
import { PortalHeader } from './ui/PortalHeader';
import { NotificationDropdown } from './ui/NotificationDropdown';

const navItemVariants = cva('portal-nav-item group relative transition-all duration-200', {
  variants: {
    isActive: {
      true: 'portal-nav-item-active text-blue-600 dark:text-blue-400 font-bold bg-blue-50/50 dark:bg-blue-500/10',
      false:
        'text-surface-600 dark:text-surface-400 hover:bg-surface-100/60 dark:hover:bg-surface-800/40 hover:text-surface-900 dark:hover:text-white',
    },
    isCollapsed: {
      true: 'md:justify-center md:px-0',
      false: '',
    },
  },
  defaultVariants: {
    isActive: false,
    isCollapsed: false,
  },
});

interface PortalShellProps {
  children: React.ReactNode;
  /** @deprecated orgId is now managed via OrgContext */
  orgId?: string;
  isAgency?: boolean;
}

export const PortalShell = ({
  children,
  orgId,
  isAgency: isAgencyPage = false,
}: PortalShellProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationPosition, setNotificationPosition] = useState<{
    top: number;
    right?: number;
    left?: number;
  }>({ top: 0, right: 0, left: 0 });
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // When mobile menu is open, always show expanded sidebar; on desktop, use isSidebarOpen state
  const isExpanded = isMobileMenuOpen || isSidebarOpen;
  const pathname = usePathname();
  const router = useRouter();
  const { userData, loading, isAuthenticated, accountType } = usePortalAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const t = useTranslations();
  const locale = useLocale();
  const notificationRef = useRef<HTMLDivElement>(null);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);

  const userId = userData?.id ?? null;

  // Get orgId from context instead of URL
  const { orgId: contextOrgId, hasMultipleOrgs, fullOrganizations, switchOrg } = useOrg();

  // Use context orgId, fallback to prop for backwards compatibility
  const effectiveOrgId = contextOrgId ?? orgId;

  useEffect(() => {
    let internalMounted = true;

    if (!loading) {
      if (!isAuthenticated) {
        // Only redirect to login if we're not actively logging out
        if (!isLoggingOut()) {
          router.push('/portal/login/');
        }
        return;
      }

      const checkAccess = async () => {
        try {
          if (effectiveOrgId && userData) {
            if (userData.isAgency || userData.accountType === 'AGENCY') {
              if (internalMounted) setIsAuthorized(true);
              return;
            }

            // CRITICAL: Skip check if orgId is 'template' to avoid backend errors
            if (effectiveOrgId === 'template') {
              console.warn(
                '[PortalShell] effectiveOrgId is "template". Skipping access check and allowing render.'
              );
              if (internalMounted) setIsAuthorized(true);
              return;
            }

            console.log(
              `[PortalShell] Checking access for orgId: ${effectiveOrgId}, userId: ${userData.id}`
            );

            let member = await getMemberByUserId(effectiveOrgId, userData.id);
            console.log(
              `[PortalShell] Initial membership check result:`,
              member ? 'found' : 'not found'
            );

            if (!member) {
              console.log(`[PortalShell] Attempting to ensure membership...`);
              member = await ensureMembership(
                effectiveOrgId,
                userData.id,
                userData.email,
                userData.name
              );
              console.log(`[PortalShell] After ensureMembership:`, member ? 'found' : 'not found');
            }

            if (internalMounted) setIsAuthorized(member !== null);

            if (!member) {
              console.warn(
                `[PortalShell] Access denied - No membership found for orgId: ${effectiveOrgId}, userId: ${userData.id}, userOrgs: ${JSON.stringify(userData.organizations)}`
              );
            }
          } else if (isAgencyPage && userData) {
            if (internalMounted)
              setIsAuthorized(Boolean(userData.isAgency) || userData.accountType === 'AGENCY');
          } else {
            if (internalMounted) setIsAuthorized(true);
          }
        } catch (error) {
          console.error('[PortalShell] Error checking access:', error);
          if (internalMounted) setIsAuthorized(false);
        }
      };

      checkAccess();
    }

    if (userData && !userData.isAgency && !userData.onboardingComplete && internalMounted) {
      setShowOnboarding(true);
    }

    return () => {
      internalMounted = false;
    };
  }, [loading, isAuthenticated, userData, effectiveOrgId, isAgencyPage, router]);

  useEffect(() => {
    setMounted(true);
    // Set sidebar CSS variables for responsive layout
    document.documentElement.style.setProperty('--sidebar-width-expanded', '280px');
    document.documentElement.style.setProperty('--sidebar-width-collapsed', '80px');
  }, []);

  // Touch swipe handler for mobile sidebar
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isMobileMenuOpen || touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX.current;
    const isRTL = isRTLLocale(locale);
    const swipeThreshold = 50;

    // Close sidebar on swipe in the appropriate direction
    const shouldClose = isRTL ? diff > swipeThreshold : diff < -swipeThreshold;
    if (shouldClose) {
      setIsMobileMenuOpen(false);
    }
    touchStartX.current = null;
  };

  useEffect(() => {
    const updatePosition = () => {
      if (notificationButtonRef.current && notificationDropdownRef.current) {
        const buttonRect = notificationButtonRef.current.getBoundingClientRect();
        const dropdownWidth = 384;
        const dropdownHeight = 450;
        const gap = 8;
        const padding = 16;
        const isRTL = document.documentElement.dir === 'rtl';
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const maxDropdownWidth = Math.min(dropdownWidth, viewportWidth - padding * 2);

        let top = buttonRect.bottom + gap;
        let right: number | undefined;
        let left: number | undefined;

        if (isRTL) {
          const spaceOnRight = viewportWidth - buttonRect.right;
          const spaceOnLeft = buttonRect.left;

          if (spaceOnRight >= maxDropdownWidth + padding) {
            right = viewportWidth - buttonRect.right;
            left = undefined;
          } else if (spaceOnLeft >= maxDropdownWidth + padding) {
            left = Math.max(padding, buttonRect.left - maxDropdownWidth);
            right = undefined;
          } else {
            right = padding;
            left = undefined;
          }

          if (right !== undefined) {
            const calculatedRight = right;
            const actualWidth = Math.min(
              maxDropdownWidth,
              viewportWidth - calculatedRight - padding
            );
            if (calculatedRight + actualWidth > viewportWidth - padding) {
              right = padding;
            }
          }
          if (left !== undefined && left < padding) {
            left = padding;
          }
        } else {
          const spaceOnRight = viewportWidth - buttonRect.right;
          const spaceOnLeft = buttonRect.left;

          if (spaceOnRight >= maxDropdownWidth + padding) {
            right = viewportWidth - buttonRect.right;
            left = undefined;
          } else if (spaceOnLeft >= maxDropdownWidth + padding) {
            left = Math.max(padding, buttonRect.left - maxDropdownWidth);
            right = undefined;
          } else {
            right = padding;
            left = undefined;
          }

          if (right !== undefined) {
            const calculatedRight = right;
            const actualWidth = Math.min(
              maxDropdownWidth,
              viewportWidth - calculatedRight - padding
            );
            if (calculatedRight + actualWidth > viewportWidth - padding) {
              right = padding;
            }
          }
          if (left !== undefined) {
            const actualWidth = Math.min(maxDropdownWidth, viewportWidth - left - padding);
            if (left + actualWidth > viewportWidth - padding) {
              left = viewportWidth - actualWidth - padding;
            }
            if (left < padding) {
              left = padding;
            }
          }
        }

        if (top + dropdownHeight > viewportHeight - padding) {
          top = Math.max(padding, buttonRect.top - dropdownHeight - gap);
        }
        if (top < padding) {
          top = padding;
        }

        setNotificationPosition({ top, right, left });
      }
    };

    if (isNotificationOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      const timeoutId = setTimeout(updatePosition, 0);
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
    return undefined;
  }, [isNotificationOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationButtonRef.current &&
        !notificationButtonRef.current.contains(event.target as Node) &&
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };

    if (isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
    return undefined;
  }, [isNotificationOpen]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!userId || !isAuthenticated || loading) return;

    let internalMounted = true;

    const unsubscribeNotifications = subscribeToNotifications(
      userId,
      data => {
        if (internalMounted) {
          setNotifications(data);
        }
      },
      { limit: 10 }
    );

    const unsubscribeUnreadCount = subscribeToUnreadCount(userId, count => {
      if (internalMounted) {
        setUnreadCount(count);
      }
    });

    return () => {
      internalMounted = false;
      unsubscribeNotifications();
      unsubscribeUnreadCount();
    };
  }, [userId, isAuthenticated, loading]);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
      setIsNotificationOpen(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!userData?.id) return;
    await markAllNotificationsAsRead(userData.id);
  };

  const handleSignOut = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navGroups =
    isAgencyPage || userData?.isAgency
      ? [
          {
            items: [
              {
                label: t('portal.sidebar.nav.inbox'),
                icon: Inbox,
                href: '/portal/agency/inbox/',
              },
              {
                label: t('portal.sidebar.nav.workboard'),
                icon: Kanban,
                href: '/portal/agency/workboard/',
              },
            ],
          },
          {
            items: [
              {
                label: t('portal.sidebar.nav.clients'),
                icon: Users,
                href: '/portal/agency/clients/',
              },
              {
                label: t('portal.sidebar.nav.requests'),
                icon: ClipboardList,
                href: '/portal/requests/',
              },
              {
                label: t('portal.sidebar.nav.consultations' as any),
                icon: Calendar,
                href: '/portal/agency/consultations/',
              },
            ],
          },
          {
            items: [
              {
                label: t('portal.sidebar.nav.pricing' as any),
                icon: DollarSign,
                href: '/portal/agency/pricing/',
              },
            ],
          },
        ]
      : [
          {
            items: [
              {
                label: t('portal.sidebar.nav.dashboard'),
                icon: LayoutDashboard,
                href: '/portal/dashboard/',
              },
              {
                label: t('portal.sidebar.nav.requests'),
                icon: ClipboardList,
                href: '/portal/requests/',
              },
            ],
          },
          {
            items: [
              {
                label: t('portal.sidebar.nav.team'),
                icon: Users,
                href: '/portal/team/',
              },
              {
                label: t('portal.sidebar.nav.files'),
                icon: FolderOpen,
                href: '/portal/files/',
              },
              {
                label: t('portal.sidebar.nav.consultations' as any),
                icon: Calendar,
                href: '/portal/consultations/',
              },
            ],
          },
          {
            items: [
              {
                label: t('portal.sidebar.nav.pricing' as any),
                icon: DollarSign,
                href: '/portal/pricing/',
              },
            ],
          },
        ];

  if (loading || isAuthorized === null) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <div className="absolute inset-0 blur-xl bg-blue-500/20 animate-pulse scale-150 -z-10" />
        </div>
        <p className="text-surface-500 font-black font-outfit uppercase tracking-[0.2em] text-[10px]">
          {t('portal.loading.init')}
        </p>
      </div>
    );
  }

  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-white dark:bg-surface-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-rose-50 dark:bg-rose-900/20 rounded-[2.5rem] flex items-center justify-center mx-auto border border-rose-100 dark:border-rose-900/30 shadow-xl shadow-rose-500/10">
            <AlertCircle size={44} className="text-rose-600 dark:text-rose-400" />
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white font-outfit tracking-tight">
              {t('portal.access.restrictedTitle')}
            </h1>
            <p className="text-surface-500 dark:text-surface-400 font-medium leading-relaxed">
              {t('portal.access.restrictedMessage')}
            </p>
          </div>
          <div className="pt-4 flex flex-col gap-3">
            <Link href="/portal/">
              <PortalButton
                variant="primary"
                className="w-full h-12 font-outfit shadow-xl shadow-blue-500/20"
              >
                {t('portal.access.switchWorkspace')}
              </PortalButton>
            </Link>
            <PortalButton
              variant="outline"
              className="w-full h-12 font-outfit border-surface-200 dark:border-surface-800"
            >
              {t('portal.access.contactSupport')}
            </PortalButton>
          </div>
        </div>
      </div>
    );
  }

  const showBreadcrumbs = (() => {
    if (!pathname) return false;
    const normalizePath = (p: string) => (p.endsWith('/') ? p.slice(0, -1) : p);
    const currentPath = normalizePath(pathname);

    const mainPagePaths = new Set(
      navGroups.flatMap(group =>
        group.items.map(item => normalizePath(item.href))
      )
    );

    // Add portal root path
    mainPagePaths.add('/portal');

    return !mainPagePaths.has(currentPath);
  })();

  return (
    <div
      className={cn(
        'portal-shell min-h-screen bg-white dark:bg-surface-950 text-surface-900 dark:text-surface-50 antialiased overflow-x-hidden selection:bg-blue-500/20',
        getLocaleFontFamily(locale)
      )}
      dir={getLocaleDirection(locale)}
    >
      <OfflineIndicator />

      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:start-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-blue-600 focus:text-white focus:rounded-2xl focus:shadow-xl focus:outline-none"
      >
        {t('portal.accessibility.skipToContent')}
      </a>

      {/* Mobile Sidebar Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-surface-950/40 backdrop-blur-md z-[60] md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          'portal-sidebar fixed top-0 bottom-0 z-[70] flex flex-col transition-transform duration-300',
          'bg-white dark:bg-surface-950/80 backdrop-blur-xl',
          'border-e border-surface-200/50 dark:border-surface-800/30 shadow-2xl shadow-surface-950/20',
          'w-[85vw] max-w-[320px] min-h-screen-mobile overflow-hidden',
          'pb-safe',
          isRTLLocale(locale) ? 'right-0' : 'left-0',
          isMobileMenuOpen
            ? 'translate-x-0'
            : isRTLLocale(locale)
              ? 'translate-x-full'
              : '-translate-x-full',
          'md:translate-x-0',
          isSidebarOpen
            ? 'md:w-[var(--sidebar-width-expanded)]'
            : 'md:w-[var(--sidebar-width-collapsed)]'
        )}
        aria-label="Navigation"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Sidebar Header / Brand */}
        <div className="h-20 flex items-center px-4 border-b border-surface-200/50 dark:border-surface-800/30 flex-shrink-0">
          <Link
            href="/portal/dashboard/"
            className="flex items-center gap-3 group w-full min-w-0"
          >
            <div className="w-9 h-9 flex-shrink-0 relative group-hover:scale-110 transition-transform duration-300">
              <Image
                src="/images/CarShift-Icon-Colored.png"
                alt="CartShift Studio"
                fill
                className="object-contain"
                priority
              />
            </div>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col leading-none"
              >
                <span className="font-bold text-base tracking-tight text-surface-900 dark:text-white truncate">
                  {t('portal.sidebar.title')}
                </span>
                <span className="text-[9px] font-bold text-blue-500 uppercase tracking-wider mt-0.5 opacity-80">
                  {t('portal.sidebar.subtitle')}
                </span>
              </motion.div>
            )}
          </Link>
        </div>

        {/* Organization Switcher - only show if user has multiple orgs */}
        {hasMultipleOrgs && isExpanded && (
          <div className="px-3 py-2 border-b border-surface-200/50 dark:border-surface-800/30">
            <div className="relative">
              <select
                value={effectiveOrgId || ''}
                onChange={(e) => {
                  switchOrg(e.target.value);
                  router.push('/portal/dashboard/');
                }}
                className="w-full px-3 py-2 text-sm font-medium bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-lg appearance-none cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-surface-900 dark:text-white"
              >
                {fullOrganizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 end-0 flex items-center pe-2 pointer-events-none">
                <ChevronLeft size={16} className="rotate-[-90deg] text-surface-400" />
              </div>
            </div>
          </div>
        )}

        {/* Sidebar Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden portal-scrollbar p-3 space-y-0.5 min-h-0">
          {navGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              {groupIndex > 0 && (
                <div className="mx-4 my-2 border-t border-surface-200/50 dark:border-surface-800/30" />
              )}
              {group.items.map(item => {
                const isActive = pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={false}
                    onClick={(e) => {
                      if (isMobile) setIsMobileMenuOpen(false);
                      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
                        e.preventDefault();
                        window.location.href = `/${locale}${item.href}`;
                      }
                    }}
                    className={cn(navItemVariants({ isActive, isCollapsed: !isExpanded }))}
                    title={!isExpanded ? item.label : undefined}
                  >
                    <item.icon
                      size={18}
                      className={cn(
                        'transition-all duration-300 flex-shrink-0',
                        isActive
                          ? 'text-current'
                          : 'opacity-60 group-hover:opacity-100 group-hover:scale-110'
                      )}
                    />
                    {isExpanded && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm font-bold truncate flex-1"
                      >
                        {item.label}
                      </motion.span>
                    )}
                    {isActive && isExpanded && (
                      <motion.div
                        layoutId="nav-active-indicator"
                        className="absolute w-1 h-6 bg-blue-600 rounded-full start-0"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="flex-shrink-0 p-3 border-t border-surface-200/50 dark:border-surface-800/30 space-y-1">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={cn(
              'hidden md:flex items-center gap-3 portal-nav-item w-full',
              !isExpanded && 'justify-center px-0'
            )}
            aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <div className="transition-transform duration-500">
              <ChevronLeft size={20} className="rtl:rotate-180" />
            </div>
            {isExpanded && (
              <span className="text-sm font-bold">{t('portal.sidebar.collapse')}</span>
            )}
          </button>

          <button
            onClick={handleSignOut}
            className={cn(
              'flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all font-semibold text-sm',
              !isExpanded && 'justify-center px-0'
            )}
          >
            <LogOut
              size={20}
              className="flex-shrink-0 group-hover:ltr:translate-x-1 group-hover:rtl:-translate-x-1 transition-transform"
            />
            {isExpanded && <span className="text-sm">{t('portal.sidebar.signOut')}</span>}
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div
        className={cn(
          'portal-main',
          'transition-all duration-300',
          isSidebarOpen
            ? 'md:ps-[var(--sidebar-width-expanded)]'
            : 'md:ps-[var(--sidebar-width-collapsed)]'
        )}
      >
        <PortalHeader
          onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
          onMobileSearchToggle={() => setIsMobileSearchOpen(true)}
          userData={userData as any}
          accountType={accountType}
          notifications={notifications}
          unreadCount={unreadCount}
          isNotificationOpen={isNotificationOpen}
          setIsNotificationOpen={setIsNotificationOpen}
          notificationRef={notificationRef}
          notificationButtonRef={notificationButtonRef}
          handleNotificationClick={handleNotificationClick}
          handleMarkAllAsRead={handleMarkAllAsRead}
          orgId={effectiveOrgId}
        />

        {/* Page Content Container */}
        <main id="main-content" className="portal-content">
          {showBreadcrumbs && (
            <div className="mb-4">
              <Breadcrumbs />
            </div>
          )}
          <div className="portal-reveal">{children}</div>
        </main>
      </div>

      {/* Portal Elements */}
      {mounted && createPortal(
        <NotificationDropdown
          isOpen={isNotificationOpen}
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAllAsRead={handleMarkAllAsRead}
          onNotificationClick={handleNotificationClick}
          position={notificationPosition}
          dropdownRef={notificationDropdownRef}
        />,
        document.body
      )}

      {/* Onboarding Tour for new users */}
      {showOnboarding && userData?.id && (
        <OnboardingTour
          userId={userData.id}
          onComplete={() => setShowOnboarding(false)}
          onSkip={() => setShowOnboarding(false)}
        />
      )}

      {/* Mobile Search */}
      <MobileSearch isOpen={isMobileSearchOpen} onClose={() => setIsMobileSearchOpen(false)} />
    </div>
  );
};
