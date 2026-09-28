import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[200px]">
      <motion.div
        className="relative w-12 h-12"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: '2px solid transparent',
            borderTopColor: 'var(--color-accent)',
            borderRightColor: 'var(--color-accent-secondary)',
          }}
        />
        <motion.div
          className="absolute inset-2 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{
            border: '2px solid transparent',
            borderBottomColor: 'var(--color-accent)',
            opacity: 0.5,
          }}
        />
      </motion.div>
    </div>
  );
}
