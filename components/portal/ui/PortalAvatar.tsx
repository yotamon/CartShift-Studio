'use client';

import React from 'react';
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
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={cn(
          'rounded-full object-cover',
          sizeClasses[size],
          className
        )}
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
        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs flex items-center justify-center border-2 border-white dark:border-slate-800">
          +{overflow}
        </div>
      )}
    </div>
  );
};


