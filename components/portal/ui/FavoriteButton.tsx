'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  initialIsActive?: boolean;
  onToggle?: (isActive: boolean) => void;
  className?: string;
  count?: number;
  variant?: 'heart' | 'star';
}

export const FavoriteButton = ({
  initialIsActive = false,
  onToggle,
  className,
  count,
  variant = 'heart'
}: FavoriteButtonProps) => {
  const [isActive, setIsActive] = useState(initialIsActive);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = !isActive;
    setIsActive(newState);
    onToggle?.(newState);
  };

  const Icon = variant === 'heart' ? Heart : Star;

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative flex items-center gap-2 p-2 rounded-full transition-colors",
        isActive
          ? "text-rose-500 bg-rose-50 dark:bg-rose-900/20"
          : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
        className
      )}
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
                    "absolute top-1/2 left-1/2 w-1 h-1 rounded-full",
                    variant === 'heart' ? "bg-rose-500" : "bg-amber-400"
                  )}
                  style={{ marginLeft: -2, marginTop: -2 }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </div>

      {count !== undefined && (
        <span className={cn(
          "text-xs font-bold font-outfit transition-colors",
          isActive ? "text-rose-600 dark:text-rose-400" : "text-slate-500"
        )}>
          {count + (isActive ? 1 : 0)}
        </span>
      )}
    </button>
  );
};
