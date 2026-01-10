import { cva } from 'class-variance-authority';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  FolderOpen,
  Inbox,
  Kanban,
  DollarSign,
  Calendar,
  Star,
  Settings,
} from 'lucide-react';
import { NavGroup } from './types';

export const navItemVariants = cva('portal-nav-item group relative transition-all duration-200', {
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

export function getAgencyNavGroups(t: (key: string) => string): NavGroup[] {
  return [
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
          label: t('portal.sidebar.nav.consultations'),
          icon: Calendar,
          href: '/portal/agency/consultations/',
        },
      ],
    },
    {
      items: [
        {
          label: t('portal.sidebar.nav.pricing'),
          icon: DollarSign,
          href: '/portal/agency/pricing/',
        },
        {
          label: t('portal.sidebar.nav.testimonials'),
          icon: Star,
          href: '/portal/agency/testimonials/',
        },
      ],
    },
    {
      items: [
        {
          label: t('portal.sidebar.nav.settings'),
          icon: Settings,
          href: '/portal/agency/settings/',
        },
      ],
    },
  ];
}

export function getClientNavGroups(t: (key: string) => string): NavGroup[] {
  return [
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
          label: t('portal.sidebar.nav.consultations'),
          icon: Calendar,
          href: '/portal/consultations/',
        },
      ],
    },
    {
      items: [
        {
          label: t('portal.sidebar.nav.pricing'),
          icon: DollarSign,
          href: '/portal/pricing/',
        },
        {
          label: t('portal.sidebar.nav.review'),
          icon: Star,
          href: '/portal/review/',
        },
      ],
    },
    {
      items: [
        {
          label: t('portal.sidebar.nav.settings'),
          icon: Settings,
          href: '/portal/settings/',
        },
      ],
    },
  ];
}
