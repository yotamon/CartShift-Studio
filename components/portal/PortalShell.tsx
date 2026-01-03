'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  FolderOpen,
  Inbox,
  Kanban,
  Settings,
  LogOut,
  ChevronLeft,
  Bell,
  Search,
  Loader2,
  AlertCircle,
  Zap,
  CheckCheck,
  Menu,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';
import { logout } from '@/lib/services/auth';
import { PortalButton } from './ui/PortalButton';
import { PortalAvatar } from './ui/PortalAvatar';
import { useTranslations, useLocale } from 'next-intl';
import { getMemberByUserId, ensureMembership } from '@/lib/services/portal-organizations';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import {
  subscribeToNotifications,
  subscribeToUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '@/lib/services/portal-notifications';
import { Notification, ACCOUNT_TYPE } from '@/lib/types/portal';
import { formatDistanceToNow } from 'date-fns';
import { enUS, he } from 'date-fns/locale';
import { OnboardingTour } from './OnboardingTour';
import { OfflineIndicator } from './ui/OfflineIndicator';
import { Breadcrumbs } from './ui/Breadcrumbs';
import { MobileSearch, MobileSearchButton } from './ui/MobileSearch';

interface PortalShellProps {
  children: React.ReactNode;
  orgId?: string;
  isAgency?: boolean;
}

export const PortalShell = ({
  children,
  orgId,
  isAgency: isAgencyPage = false,
}: PortalShellProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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

  // Resolve real orgId if we are in the template route
  const effectiveOrgId = React.useMemo(() => {
    if (orgId === 'template' && pathname) {
      // Path format: /:locale/portal/org/:orgId/... or /portal/org/:orgId/...
      // Example: /en/portal/org/123/dashboard
      const parts = pathname.split('/');
      const orgIndex = parts.indexOf('org');
      if (orgIndex !== -1 && parts.length > orgIndex + 1) {
        const realId = parts[orgIndex + 1];
        if (realId !== 'template') {
          return realId;
        }
      }
    }
    return orgId;
  }, [orgId, pathname]);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/portal/login/');
        return;
      }

      const checkAccess = async () => {
        try {
          if (effectiveOrgId && userData) {
            if (userData.isAgency || userData.accountType === 'AGENCY') {
              setIsAuthorized(true);
              return;
            }

            // CRITICAL: Skip check if orgId is 'template' to avoid backend errors
            if (effectiveOrgId === 'template') {
              console.warn(
                '[PortalShell] effectiveOrgId is "template". Skipping access check and allowing render.'
              );
              setIsAuthorized(true);
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

            setIsAuthorized(member !== null);

            if (!member) {
              console.warn(
                `[PortalShell] Access denied - No membership found for orgId: ${effectiveOrgId}, userId: ${userData.id}, userOrgs: ${JSON.stringify(userData.organizations)}`
              );
            }
          } else if (isAgencyPage && userData) {
            setIsAuthorized(Boolean(userData.isAgency) || userData.accountType === 'AGENCY');
          } else {
            setIsAuthorized(true);
          }
        } catch (error) {
          console.error('[PortalShell] Error checking access:', error);
          setIsAuthorized(false);
        }
      };

      checkAccess();
    }

    if (userData && !userData.isAgency && !userData.onboardingComplete) {
      setShowOnboarding(true);
    }
  }, [loading, isAuthenticated, userData, effectiveOrgId, isAgencyPage, router]);

  useEffect(() => {
    setMounted(true);
  }, []);

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

    const unsubscribeNotifications = subscribeToNotifications(
      userId,
      data => {
        setNotifications(data);
      },
      { limit: 10 }
    );

    const unsubscribeUnreadCount = subscribeToUnreadCount(userId, count => {
      setUnreadCount(count);
    });

    return () => {
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
      router.push('/portal/login/');
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
                href: '/portal/org/template/requests/', // Fallback or specific agency view
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
              {
                label: t('portal.sidebar.nav.settings'),
                icon: Settings,
                href: '/portal/agency/settings/',
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
                href: `/portal/org/${effectiveOrgId}/dashboard/`,
              },
              {
                label: t('portal.sidebar.nav.requests'),
                icon: ClipboardList,
                href: `/portal/org/${effectiveOrgId}/requests/`,
              },
            ],
          },
          {
            items: [
              {
                label: t('portal.sidebar.nav.team'),
                icon: Users,
                href: `/portal/org/${effectiveOrgId}/team/`,
              },
              {
                label: t('portal.sidebar.nav.files'),
                icon: FolderOpen,
                href: `/portal/org/${effectiveOrgId}/files/`,
              },
              {
                label: t('portal.sidebar.nav.consultations' as any),
                icon: Calendar,
                href: `/portal/org/${effectiveOrgId}/consultations/`,
              },
            ],
          },
          {
            items: [
              {
                label: t('portal.sidebar.nav.pricing' as any),
                icon: DollarSign,
                href: `/portal/org/${effectiveOrgId}/pricing/`,
              },
              {
                label: t('portal.sidebar.nav.settings'),
                icon: Settings,
                href: `/portal/org/${effectiveOrgId}/settings/`,
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

  const portalElements = mounted
    ? createPortal(
        <AnimatePresence>
          {isNotificationOpen && (
            <motion.div
              ref={notificationDropdownRef}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="fixed max-w-80 w-[calc(100vw-2rem)] bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-surface-200/60 dark:border-surface-800/50 overflow-hidden z-[100]"
              style={{
                top: `${notificationPosition.top}px`,
                right:
                  notificationPosition.right !== undefined
                    ? `${notificationPosition.right}px`
                    : undefined,
                left:
                  notificationPosition.left !== undefined
                    ? `${notificationPosition.left}px`
                    : undefined,
                maxWidth: 'min(320px, calc(100vw - 2rem))',
              }}
            >
              <div className="p-6 border-b border-surface-200/50 dark:border-surface-800/30 flex items-center justify-between bg-white/50 dark:bg-surface-900/50">
                <h3 className="text-base font-black text-surface-900 dark:text-white">
                  {t('portal.header.notifications' as any) || 'Notifications'}
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 hover:underline decoration-2 underline-offset-4 transition-all"
                  >
                    <CheckCheck size={14} />
                    {t('portal.header.markAllRead' as any) || 'Mark all as read'}
                  </button>
                )}
              </div>

              <div className="max-h-[450px] overflow-y-auto portal-scrollbar bg-white/30 dark:bg-surface-900/10">
                {notifications.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-surface-50 dark:bg-surface-950 rounded-full flex items-center justify-center mx-auto mb-4 border border-surface-200 dark:border-surface-800">
                      <Bell size={24} className="text-surface-300 dark:text-surface-700" />
                    </div>
                    <p className="text-sm text-surface-500 font-bold">
                      {t('portal.header.noNotifications' as any) || 'No notifications'}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-surface-100 dark:divide-surface-800/50">
                    {notifications.map(notification => {
                      const createdAt = notification.createdAt?.toDate
                        ? notification.createdAt.toDate()
                        : new Date();
                      return (
                        <button
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={cn(
                            'w-full p-5 text-start hover:bg-surface-50/80 dark:hover:bg-surface-800/40 transition-all flex items-start gap-4 group',
                            !notification.read && 'bg-blue-50/30 dark:bg-blue-900/10'
                          )}
                        >
                          <div
                            className={cn(
                              'w-2 h-2 rounded-full mt-2 flex-shrink-0 transition-all group-hover:scale-150',
                              !notification.read
                                ? 'bg-blue-600'
                                : 'bg-transparent border border-surface-300 dark:border-surface-700'
                            )}
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className={cn(
                                'text-sm font-bold mb-1 font-outfit leading-tight',
                                !notification.read
                                  ? 'text-surface-900 dark:text-white'
                                  : 'text-surface-500'
                              )}
                            >
                              {notification.title}
                            </p>
                            <p className="text-xs text-surface-500/80 mb-3 line-clamp-2 leading-relaxed font-medium">
                              {notification.body}
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="px-2 py-0.5 rounded-md bg-surface-100 dark:bg-surface-800 text-[10px] font-black uppercase text-surface-400">
                                {formatDistanceToNow(createdAt, {
                                  addSuffix: true,
                                  locale: locale === 'he' ? he : enUS,
                                })}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )
    : null;

  return (
    <div
      className={cn(
        'portal-shell min-h-screen bg-white dark:bg-surface-950 text-surface-900 dark:text-surface-50 antialiased overflow-x-hidden selection:bg-blue-500/20',
        locale === 'he' ? 'font-inter' : 'font-outfit'
      )}
      dir={locale === 'he' ? 'rtl' : 'ltr'}
    >
      <OfflineIndicator />

      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:start-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-blue-600 focus:text-white focus:rounded-2xl focus:shadow-xl focus:outline-none"
      >
        {t('portal.accessibility.skipToContent' as any) || 'Skip to main content'}
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
          'w-[85vw] max-w-sm',
          locale === 'he' ? 'right-0' : 'left-0',
          isMobileMenuOpen
            ? 'translate-x-0'
            : locale === 'he'
              ? 'translate-x-full'
              : '-translate-x-full',
          'md:translate-x-0',
          isSidebarOpen
            ? 'md:w-[var(--sidebar-width-expanded)]'
            : 'md:w-[var(--sidebar-width-collapsed)]'
        )}
        aria-label="Navigation"
      >
        {/* Sidebar Header / Brand */}
        <div className="h-20 flex items-center px-4 border-b border-surface-200/50 dark:border-surface-800/30 flex-shrink-0">
          <Link
            href={`/${locale}/portal/org/${orgId}/dashboard`}
            className="flex items-center gap-3 group w-full min-w-0"
          >
            <div className="w-9 h-9 flex-shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
              <Zap size={18} fill="currentColor" />
            </div>
            {isSidebarOpen && (
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

        {/* Sidebar Nav */}
        <nav className="flex-1 overflow-y-auto portal-scrollbar p-3 space-y-0.5">
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
                    onClick={() => isMobile && setIsMobileMenuOpen(false)}
                    className={cn(
                      'portal-nav-item group relative',
                      isActive
                        ? 'portal-nav-item-active'
                        : 'hover:bg-surface-100/60 dark:hover:bg-surface-800/40',
                      !isSidebarOpen && 'md:justify-center md:px-0'
                    )}
                    title={!isSidebarOpen ? item.label : undefined}
                  >
                    <item.icon
                      size={18}
                      className={cn(
                        'transition-all duration-300 flex-shrink-0',
                        isActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'opacity-60 group-hover:opacity-100 group-hover:scale-110'
                      )}
                    />
                    {isSidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm font-bold truncate flex-1"
                      >
                        {item.label}
                      </motion.span>
                    )}
                    {isActive && isSidebarOpen && (
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
        <div className="p-3 border-t border-surface-200/50 dark:border-surface-800/30 space-y-1">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={cn(
              'hidden md:flex items-center gap-3 portal-nav-item w-full',
              !isSidebarOpen && 'justify-center px-0'
            )}
            aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <div className="transition-transform duration-500">
              <ChevronLeft size={20} className="rtl:rotate-180" />
            </div>
            {isSidebarOpen && (
              <span className="text-sm font-bold">{t('portal.sidebar.collapse')}</span>
            )}
          </button>

          <button
            onClick={handleSignOut}
            className={cn(
              'flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all font-semibold text-sm',
              !isSidebarOpen && 'justify-center px-0'
            )}
          >
            <LogOut
              size={20}
              className="flex-shrink-0 group-hover:ltr:translate-x-1 group-hover:rtl:-translate-x-1 transition-transform"
            />
            {isSidebarOpen && <span className="text-sm">{t('portal.sidebar.signOut')}</span>}
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
        {/* Header */}
        <header className="portal-header flex items-center justify-between px-4 md:px-6 bg-white/50 dark:bg-surface-950/50 backdrop-blur-md border-b border-surface-200/50 dark:border-surface-800/30 sticky top-0 z-50">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-surface-500 hover:text-surface-900 dark:hover:text-white transition-colors"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
            <MobileSearchButton onClick={() => setIsMobileSearchOpen(true)} />
            <div className="relative hidden lg:block group">
              <Search
                className="absolute start-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-blue-500 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder={t('portal.header.search' as any) || 'Search...'}
                className="w-full h-10 ps-12 pe-4 bg-surface-50/50 dark:bg-surface-900/50 border border-surface-200/50 dark:border-surface-800/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium transition-all group-hover:bg-surface-100/50 dark:group-hover:bg-surface-800/50"
                aria-label="Search"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex items-center gap-2">
              <LanguageSwitcher />

              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button
                  ref={notificationButtonRef}
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className={cn(
                    'relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300',
                    isNotificationOpen
                      ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rotate-12'
                      : 'text-surface-500 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100/80 dark:hover:bg-surface-800/50'
                  )}
                  aria-label="Notifications"
                >
                  <Bell size={20} className="group-hover:scale-110 transition-transform" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2.5 end-2.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white dark:ring-surface-950 animate-pulse" />
                  )}
                </button>
              </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 border-s dark:border-surface-800 ps-3 md:ps-6">
              <div className="hidden sm:flex flex-col items-end leading-none gap-1.5">
                <span className="text-sm font-black text-surface-900 dark:text-white">
                  {userData?.name || t('portal.header.authorizedMember' as never)}
                </span>
                <span
                  className={cn(
                    'text-[9px] font-black uppercase tracking-widest',
                    accountType === ACCOUNT_TYPE.AGENCY ? 'text-purple-500' : 'text-blue-500'
                  )}
                >
                  {accountType === ACCOUNT_TYPE.AGENCY
                    ? t('portal.accountType.badge.agency' as never)
                    : t('portal.accountType.badge.client' as never)}
                </span>
              </div>
              <Link
                href={
                  userData?.isAgency ? '/portal/agency/settings/' : `/portal/org/${orgId}/settings/`
                }
                className="portal-avatar group cursor-pointer hover:border-blue-500/50 transition-all active:scale-95 shadow-lg shadow-blue-500/10"
              >
                <PortalAvatar
                  src={userData?.photoUrl}
                  name={userData?.name}
                  size="sm"
                  className="group-hover:scale-110 transition-transform"
                />
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main id="main-content" className="portal-content">
          {/* Breadcrumbs */}
          <div>
            <Breadcrumbs />
          </div>
          <div className="portal-reveal">{children}</div>
        </main>
      </div>

      {/* Portal Elements */}
      {portalElements}
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
