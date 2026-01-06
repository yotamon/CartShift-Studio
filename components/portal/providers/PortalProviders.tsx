'use client';

import { ReactNode } from 'react';
import { ToastProvider } from '@/components/portal/ui';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { OrgProvider } from '@/lib/context/OrgContext';

interface PortalProvidersProps {
  children: ReactNode;
}

export function PortalProviders({ children }: PortalProvidersProps) {
  return (
    <QueryProvider>
      <OrgProvider>
        <ToastProvider position="top-right" maxToasts={5}>
          {children}
        </ToastProvider>
      </OrgProvider>
    </QueryProvider>
  );
}
