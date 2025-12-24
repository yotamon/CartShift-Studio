import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PortalEmptyProps {
  title?: string;
  description?: string;
  icon?: LucideIcon | React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  action?: React.ReactNode;
}

export const PortalEmpty: React.FC<PortalEmptyProps> = ({
  title,
  description,
  icon,
  variant = 'default',
  action,
}) => {
  const variantStyles = {
    default: 'text-slate-400 dark:text-slate-500',
    success: 'text-green-500 dark:text-green-400',
    warning: 'text-amber-500 dark:text-amber-400',
    error: 'text-red-500 dark:text-red-400',
  };

  const renderIcon = () => {
    if (!icon) return null;

    // If icon is a React element (e.g., <Building2 size={48} />)
    if (React.isValidElement(icon)) {
      return <div className={`mx-auto mb-4 ${variantStyles[variant]}`}>{icon}</div>;
    }

    // If icon is a LucideIcon component
    const Icon = icon as LucideIcon;
    return <Icon className={`w-12 h-12 mx-auto mb-4 ${variantStyles[variant]}`} />;
  };

  return (
    <div className="text-center py-12">
      {renderIcon()}
      <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
        {title || 'No items found'}
      </h3>
      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};
