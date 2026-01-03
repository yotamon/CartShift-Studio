'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from "@/lib/motion";
import { Heart, Star } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const favoriteButtonVariants = cva(
  "group relative flex items-center gap-2 p-2 rounded-full transition-colors",
  {
    variants: {
      variant: {
        heart: "",
        star: "",
      },
      active: {
        true: "",
        false: "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
      },
      // Compound variants to handle specific color combos
    },
    compoundVariants: [
      {
        variant: "heart",
        active: true,
        class: "text-rose-500 bg-rose-50 dark:bg-rose-900/20",
      },
      {
        variant: "star",
        active: true,
        class: "text-amber-500 bg-amber-50 dark:bg-amber-900/20",
      },
    ],
    defaultVariants: {
      variant: "heart",
      active: false,
    },
  }
);

const countVariants = cva(
  "text-xs font-bold font-outfit transition-colors",
  {
    variants: {
      variant: {
        heart: "",
        star: "",
      },
      active: {
        true: "",
        false: "text-slate-500",
      },
    },
    compoundVariants: [
      {
        variant: "heart",
        active: true,
        class: "text-rose-600 dark:text-rose-400",
      },
      {
        variant: "star",
        active: true,
        class: "text-amber-600 dark:text-amber-400",
      },
    ],
    defaultVariants: {
      variant: "heart",
      active: false,
    },
  }
);

interface FavoriteButtonProps
  extends Omit<VariantProps<typeof favoriteButtonVariants>, 'active'> {
  initialIsActive?: boolean;
  onToggle?: (isActive: boolean) => void;
  className?: string;
  count?: number;
}

export const FavoriteButton = ({
  initialIsActive = false,
  onToggle,
  className,
  count,
  variant = 'heart'
}: FavoriteButtonProps) => {
  const [isActive, setIsActive] = useState(initialIsActive);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = !isActive;
    setIsActive(newState);
    onToggle?.(newState);
  };

  const Icon = variant === 'heart' ? Heart : Star;
  // Determine particle color based on variant
  const particleColorClass = variant === 'heart' ? "bg-rose-500" : "bg-amber-400";

  return (
    <button
      onClick={handleClick}
      className={cn(favoriteButtonVariants({ variant, active: isActive }), className)}
      aria-label={isActive ? "Unfavorite" : "Favorite"}
    >
      <div className="relative">
        <motion.div
          whileTap={{ scale: 0.8 }}
          animate={{
            scale: isActive ? [1, 1.4, 1] : 1,
            rotate: isActive ? [0, -10, 10, 0] : 0
          }}
          transition={{ duration: 0.4 }}
        >
          <Icon
            size={20}
            className={cn(
              "transition-all duration-300",
              isActive && "fill-current"
            )}
          />
        </motion.div>

        <AnimatePresence>
          {isActive && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: 0,
                    scale: 1,
                    x: Math.cos(i * 60 * (Math.PI / 180)) * 20,
                    y: Math.sin(i * 60 * (Math.PI / 180)) * 20
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={cn(
                    "absolute top-1/2 start-1/2 w-1 h-1 rounded-full",
                    particleColorClass
                  )}
                  style={{ marginLeft: -2, marginTop: -2 }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </div>

      {count !== undefined && (
        <span className={cn(countVariants({ variant, active: isActive }))}>
          {count + (isActive ? 1 : 0)}
        </span>
      )}
    </button>
  );
};

export { favoriteButtonVariants };
