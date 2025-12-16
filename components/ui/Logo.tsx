import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className, size = "md", showText = true }) => {
  const sizeConfig = {
    sm: {
      icon: 28,
      text: "text-lg",
      gap: "gap-2",
    },
    md: {
      icon: 36,
      text: "text-xl",
      gap: "gap-2.5",
    },
    lg: {
      icon: 48,
      text: "text-2xl",
      gap: "gap-3",
    },
  };

  const config = sizeConfig[size];

  return (
    <Link
      href="/"
      className={cn(
        "group flex items-center transition-all duration-300 hover:scale-[1.02]",
        config.gap,
        className
      )}
    >
      {/* Logo Icon with glow effect on hover */}
      <div className="relative flex-shrink-0">
        <Image
          src="/images/CartShift-Logo.svg"
          alt="CartShift Studio"
          width={config.icon}
          height={config.icon}
          className="transition-transform duration-300 group-hover:scale-110 drop-shadow-sm group-hover:drop-shadow-md"
          priority
        />
        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-accent-500/20 to-primary-500/0 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 scale-150" />
      </div>

      {/* Text with gradient effect */}
      {showText && (
        <span className={cn(
          "font-display font-black gradient-text transition-all duration-300",
          config.text
        )}>
          CartShift Studio
        </span>
      )}
    </Link>
  );
};

