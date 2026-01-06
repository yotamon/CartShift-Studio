'use client';

import { motion } from '@/lib/motion';
import React from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: 'easeOut', duration: 0.4 }}
      className="w-full min-w-0"
    >
      {children}
    </motion.div>
  );
}
