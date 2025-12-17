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
  search: (
    <>
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </>
  ),
  palette: (
    <>
       <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
       <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
       <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
       <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
       <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </>
  ),
  code: (
    <>
      <path d="M16 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </>
  ),
  rocket: (
    <>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.94 5.25-2.48 7.9a22 22 0 0 1-4.52 2.1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </>
  ),
  check: (
    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  ),
  whatsapp: (
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="currentColor"/>
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
