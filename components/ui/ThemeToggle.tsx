"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 rounded-xl bg-white/5 dark:bg-white/5 border border-white/10 dark:border-white/10 hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-300 shadow-premium"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <div className="relative w-6 h-6">
        <motion.div
          initial={false}
          animate={{
            scale: theme === "light" ? 1 : 0,
            opacity: theme === "light" ? 1 : 0,
            rotate: theme === "light" ? 0 : 180,
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Sun className="text-amber-500" size={24} />
        </motion.div>

        <motion.div
          initial={false}
          animate={{
            scale: theme === "dark" ? 1 : 0,
            opacity: theme === "dark" ? 1 : 0,
            rotate: theme === "dark" ? 0 : -180,
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Moon className="text-accent-400" size={24} />
        </motion.div>
      </div>
    </button>
  );
};
