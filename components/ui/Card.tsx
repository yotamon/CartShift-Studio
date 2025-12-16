"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  accent?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hover = false, glow = false, accent = false }) => {
  return (
    <div
      className={cn(
        "glass-effect rounded-3xl p-8 md:p-10 relative overflow-hidden transition-all duration-300",
        glow && "shadow-premium hover:shadow-premium-hover",
        accent && "border-accent-500/30",
        hover && "hover:scale-[1.02] hover:-translate-y-1",
        className
      )}
    >
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 via-transparent to-primary-500/10 pointer-events-none"></div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return (
    <div className={cn("mb-6", className)}>
      {children}
    </div>
  );
};

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => {
  return (
    <h3 className={cn("text-xl md:text-2xl lg:text-3xl font-display font-bold text-slate-900 dark:text-white leading-tight tracking-tight", className)}>
      {children}
    </h3>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return (
    <div className={cn("text-slate-600 dark:text-surface-300 leading-relaxed", className)}>
      {children}
    </div>
  );
};

