import React from 'react';
import { cn } from '@/lib/utils';

interface PortalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const PortalInput = React.forwardRef<HTMLInputElement, PortalInputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-[var(--portal-text-secondary)]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "portal-input",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

PortalInput.displayName = "PortalInput";

