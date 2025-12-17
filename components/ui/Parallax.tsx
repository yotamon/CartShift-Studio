"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  /** Speed multiplier. Positive = moves slower than scroll, Negative = moves faster/opposite */
  speed?: number;
  /** Direction of parallax movement */
  direction?: "vertical" | "horizontal";
}

/**
 * Parallax - Creates a scroll-linked parallax effect on children.
 * Elements move at different speeds relative to scroll position.
 */
export const Parallax: React.FC<ParallaxProps> = ({
  children,
  className = "",
  speed = 0.5,
  direction = "vertical",
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Calculate movement range based on speed
  const range = 100 * speed;

  const y = useTransform(scrollYProgress, [0, 1], [-range, range]);
  const x = useTransform(scrollYProgress, [0, 1], [-range, range]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div
        style={direction === "vertical" ? { y } : { x }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
};

interface ParallaxLayerProps {
  children: React.ReactNode;
  className?: string;
  /** Depth layer (0 = background, higher = closer to viewer) */
  depth?: number;
  /** Base speed multiplier */
  baseSpeed?: number;
}

/**
 * ParallaxLayer - For creating layered depth effects.
 * Higher depth values move faster, creating a 3D depth illusion.
 */
export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children,
  className = "",
  depth = 1,
  baseSpeed = 0.1,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Higher depth = faster movement = appears closer
  const speed = baseSpeed * depth;
  const range = 50 * speed;

  const y = useTransform(scrollYProgress, [0, 1], [range, -range]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1 - depth * 0.02, 1, 1 + depth * 0.02]);

  return (
    <div ref={ref} className={`${className}`}>
      <motion.div
        style={{ y, scale }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
};

interface ParallaxTextProps {
  children: React.ReactNode;
  className?: string;
  /** Animation type */
  type?: "fade-up" | "slide-in" | "scale";
}

/**
 * ParallaxText - Text that animates into view with parallax effects.
 */
export const ParallaxText: React.FC<ParallaxTextProps> = ({
  children,
  className = "",
  type = "fade-up",
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.4"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const animations: Record<string, { y?: MotionValue<number>; x?: MotionValue<number>; scale?: MotionValue<number> }> = {
    "fade-up": { y: useTransform(scrollYProgress, [0, 1], [50, 0]) },
    "slide-in": { x: useTransform(scrollYProgress, [0, 1], [-100, 0]) },
    "scale": { scale: useTransform(scrollYProgress, [0, 1], [0.8, 1]) },
  };

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={{ opacity, ...animations[type] }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
};

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  /** Amplitude of float animation in pixels */
  amplitude?: number;
  /** Duration of one float cycle in seconds */
  duration?: number;
  /** Delay before animation starts */
  delay?: number;
  /** Also rotate while floating */
  rotate?: boolean;
}

/**
 * FloatingElement - Creates a gentle floating animation for decorative elements.
 * Combine with Parallax for layered depth effects.
 */
export const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  className = "",
  amplitude = 20,
  duration = 6,
  delay = 0,
  rotate = false,
}) => {
  return (
    <motion.div
      className={`${className}`}
      animate={{
        y: [0, -amplitude, 0],
        ...(rotate && { rotate: [0, 5, -5, 0] }),
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
};
