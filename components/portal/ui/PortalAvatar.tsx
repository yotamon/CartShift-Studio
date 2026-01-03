'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface PortalAvatarProps {
  name?: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const PortalAvatar: React.FC<PortalAvatarProps> = ({
  name,
  src,
  size = 'md',
  className,
}) => {
  const t = useTranslations();
  const sizeClasses = {
    xs: 'w-5 h-5 text-[9px]',
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-11 h-11 text-sm',
  };

  const initials = name
    ? name
        .split(' ')
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';

  if (src) {
    return (
      <img
        src={src}
        alt={name || t('portal.common.avatar')}
        className={cn('rounded-full object-cover', sizeClasses[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold',
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  );
};

interface PortalAvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  className?: string;
}

export const PortalAvatarGroup: React.FC<PortalAvatarGroupProps> = ({
  children,
  max = 4,
  className,
}) => {
  const childArray = React.Children.toArray(children);
  const visibleChildren = childArray.slice(0, max);
  const overflow = childArray.length - max;

  return (
    <div className={cn('flex -space-x-2', className)}>
      {visibleChildren}
      {overflow > 0 && (
        <div className="w-10 h-10 rounded-full bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-300 text-xs flex items-center justify-center border-2 border-white dark:border-surface-800">
          +{overflow}
        </div>
      )}
    </div>
  );
};
