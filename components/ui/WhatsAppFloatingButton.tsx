"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "./Icon";
import { cn } from "@/lib/utils";

interface WhatsAppFloatingButtonProps {
  phoneNumber?: string;
  message?: string;
  className?: string;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
  phoneNumber,
  message = "Hello! I'd like to get in touch.",
  className,
}) => {
  const whatsappNumber = phoneNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "1234567890";

  const phoneNumberClean = whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${phoneNumberClean}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

  return (
    <Link
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed bottom-6 right-6 z-[100] flex items-center justify-center",
        "w-16 h-16 md:w-14 md:h-14 rounded-full bg-[#25D366] text-white",
        "shadow-lg hover:shadow-xl transition-all duration-300",
        "hover:scale-110 active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2",
        "touch-manipulation",
        className
      )}
      aria-label="Contact us on WhatsApp"
    >
      <Icon name="whatsapp" size={28} className="text-white" />
    </Link>
  );
};

