'use client'

import { ReactNode } from 'react'
import { motion, Variants } from 'framer-motion'
import { animations } from '@/styles/design-system'

interface AnimatedContainerProps {
  children: ReactNode
  animation?: keyof typeof animations
  customVariants?: Variants
  className?: string
  delay?: number
}

export default function AnimatedContainer({
  children,
  animation = 'fadeIn',
  customVariants,
  className = '',
  delay = 0
}: AnimatedContainerProps) {
  const variants = customVariants || animations[animation]

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        ...variants.transition,
        delay: delay
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
} 