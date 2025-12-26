'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';
import { logout } from '@/lib/services/auth';
import { PortalButton } from './ui/PortalButton';

interface PortalShellProps {
  children: React.ReactNode;
  orgId?: string;
  isAgency?: boolean;
}

export const PortalShell = ({ children, orgId, isAgency: isAgencyPage = false }: PortalShellProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { userData, loading, isAuthenticated } = usePortalAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

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

  const handleSignOut = async () => {
    try {
      await logout();
      router.push('/portal/login/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = isAgencyPage || userData?.isAgency
    ? [
        { label: 'Inbox', icon: Inbox, href: '/portal/agency/inbox/' },
        { label: 'Workboard', icon: Kanban, href: '/portal/agency/workboard/' },
        { label: 'Clients', icon: Users, href: '/portal/agency/clients/' },
        { label: 'Settings', icon: Settings, href: '/portal/agency/settings/' },
      ]
    : [
        { label: 'Dashboard', icon: LayoutDashboard, href: `/portal/org/${orgId}/dashboard/` },
        { label: 'Requests', icon: ClipboardList, href: `/portal/org/${orgId}/requests/` },
        { label: 'Team', icon: Users, href: `/portal/org/${orgId}/team/` },
        { label: 'Files', icon: FolderOpen, href: `/portal/org/${orgId}/files/` },
        { label: 'Settings', icon: Settings, href: `/portal/org/${orgId}/settings/` },
      ];

  if (loading || isAuthorized === null) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <div className="absolute inset-0 blur-xl bg-blue-500/20 animate-pulse scale-150 -z-10" />
        </div>
        <p className="text-slate-500 font-black font-outfit uppercase tracking-[0.2em] text-[10px]">Initializing Studio Environment</p>
      </div>
    );
  }

  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-rose-50 dark:bg-rose-900/20 rounded-[2.5rem] flex items-center justify-center mx-auto border border-rose-100 dark:border-rose-900/30 shadow-xl shadow-rose-500/10">
            <AlertCircle size={44} className="text-rose-600 dark:text-rose-400" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-outfit tracking-tight">Access Restricted</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Your account current profile doesn't have the necessary permissions to access this specific organization workspace.
            </p>
          </div>
          <div className="pt-4 flex flex-col gap-3">
            <Link href="/portal/">
              <PortalButton variant="primary" className="w-full h-12 font-outfit shadow-xl shadow-blue-500/20">
                Switch Workspaces
              </PortalButton>
            </Link>
            <PortalButton variant="outline" className="w-full h-12 font-outfit border-slate-200 dark:border-slate-800">
               Contact Support
            </PortalButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portal-container min-h-screen flex overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside
        className={cn(
          'portal-sidebar fixed top-0 left-0 bottom-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800/50 shadow-2xl shadow-slate-900/5',
          isSidebarOpen ? 'w-72' : 'w-24'
        )}
      >
        <div className="h-20 flex items-center px-8 border-b border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
              <Zap size={20} fill="currentColor" />
            </div>
            {isSidebarOpen && (
               <div className="flex flex-col leading-none">
                 <span className="font-black text-xl tracking-tighter font-outfit text-slate-900 dark:text-white">CartShift</span>
                 <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-0.5">Studio Portal</span>
               </div>
            )}
          </div>
        </div>

        <nav className="p-6 space-y-2 mt-4">
          {navItems.map(item => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'h-12 flex items-center gap-4 px-4 rounded-2xl transition-all duration-300 relative group font-outfit',
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white',
                  !isSidebarOpen && 'justify-center px-0'
                )}
                title={!isSidebarOpen ? item.label : undefined}
              >
                <item.icon
                  size={20}
                  className={cn('transition-all duration-300', isActive ? 'scale-110' : 'group-hover:scale-110 opacity-70 group-hover:opacity-100')}
                />
                {isSidebarOpen && <span className="text-sm font-bold tracking-tight">{item.label}</span>}
                {isActive && isSidebarOpen && (
                   <div className="absolute left-0 w-1 h-6 bg-blue-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-8 w-full px-6 space-y-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-slate-900 dark:hover:text-white w-full transition-all rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 group font-outfit"
          >
            <div className={cn('transition-transform duration-500', !isSidebarOpen && 'rotate-180')}>
              <ChevronLeft size={18} />
            </div>
            {isSidebarOpen && <span className="text-sm font-bold">Collapse</span>}
          </button>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-4 px-4 py-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl w-full transition-all group font-outfit"
          >
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            {isSidebarOpen && <span className="text-sm font-bold">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] min-h-screen',
          isSidebarOpen ? 'pl-72' : 'pl-24'
        )}
      >
        {/* Topbar */}
        <header
          className="portal-header fixed top-0 right-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/30 h-20 flex items-center px-10"
          style={{ left: isSidebarOpen ? '18rem' : '6.1rem', transition: 'left 0.5s cubic-bezier(0.4,0,0.2,1)' }}
        >
          <div className="flex items-center gap-8 flex-1">
             <div className="flex items-center gap-2 group cursor-pointer">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">Server Operational</span>
             </div>

             <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden md:block" />

            <div className="relative w-full max-w-sm hidden lg:block">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search global resources..."
                className="w-full pl-11 pr-4 py-2 rounded-2xl border-transparent bg-slate-50 dark:bg-slate-900/50 text-sm font-medium focus:bg-white dark:focus:bg-slate-900 border focus:border-blue-500/50 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1">
               <button className="p-2.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20">
                <HelpCircle size={20} />
              </button>
              <button className="p-2.5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all relative rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 group">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white dark:border-slate-950 group-hover:scale-125 transition-transform"></span>
              </button>
            </div>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>

            <div className="flex items-center gap-4 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1.5 font-outfit tracking-tight">
                  {userData?.name || 'Authorized Member'}
                </p>
                <div className="flex items-center justify-end gap-1.5">
                   <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest leading-none">
                     {userData?.isAgency ? 'Agency Partner' : 'Enterprise'}
                   </span>
                   <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Level 2</span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-blue-600 shadow-lg shadow-slate-900/5 overflow-hidden">
                {userData?.photoUrl ? (
                   <img src={userData.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={20} />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 mt-20 p-10 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/20">
          <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};


