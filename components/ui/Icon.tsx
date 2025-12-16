"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { logWarn } from "@/lib/error-handler";

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

const icons: Record<string, React.ReactNode> = {
  "shopping-cart": (
    <>
      <path d="M7 18C5.17595 18.4117 4 19.0443 4 19.7537C4 20.9943 7.58172 22 12 22C16.4183 22 20 20.9943 20 19.7537C20 19.0443 18.8241 18.4117 17 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M9 11L6 14L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 11H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M20 14C20 15.6569 18.6569 17 17 17C15.3431 17 14 15.6569 14 14C14 12.3431 15.3431 11 17 11C18.6569 11 20 12.3431 20 14Z" stroke="currentColor" strokeWidth="2"/>
      <circle cx="9" cy="5" r="3" stroke="currentColor" strokeWidth="2"/>
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 3C8 6 8 11 12 14C16 11 16 6 12 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M3 12C6 8 11 8 14 12C11 16 6 16 3 12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="1" fill="currentColor"/>
      <path d="M12 3L12 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M17.5 6.5L13 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M21 12L13 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </>
  ),
  handshake: (
    <>
      <path d="M12 5.5C12 4.11929 13.1193 3 14.5 3C15.8807 3 17 4.11929 17 5.5C17 6.88071 15.8807 8 14.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 5.5C12 4.11929 10.8807 3 9.5 3C8.11929 3 7 4.11929 7 5.5C7 6.88071 8.11929 8 9.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M9 8V13C9 13.5523 8.55228 14 8 14H6C5.44772 14 5 13.5523 5 13V10C5 9.44772 5.44772 9 6 9H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M15 8V13C15 13.5523 15.4477 14 16 14H18C18.5523 14 19 13.5523 19 13V10C19 9.44772 18.5523 9 18 9H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 14V18C8 19.1046 8.89543 20 10 20H14C15.1046 20 16 19.1046 16 18V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </>
  ),
  bolt: (
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  ),
  "chart-up": (
    <path d="M3 3L7 7M21 3L17 7M7 7L3 21L9 17M17 7L21 21L15 17M7 7H17M7 7V9M17 7V9M9 17L12 14L15 17M9 17V19C9 19.5523 9.44772 20 10 20H14C14.5523 20 15 19.5523 15 19V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  ),
  star: (
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor"/>
  ),
  "arrow-right": (
    <path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  ),
};

export const Icon: React.FC<IconProps> = ({ name, className = "", size = 24 }) => {
  const iconContent = icons[name];

  if (!iconContent) {
    logWarn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block", className)}
      aria-hidden="true"
    >
      {iconContent}
    </svg>
  );
};
