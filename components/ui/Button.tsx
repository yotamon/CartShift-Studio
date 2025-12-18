"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

type ButtonState = "idle" | "loading" | "success" | "error";

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragEnd' | 'onDragStart' | 'onAnimationStart' | 'onAnimationEnd'> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  loading?: boolean;
  state?: ButtonState;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, loading = false, state = "idle", disabled, ...props }, ref) => {
    const currentState: ButtonState = loading ? "loading" : state;

    const baseStyles = "font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-surface-950 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden";

    const variants = {
      primary: "fashion-gradient text-white hover:shadow-glow-primary focus:ring-primary-500 shadow-lg hover:scale-[1.02] active:scale-[0.98] shine-sweep",
      secondary: "bg-accent-600 text-white hover:bg-accent-500 focus:ring-accent-500 shadow-glow hover:shadow-glow active:scale-[0.98] shine-sweep",
      outline: "border-2 border-accent-600 dark:border-accent-500/50 text-accent-600 dark:text-accent-400 hover:border-accent-700 dark:hover:border-accent-500 hover:bg-accent-50 dark:hover:bg-accent-500/10 backdrop-blur-sm focus:ring-accent-500 active:scale-[0.98]",
    };

    const stateVariants = {
      idle: variants[variant],
      loading: variants[variant],
      success: "bg-success text-white hover:bg-success focus:ring-success shadow-lg",
      error: "bg-error text-white hover:bg-error focus:ring-error shadow-lg",
    };

    const sizes = {
      sm: "px-5 py-2.5 text-sm",
      md: "px-7 py-3.5 text-base",
      lg: "px-9 py-4 text-lg",
    };

    const isDisabled = disabled || currentState === "loading" || currentState === "success" || currentState === "error";

    return (
      <motion.button
        ref={ref}
        {...props}
        whileHover={currentState === "idle" ? { y: -2 } : undefined}
        whileTap={currentState === "idle" ? { scale: 0.98 } : undefined}
        className={cn(baseStyles, stateVariants[currentState], sizes[size], "touch-manipulation", className)}
        disabled={isDisabled}
      >
        {variant === "primary" && currentState === "idle" && (
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rtl:bg-gradient-to-l translate-x-[-100%] group-hover:translate-x-[100%] rtl:translate-x-[100%] rtl:group-hover:translate-x-[-100%] transition-transform duration-700"></span>
        )}
        <span className="relative z-10 flex items-center justify-center gap-2">
          <AnimatePresence mode="wait">
            {currentState === "loading" && (
              <motion.svg
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </motion.svg>
            )}
            {currentState === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Check className="h-5 w-5" strokeWidth={3} />
              </motion.div>
            )}
            {currentState === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <X className="h-5 w-5" strokeWidth={3} />
              </motion.div>
            )}
          </AnimatePresence>
          {currentState === "idle" || currentState === "loading" ? children : null}
          {currentState === "success" && <span>Success!</span>}
          {currentState === "error" && <span>Error</span>}
        </span>
      </motion.button>
    );
  }
);

Button.displayName = "Button";
