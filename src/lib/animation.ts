import type { Variants } from 'framer-motion'

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
}

export const fadeInUp: Variants = {
  hidden: {
    y: 20,
    opacity: 0
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
}

export const scaleIn: Variants = {
  hidden: {
    scale: 0.9,
    opacity: 0
  },
  show: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
}

export const slideIn: Variants = {
  hidden: (direction: 'left' | 'right' = 'right') => ({
    x: direction === 'left' ? -100 : 100,
    opacity: 0
  }),
  show: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
} 