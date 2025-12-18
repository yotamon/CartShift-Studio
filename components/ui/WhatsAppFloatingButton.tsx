"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "./Icon";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { trackWhatsAppClick } from "@/lib/analytics";

interface WhatsAppFloatingButtonProps {
  phoneNumber?: string;
  message?: string;
  className?: string;
  hebrewOnly?: boolean;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
  phoneNumber,
  message,
  className,
  hebrewOnly = true,
}) => {
  const { language } = useLanguage();
  const isHe = language === "he";

  if (hebrewOnly && !isHe) {
    return null;
  }

  const whatsappNumber = phoneNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "1234567890";
  const defaultMessage = isHe ? "שלום! אשמח לשמוע פרטים נוספים." : "Hello! I'd like to get in touch.";
  const finalMessage = message || defaultMessage;

  const phoneNumberClean = whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${phoneNumberClean}${finalMessage ? `?text=${encodeURIComponent(finalMessage)}` : ""}`;

  const handleClick = () => {
    trackWhatsAppClick();
  };

  return (
    <Link
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cn(
        "fixed bottom-20 start-4 md:bottom-6 md:start-6 z-[100] flex items-center justify-center safe-bottom",
        "w-14 h-14 md:w-14 md:h-14 rounded-full bg-[#25D366] text-white",
        "shadow-lg hover:shadow-xl transition-all duration-300",
        "hover:scale-110 active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2",
        "touch-manipulation",
        className
      )}
      aria-label={isHe ? "צרו קשר בוואטסאפ" : "Contact us on WhatsApp"}
    >
      <Icon name="whatsapp" size={28} className="text-white" />
    </Link>
  );
};

