'use client';

import React, { useState } from 'react';
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
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePortalAuth } from '@/lib/hooks/usePortalAuth';
import { logout } from '@/lib/services/auth';

interface PortalShellProps {
  children: React.ReactNode;
  orgId?: string;
  isAgency?: boolean;
}

export const PortalShell = ({ children, orgId, isAgency = false }: PortalShellProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { userData, loading } = usePortalAuth();

  const handleSignOut = async () => {
    try {
      await logout();
      router.push('/portal/login/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = isAgency ? [
    { label: 'Inbox', icon: Inbox, href: '/portal/agency/inbox/' },
    { label: 'Workboard', icon: Kanban, href: '/portal/agency/workboard/' },
    { label: 'Clients', icon: Users, href: '/portal/agency/clients/' },
    { label: 'Settings', icon: Settings, href: '/portal/agency/settings/' },
  ] : [
    { label: 'Dashboard', icon: LayoutDashboard, href: `/portal/org/${orgId}/dashboard/` },
    { label: 'Requests', icon: ClipboardList, href: `/portal/org/${orgId}/requests/` },
    { label: 'Team', icon: Users, href: `/portal/org/${orgId}/team/` },
    { label: 'Files', icon: FolderOpen, href: `/portal/org/${orgId}/files/` },
    { label: 'Settings', icon: Settings, href: `/portal/org/${orgId}/settings/` },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">Loading your workspace...</p>
      </div>
    );
  }

  // If not authenticated, the pages themselves might handle it,
  // but we can also show a placeholder or let them through to the login page if needed.
  // Note: For now we allow children to render, but you'd normally redirect here.

  return (
    <div className="portal-container min-h-screen flex overflow-hidden bg-[var(--portal-bg)]">
      {/* Sidebar */}
      <aside
        className={cn(
          "portal-sidebar fixed top-0 left-0 bottom-0 z-50 transition-all duration-300 ease-in-out border-r border-[var(--portal-sidebar-border)]",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="h-16 flex items-center px-6 border-b border-[var(--portal-sidebar-border)] bg-[var(--portal-sidebar-bg)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--portal-accent)] rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
              C
            </div>
            {isSidebarOpen && <span className="font-bold text-lg tracking-tight">CartShift</span>}
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "portal-nav-item h-11",
                  isActive && "active",
                  !isSidebarOpen && "justify-center px-0"
                )}
                title={!isSidebarOpen ? item.label : undefined}
              >
                <item.icon size={18} className={cn(isActive ? "text-[var(--portal-accent)]" : "text-slate-500")} />
                {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-[var(--portal-sidebar-border)] bg-[var(--portal-sidebar-bg)] overflow-hidden">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-slate-900 dark:hover:text-white w-full transition-colors rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronLeft className={cn("transition-transform duration-300", !isSidebarOpen && "rotate-180")} size={18} />
            {isSidebarOpen && <span className="text-sm font-medium">Collapse</span>}
          </button>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-md w-full transition-colors mt-1"
          >
            <LogOut size={18} />
            {isSidebarOpen && <span className="text-sm font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out min-h-screen",
          isSidebarOpen ? "pl-64" : "pl-20"
        )}
      >
        {/* Topbar */}
        <header className="portal-header fixed top-0 right-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-[var(--portal-border)] h-16 flex items-center px-8" style={{ left: isSidebarOpen ? '16rem' : '5rem', transition: 'left 0.3s ease-in-out' }}>
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-sm hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search resources..."
                className="portal-input pl-10 h-9 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors relative rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950"></span>
            </button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>
            <div className="flex items-center gap-3 pl-1">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">{userData?.name || 'User'}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                  {userData?.isAgency ? 'Agency Partner' : 'Client Workspace'}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-blue-600 border border-slate-200 dark:border-slate-700 shadow-sm">
                <UserIcon size={18} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 mt-16 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
