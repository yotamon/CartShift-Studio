"use client";

import React, { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Enable the interactive mouse-follow glow effect
   */
  interactive?: boolean;
  /**
   * Intensity of glassmorphism effect (1-3)
   */
  intensity?: 1 | 2 | 3;
  /**
   * Glow color theme
   */
  glowColor?: "primary" | "accent" | "mixed";
  /**
   * Enable the animated border gradient
   */
  animatedBorder?: boolean;
  /**
   * Border radius preset
   */
  radius?: "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
}

export const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({
  children,
  className = "",
  interactive = true,
  intensity = 2,
  glowColor = "mixed",
  animatedBorder = false,
  radius = "2xl",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !interactive) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  }, [interactive]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setMousePosition({ x: 0.5, y: 0.5 });
  }, []);

  // Intensity settings
  const intensitySettings = {
    1: {
      blur: "backdrop-blur-md",
      bg: "bg-white/50 dark:bg-surface-900/40",
      border: "border-white/30 dark:border-white/10",
    },
    2: {
      blur: "backdrop-blur-xl",
      bg: "bg-white/60 dark:bg-surface-900/50",
      border: "border-white/40 dark:border-white/15",
    },
    3: {
      blur: "backdrop-blur-2xl",
      bg: "bg-white/70 dark:bg-surface-900/60",
      border: "border-white/50 dark:border-white/20",
    },
  };

  // Glow color variations
  const glowColors = {
    primary: {
      light: "rgba(99, 102, 241, 0.4)",
      dark: "rgba(99, 102, 241, 0.3)",
    },
    accent: {
      light: "rgba(192, 38, 211, 0.4)",
      dark: "rgba(192, 38, 211, 0.3)",
    },
    mixed: {
      light: "rgba(147, 70, 211, 0.35)",
      dark: "rgba(147, 70, 211, 0.25)",
    },
  };

  const radiusClasses = {
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    full: "rounded-full",
  };

  const settings = intensitySettings[intensity];
  const colors = glowColors[glowColor];

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden transition-all duration-500 ease-out",
        settings.blur,
        settings.bg,
        "border",
        settings.border,
        radiusClasses[radius],
        isHovered && "scale-[1.01] -translate-y-0.5",
        animatedBorder && "liquid-glass-animated-border",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        boxShadow: isHovered
          ? `
              0 20px 60px -15px rgba(0, 0, 0, 0.15),
              0 10px 30px -10px rgba(0, 0, 0, 0.1),
              inset 0 1px 1px rgba(255, 255, 255, 0.3),
              inset 0 -1px 1px rgba(0, 0, 0, 0.05)
            `
          : `
              0 10px 40px -15px rgba(0, 0, 0, 0.1),
              0 4px 20px -8px rgba(0, 0, 0, 0.08),
              inset 0 1px 1px rgba(255, 255, 255, 0.2),
              inset 0 -1px 1px rgba(0, 0, 0, 0.03)
            `,
      }}
    >
      {/* Liquid glass refraction layer */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.6 : 0,
          background: `
            radial-gradient(
              200px circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              ${colors.light},
              transparent 60%
            )
          `,
          filter: "blur(20px)",
        }}
      />

      {/* Highlight edge effect - top */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, ${isHovered ? 0.6 : 0.3}) 20%,
            rgba(255, 255, 255, ${isHovered ? 0.8 : 0.5}) 50%,
            rgba(255, 255, 255, ${isHovered ? 0.6 : 0.3}) 80%,
            transparent 100%
          )`,
        }}
      />

      {/* Highlight edge effect - bottom reflection */}
      <div
        className="absolute inset-x-0 bottom-0 h-px pointer-events-none opacity-50"
        style={{
          background: `linear-gradient(
            90deg,
            transparent 0%,
            rgba(0, 0, 0, 0.1) 20%,
            rgba(0, 0, 0, 0.15) 50%,
            rgba(0, 0, 0, 0.1) 80%,
            transparent 100%
          )`,
        }}
      />

      {/* Mouse-following lens flare */}
      {interactive && isHovered && (
        <div
          className="absolute w-40 h-40 pointer-events-none transition-all duration-150 ease-out"
          style={{
            left: `${mousePosition.x * 100}%`,
            top: `${mousePosition.y * 100}%`,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(
              circle,
              rgba(255, 255, 255, 0.25) 0%,
              rgba(255, 255, 255, 0.1) 30%,
              transparent 70%
            )`,
            filter: "blur(10px)",
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

/**
 * A smaller, more subtle glass panel for navigation elements, badges, etc.
 */
interface LiquidGlassPillProps {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}

export const LiquidGlassPill: React.FC<LiquidGlassPillProps> = ({
  children,
  className = "",
  active = false,
}) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full py-2 px-4",
        "backdrop-blur-lg",
        active
          ? "bg-white/70 dark:bg-white/15 border border-white/50 dark:border-white/25"
          : "bg-white/40 dark:bg-white/10 border border-white/30 dark:border-white/10",
        "transition-all duration-300 ease-out",
        "hover:bg-white/60 dark:hover:bg-white/20",
        "hover:scale-[1.02]",
        className
      )}
      style={{
        boxShadow: active
          ? `
              0 8px 32px -8px rgba(0, 0, 0, 0.15),
              inset 0 1px 1px rgba(255, 255, 255, 0.4)
            `
          : `
              0 4px 16px -4px rgba(0, 0, 0, 0.1),
              inset 0 1px 1px rgba(255, 255, 255, 0.2)
            `,
      }}
    >
      {/* Top highlight */}
      <div className="absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

/**
 * A floating glass button with liquid glass effects
 */
interface LiquidGlassButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "default" | "primary" | "accent";
}

export const LiquidGlassButton: React.FC<LiquidGlassButtonProps> = ({
  children,
  className = "",
  onClick,
  variant = "default",
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const variantStyles = {
    default: {
      bg: "bg-white/60 dark:bg-white/10",
      hoverBg: "hover:bg-white/80 dark:hover:bg-white/20",
      text: "text-surface-900 dark:text-white",
    },
    primary: {
      bg: "bg-primary-500/80 dark:bg-primary-600/60",
      hoverBg: "hover:bg-primary-500/90 dark:hover:bg-primary-600/80",
      text: "text-white",
    },
    accent: {
      bg: "bg-accent-500/80 dark:bg-accent-600/60",
      hoverBg: "hover:bg-accent-500/90 dark:hover:bg-accent-600/80",
      text: "text-white",
    },
  };

  const styles = variantStyles[variant];

  return (
    <button
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={cn(
        "relative overflow-hidden rounded-xl py-3 px-6",
        "backdrop-blur-xl",
        styles.bg,
        styles.hoverBg,
        styles.text,
        "border border-white/30 dark:border-white/15",
        "font-semibold transition-all duration-300 ease-out",
        "hover:scale-[1.02] hover:-translate-y-0.5",
        isPressed && "scale-[0.98] translate-y-0",
        className
      )}
      style={{
        boxShadow: isPressed
          ? `
              0 4px 16px -4px rgba(0, 0, 0, 0.1),
              inset 0 2px 4px rgba(0, 0, 0, 0.1)
            `
          : `
              0 10px 40px -10px rgba(0, 0, 0, 0.2),
              0 4px 20px -4px rgba(0, 0, 0, 0.1),
              inset 0 1px 1px rgba(255, 255, 255, 0.3)
            `,
      }}
    >
      {/* Top highlight */}
      <div className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none" />

      {/* Bottom shadow line */}
      <div className="absolute inset-x-3 bottom-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent pointer-events-none" />

      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default LiquidGlassCard;

