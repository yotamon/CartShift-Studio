import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: "default" | "light" | "white";
}

export const Section: React.FC<SectionProps> = ({
  children,
  className,
  id,
  background = "default"
}) => {
  const backgrounds = {
    default: "bg-slate-50 dark:bg-surface-900",
    light: "bg-white dark:bg-surface-800",
    white: "bg-slate-100 dark:bg-white",
  };

  return (
    <section
      id={id}
      className={cn(
        "py-20 md:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 relative",
        backgrounds[background],
        className
      )}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {children}
      </div>
    </section>
  );
};

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  className,
  align = "center"
}) => {
  return (
    <div className={cn(
      "mb-12",
      align === "center" ? "text-center" : "text-left",
      className
    )}>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-slate-900 dark:text-white mb-8 leading-tight tracking-tight">
        <span className="gradient-text block">{title}</span>
      </h2>
      {subtitle && (
        <p className="text-base md:text-lg text-slate-600 dark:text-surface-300 max-w-4xl mx-auto leading-relaxed font-light">
          {subtitle}
        </p>
      )}
    </div>
  );
};

