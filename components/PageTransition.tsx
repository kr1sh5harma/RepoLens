'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      key={typeof window !== 'undefined' ? window.location.pathname : 'initial'}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}
