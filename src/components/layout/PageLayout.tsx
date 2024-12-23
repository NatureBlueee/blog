'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { animations } from '@/styles/design-system'
import Navigation from './Navigation'
import ParticleBackground from '../effects/ParticleBackground'

interface PageLayoutProps {
  children: ReactNode
  className?: string
  showParticles?: boolean
}

export default function PageLayout({
  children,
  className = '',
  showParticles = false
}: PageLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      <main className="flex-grow">
        {children}
      </main>
    </motion.div>
  )
} 