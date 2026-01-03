import React from 'react';
import { LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const emptyVariants = cva(
  "mx-auto mb-4",
  {
    variants: {
      variant: {
        default: "text-surface-400 dark:text-surface-500",
        success: "text-green-500 dark:text-green-400",
        warning: "text-amber-500 dark:text-amber-400",
        error: "text-red-500 dark:text-red-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface PortalEmptyProps extends VariantProps<typeof emptyVariants> {
  title?: string;
  description?: string;
  icon?: LucideIcon | React.ReactNode;
  action?: React.ReactNode;
  className?: string; // and className
}

export const PortalEmpty: React.FC<PortalEmptyProps> = ({
  title,
  description,
  icon,
  variant,
  action,
  className,
}) => {
  const t = useTranslations();

  const renderIcon = () => {
    if (!icon) return null;

    if (React.isValidElement(icon)) {
      return <div className={cn(emptyVariants({ variant }))}>{icon}</div>;
    }

    const Icon = icon as LucideIcon;
    return <Icon className={cn("w-12 h-12", emptyVariants({ variant }))} />;
  };

  return (
    <div className={cn("text-center py-12", className)}>
      {renderIcon()}
      <h3 className="font-semibold text-surface-900 dark:text-white mb-2">
        {title || t('portal.emptyState.generic.title')}
      </h3>
      {description && (
        <p className="text-sm text-surface-500 dark:text-surface-400 max-w-sm mx-auto">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export { emptyVariants };

