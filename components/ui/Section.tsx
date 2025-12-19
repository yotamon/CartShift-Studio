'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Parallax } from '@/components/ui/Parallax';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: 'default' | 'light' | 'white' | 'glass';
}

export const Section: React.FC<SectionProps> = ({
  children,
  className,
  id,
  background = 'default',
}) => {
  const backgrounds = {
    default: 'bg-[#f0f4f8] dark:bg-surface-900',
    light: 'bg-white/80 dark:bg-surface-800',
    white: 'bg-[#e2e8f0] dark:bg-surface-850',
    glass: 'bg-gradient-to-br from-slate-50 to-slate-100 dark:bg-surface-800',
  };

  const isGlass = background === 'glass';

  return (
    <section
      id={id}
      className={cn(
        'py-section-y md:py-section-y-md lg:py-section-y-lg px-4 sm:px-6 lg:px-8 relative overflow-hidden',
        backgrounds[background],
        className
      )}
    >
      {/* Vibrant gradient background for glass effect visibility */}
      {isGlass && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Ambient glow orbs with parallax */}
          <Parallax speed={0.15}>
            <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-primary-500/18 dark:bg-primary-500/10 rounded-full blur-[100px]"></div>
          </Parallax>
          <Parallax speed={-0.1}>
            <div className="absolute top-[60%] right-[8%] w-[350px] h-[350px] bg-accent-500/15 dark:bg-accent-500/8 rounded-full blur-[80px]"></div>
          </Parallax>
          <Parallax speed={0.2}>
            <div className="absolute top-[30%] right-[25%] w-[500px] h-[500px] bg-primary-400/12 dark:bg-primary-400/8 rounded-full blur-[120px]"></div>
          </Parallax>
          <Parallax speed={-0.15}>
            <div className="absolute bottom-[15%] left-[20%] w-[450px] h-[450px] bg-accent-400/15 dark:bg-accent-400/8 rounded-full blur-[100px]"></div>
          </Parallax>

          {/* Floating geometric shapes with parallax - CTA style */}
          <Parallax speed={0.3}>
            <motion.div
              className="absolute top-[15%] left-[12%] w-16 h-16 border-2 border-primary-500/15 dark:border-primary-400/10 rounded-xl"
              animate={{
                rotate: [0, 90, 180, 270, 360],
                y: [0, -15, 0, 15, 0],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
          </Parallax>

          <Parallax speed={-0.25}>
            <motion.div
              className="absolute top-[70%] right-[15%] w-20 h-20 border-2 border-accent-500/15 dark:border-accent-400/10 rounded-full"
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </Parallax>

          <Parallax speed={0.2}>
            <motion.div
              className="absolute top-[45%] left-[8%] w-24 h-24 border border-primary-400/10 dark:border-primary-300/8 rounded-2xl"
              animate={{
                rotate: [0, -30, 0],
              }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />
          </Parallax>

          <Parallax speed={-0.35}>
            <motion.div
              className="absolute top-[25%] right-[10%] w-12 h-12 bg-accent-500/8 dark:bg-accent-400/5 rounded-lg"
              animate={{
                y: [0, 20, 0],
                rotate: [0, 45, 0],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </Parallax>

          <Parallax speed={0.15}>
            <motion.div
              className="absolute bottom-[25%] right-[30%] w-14 h-14 border border-primary-500/12 dark:border-primary-400/8 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 10, 0],
              }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />
          </Parallax>

          <Parallax speed={-0.2}>
            <motion.div
              className="absolute top-[55%] left-[35%] w-10 h-10 border-2 border-accent-400/10 dark:border-accent-300/8 rounded-lg"
              animate={{
                rotate: [45, 90, 45],
                y: [0, -10, 0],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </Parallax>

          <Parallax speed={0.25}>
            <motion.div
              className="absolute bottom-[35%] left-[55%] w-8 h-8 bg-primary-400/10 dark:bg-primary-300/6 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </Parallax>

          <Parallax speed={-0.12}>
            <motion.div
              className="absolute top-[80%] left-[65%] w-18 h-18 border border-accent-500/10 dark:border-accent-400/6 rounded-xl"
              animate={{
                rotate: [0, -45, 0],
                x: [0, -15, 0],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
          </Parallax>

          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.03)_1px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)]"></div>
        </div>
      )}
      <div className="max-w-7xl mx-auto relative z-10">{children}</div>
    </section>
  );
};

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: 'left' | 'center';
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  className,
  align = 'center',
}) => {
  return (
    <div
      className={cn(
        'mb-10 md:mb-12 lg:mb-16',
        align === 'center' ? 'text-center' : 'text-start',
        className
      )}
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6 md:mb-8 leading-tight tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-surface-300 max-w-4xl mx-auto leading-relaxed font-light">
          {subtitle}
        </p>
      )}
    </div>
  );
};
