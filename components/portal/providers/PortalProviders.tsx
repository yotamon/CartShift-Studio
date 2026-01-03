'use client';

import { ReactNode } from 'react';
import { ToastProvider } from '@/components/portal/ui';

interface PortalProvidersProps {
  children: ReactNode;
}

export function PortalProviders({ children }: PortalProvidersProps) {
  return (
    <ToastProvider position="top-right" maxToasts={5}>
      {children}
    </ToastProvider>
  );
}
