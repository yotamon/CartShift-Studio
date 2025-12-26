'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  User as UserIcon,
  Loader2,
  AlertCircle,
  HelpCircle,
  Zap,
  CheckCheck,
  Menu,
  X,
  DollarSign,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';
import { logout } from '@/lib/services/auth';
import { PortalButton } from './ui/PortalButton';
import { useTranslations, useLocale } from 'next-intl';
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
  const pathname = usePathname();
  const router = useRouter();
  const { userData, loading, isAuthenticated, accountType } = usePortalAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const t = useTranslations();
  const locale = useLocale();
  const notificationRef = useRef<HTMLDivElement>(null);

  const userId = userData?.id ?? null;

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/portal/login/');
        return;
      }

      // Check if user has access to this organization
      if (orgId && userData) {
        const hasAccess = userData.isAgency || userData.organizations?.includes(orgId);
        setIsAuthorized(hasAccess ?? false);
      } else if (isAgencyPage && userData) {
        setIsAuthorized(userData.isAgency ?? false);
      } else {
        setIsAuthorized(true);
      }
    }
  }, [loading, isAuthenticated, userData, orgId, isAgencyPage, router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
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

  const navItems =
    isAgencyPage || userData?.isAgency
      ? [
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
          {
            label: t('portal.sidebar.nav.clients'),
            icon: Users,
            href: '/portal/agency/clients/',
          },
          {
            label: t('portal.sidebar.nav.settings'),
            icon: Settings,
            href: '/portal/agency/settings/',
          },
        ]
      : [
          {
            label: t('portal.sidebar.nav.dashboard'),
            icon: LayoutDashboard,
            href: `/portal/org/${orgId}/dashboard/`,
          },
          {
            label: t('portal.sidebar.nav.requests'),
            icon: ClipboardList,
            href: `/portal/org/${orgId}/requests/`,
          },
          {
            label: t('portal.sidebar.nav.pricing' as any),
            icon: DollarSign,
            href: `/portal/org/${orgId}/pricing/`,
          },
          {
            label: t('portal.sidebar.nav.team'),
            icon: Users,
            href: `/portal/org/${orgId}/team/`,
          },
          {
            label: t('portal.sidebar.nav.files'),
            icon: FolderOpen,
            href: `/portal/org/${orgId}/files/`,
          },
          {
            label: t('portal.sidebar.nav.settings'),
            icon: Settings,
            href: `/portal/org/${orgId}/settings/`,
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
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-rose-50 dark:bg-rose-900/20 rounded-[2.5rem] flex items-center justify-center mx-auto border border-rose-100 dark:border-rose-900/30 shadow-xl shadow-rose-500/10">
            <AlertCircle size={44} className="text-rose-600 dark:text-rose-400" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-surface-900 dark:text-white font-outfit tracking-tight">
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

  return (
    <div className="portal-container min-h-screen flex overflow-hidden bg-surface-50 dark:bg-surface-950">
      {/* Mobile Sidebar Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - Mobile-first: hidden by default, shown on md+ */}
      <aside
        className={cn(
          'portal-sidebar fixed top-0 left-0 rtl:left-auto rtl:right-0 bottom-0 z-50 transition-transform duration-300 ease-in-out bg-white dark:bg-surface-900 border-r rtl:border-r-0 rtl:border-l border-surface-200 dark:border-surface-800/50 shadow-2xl shadow-surface-900/5 flex flex-col',
          'w-[85vw] max-w-sm',
          'md:w-72 md:translate-x-0',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Navigation"
      >
        <div className="h-16 md:h-20 flex items-center px-4 md:px-6 lg:px-8 border-b border-surface-100 dark:border-surface-800/50 flex-shrink-0">
          <div className="flex items-center gap-3 md:gap-4 group w-full min-w-0">
            <div className="w-9 h-9 md:w-10 md:h-10 flex-shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
              <Zap size={18} className="md:w-5 md:h-5" fill="currentColor" />
            </div>
            <div className="flex flex-col leading-none min-w-0 flex-1">
              <span className="font-black text-base md:text-lg lg:text-xl tracking-tighter font-outfit text-surface-900 dark:text-white truncate">
                {t('portal.sidebar.title')}
              </span>
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-0.5 truncate">
                {t('portal.sidebar.subtitle')}
              </span>
            </div>
          </div>
        </div>

        <nav className="p-3 md:p-4 lg:p-6 space-y-1 md:space-y-1.5 lg:space-y-2 mt-2 md:mt-3 lg:mt-4 overflow-y-auto flex-1 min-h-0" aria-label="Main navigation">
          {navItems.map(item => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (isMobile) {
                    setIsMobileMenuOpen(false);
                  }
                }}
                className={cn(
                  'h-11 md:h-12 flex items-center gap-3 md:gap-4 px-3 md:px-4 rounded-xl md:rounded-2xl transition-all duration-200 relative group font-outfit touch-manipulation',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-surface-900',
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm font-semibold'
                    : 'text-surface-500 hover:bg-surface-50 dark:hover:bg-surface-800/50 hover:text-surface-900 dark:hover:text-white active:bg-surface-100 dark:active:bg-surface-800'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon
                  size={18}
                  className={cn(
                    'transition-all duration-200 flex-shrink-0 md:w-5 md:h-5',
                    isActive
                      ? 'scale-110 text-blue-600 dark:text-blue-400'
                      : 'group-hover:scale-110 opacity-70 group-hover:opacity-100'
                  )}
                  aria-hidden="true"
                />
                <span className="text-sm font-bold tracking-tight truncate flex-1">{item.label}</span>
                {isActive && (
                  <div className="absolute left-0 rtl:left-auto rtl:right-0 w-1 h-6 bg-blue-600 rounded-full" aria-hidden="true" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-surface-100 dark:border-surface-800/50 pt-3 pb-4 md:pb-6 lg:pb-8 px-3 md:px-4 lg:px-6 space-y-1.5 md:space-y-2 flex-shrink-0 bg-white dark:bg-surface-900">
          <button
            onClick={() => {
              setIsSidebarOpen(!isSidebarOpen);
              if (isMobile) {
                setIsMobileMenuOpen(false);
              }
            }}
            className="hidden md:flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2.5 md:py-3 h-11 md:h-auto text-surface-500 hover:text-surface-900 dark:hover:text-white w-full transition-all rounded-xl md:rounded-2xl hover:bg-surface-50 dark:hover:bg-surface-800/50 group font-outfit touch-manipulation focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-700"
            aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <div
              className={cn(
                'transition-transform duration-300 flex-shrink-0',
                locale === 'he'
                  ? isSidebarOpen
                    ? 'rotate-180'
                    : 'rotate-0'
                  : !isSidebarOpen && 'rotate-180'
              )}
            >
              <ChevronLeft size={18} />
            </div>
            {isSidebarOpen && (
              <span className="text-sm font-bold">{t('portal.sidebar.collapse')}</span>
            )}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden flex items-center gap-3 px-3 py-2.5 h-11 text-surface-500 hover:text-surface-900 dark:hover:text-white w-full transition-all rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 group font-outfit touch-manipulation active:bg-surface-100 dark:active:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-700"
            aria-label="Close menu"
          >
            <X size={18} className="flex-shrink-0" aria-hidden="true" />
            <span className="text-sm font-bold">{t('portal.sidebar.close' as any) || 'Close'}</span>
          </button>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2.5 md:py-3 h-11 md:h-auto text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl md:rounded-2xl w-full transition-all group font-outfit touch-manipulation active:bg-rose-100 dark:active:bg-rose-500/20 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-700"
            aria-label="Sign out"
          >
            <LogOut size={18} className="flex-shrink-0 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
            <span className="text-sm font-bold">{t('portal.sidebar.signOut')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area - Mobile-first: no padding on mobile, adds padding on md+ */}
      <div
        className={cn(
          'flex-1 flex flex-col min-h-screen',
          'md:transition-all md:duration-300 md:ease-in-out',
          isSidebarOpen ? 'md:pl-72 rtl:md:pl-0 rtl:md:pr-72' : 'md:pl-24 rtl:md:pl-0 rtl:md:pr-24'
        )}
      >
        {/* Topbar - Mobile-first responsive header */}
        <header
          className={cn(
            'portal-header sticky top-0 z-40 bg-white/90 dark:bg-surface-950/90 backdrop-blur-xl border-b border-surface-100 dark:border-surface-800/30',
            'h-14 md:h-16 lg:h-20',
            'flex items-center justify-between',
            'px-2 sm:px-3 md:px-6 lg:px-10',
            'w-full min-w-0'
          )}
          role="banner"
        >
          {/* Left section - Menu button and optional content */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0 min-w-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 text-surface-500 hover:text-surface-900 dark:hover:text-white transition-colors rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 touch-manipulation active:bg-surface-200 dark:active:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-surface-950"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>

            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-2 group cursor-pointer">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest group-hover:text-surface-600 dark:group-hover:text-surface-300 transition-colors hidden lg:inline">
                  {t('portal.header.serverStatus')}
                </span>
              </div>
              <div className="h-4 w-px bg-surface-200 dark:bg-surface-800" />
            </div>

            <div className="relative w-full max-w-sm hidden lg:block">
              <Search
                className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-surface-400"
                size={16}
              />
              <input
                type="text"
                placeholder={t('portal.header.searchPlaceholder')}
                className="w-full pl-11 rtl:pl-4 rtl:pr-11 pr-4 py-2 rounded-2xl border-transparent bg-surface-50 dark:bg-surface-900/50 text-sm font-medium focus:bg-white dark:focus:bg-surface-900 border focus:border-blue-500/50 transition-all outline-none"
              />
            </div>
          </div>

          {/* Right section - Actions and user */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4 lg:gap-6 flex-shrink-0 min-w-0">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2 text-surface-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 hidden md:flex touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500">
                <HelpCircle size={18} className="md:w-5 md:h-5" />
              </button>
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="p-2 md:p-2.5 text-surface-400 hover:text-surface-900 dark:hover:text-white transition-all relative rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800/50 group touch-manipulation active:bg-surface-200 dark:active:bg-surface-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Notifications"
                  aria-expanded={isNotificationOpen}
                >
                  <Bell size={18} className="md:w-5 md:h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 md:top-2.5 md:right-2.5 rtl:right-auto rtl:left-1 md:rtl:left-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white dark:border-surface-950"></span>
                  )}
                </button>

                <AnimatePresence>
                  {isNotificationOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-2 end-0 rtl:end-auto rtl:start-0 w-[calc(100vw-1rem)] sm:w-[calc(100vw-2rem)] max-w-sm md:w-96 bg-white dark:bg-surface-900 rounded-2xl shadow-xl border border-surface-200 dark:border-surface-800 overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-surface-900 dark:text-white font-outfit">
                          {t('portal.header.notifications' as any) || 'Notifications'}
                        </h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllAsRead}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-1.5"
                          >
                            <CheckCheck size={14} />
                            Mark all as read
                          </button>
                        )}
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center">
                            <Bell
                              size={32}
                              className="mx-auto text-surface-300 dark:text-surface-700 mb-3"
                            />
                            <p className="text-sm text-surface-500 dark:text-surface-400 font-medium">
                              {t('portal.header.noNotifications' as any) || 'No notifications'}
                            </p>
                          </div>
                        ) : (
                          <div className="divide-y divide-surface-100 dark:divide-surface-800">
                            {notifications.map(notification => {
                              const createdAt = notification.createdAt?.toDate
                                ? notification.createdAt.toDate()
                                : new Date();
                              return (
                                <button
                                  key={notification.id}
                                  onClick={() => handleNotificationClick(notification)}
                                  className={cn(
                                    'w-full p-4 text-left rtl:text-right hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors',
                                    !notification.read && 'bg-blue-50/50 dark:bg-blue-900/10'
                                  )}
                                >
                                  <div className="flex items-start gap-3">
                                    <div
                                      className={cn(
                                        'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                                        !notification.read ? 'bg-blue-600' : 'bg-transparent'
                                      )}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p
                                        className={cn(
                                          'text-sm font-bold mb-1 font-outfit',
                                          !notification.read
                                            ? 'text-surface-900 dark:text-white'
                                            : 'text-surface-600 dark:text-surface-400'
                                        )}
                                      >
                                        {notification.title}
                                      </p>
                                      <p className="text-xs text-surface-500 dark:text-surface-500 mb-2 line-clamp-2">
                                        {notification.body}
                                      </p>
                                      <p className="text-[10px] text-surface-400 dark:text-surface-600 uppercase tracking-wider font-black">
                                        {formatDistanceToNow(createdAt, {
                                          addSuffix: true,
                                          locale: locale === 'he' ? he : enUS,
                                        })}
                                      </p>
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
                </AnimatePresence>
              </div>
            </div>

            <div className="h-6 md:h-8 w-px bg-surface-200 dark:bg-surface-800 hidden sm:block flex-shrink-0"></div>

            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 min-w-0">
              <div className="text-right rtl:text-left hidden lg:block flex-shrink-0">
                <p className="text-sm font-bold text-surface-900 dark:text-white leading-none mb-1.5 font-outfit tracking-tight truncate">
                  {userData?.name || t('portal.header.authorizedMember' as never)}
                </p>
                <div className="flex items-center justify-end rtl:justify-start gap-1.5">
                  <span className={cn(
                    "text-[9px] font-black uppercase tracking-widest leading-none truncate",
                    accountType === ACCOUNT_TYPE.AGENCY
                      ? "text-purple-500"
                      : "text-blue-500"
                  )}>
                    {accountType === ACCOUNT_TYPE.AGENCY
                      ? t('portal.accountType.badge.agency' as never)
                      : t('portal.accountType.badge.client' as never)}
                  </span>
                </div>
              </div>
              <div className="w-9 h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-xl md:rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 flex items-center justify-center text-blue-600 shadow-lg shadow-surface-900/5 overflow-hidden touch-manipulation flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {(
                  <UserIcon size={16} className="md:w-5 md:h-5" />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content - Mobile-first padding */}
        <main
          className="flex-1 p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 overflow-y-auto bg-surface-50/50 dark:bg-surface-950/20 w-full min-w-0"
          role="main"
        >
          <div className="max-w-7xl mx-auto w-full min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

