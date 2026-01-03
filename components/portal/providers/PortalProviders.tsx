'use client';

import { ReactNode } from 'react';
import { ToastProvider } from '@/components/portal/ui';
import { QueryProvider } from '@/components/providers/QueryProvider';

interface PortalProvidersProps {
  children: ReactNode;
}

export function PortalProviders({ children }: PortalProvidersProps) {
  return (
    <QueryProvider>
      <ToastProvider position="top-right" maxToasts={5}>
        {children}
      </ToastProvider>
    </QueryProvider>
  );
}
