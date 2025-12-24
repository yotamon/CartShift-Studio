import React from 'react';

interface PortalPageHeaderProps {
  title: string;
  description?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
}

export const PortalPageHeader = ({
  title,
  description,
  subtitle,
  badge,
  action,
}: PortalPageHeaderProps) => (
  <div className="mb-8">
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white">{title}</h1>
        {badge}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
    {(description || subtitle) && (
      <p className="text-surface-500 dark:text-surface-400 mt-1">{description || subtitle}</p>
    )}
  </div>
);
