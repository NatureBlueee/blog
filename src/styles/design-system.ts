import type { Variants } from 'framer-motion'

// 动画效果
export const animations = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 }
  },
  slideInFromRight: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.3 }
  },
  // 导航动画
  navigation: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  },
  // 页面过渡
  page: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.3 }
  },
  // 容器动画
  staggerContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }
} as const

// 渐变色方案
export const gradients = {
  primary: 'bg-gradient-to-r from-violet-600 to-indigo-600',
  secondary: 'bg-gradient-to-r from-teal-400 to-blue-500',
  accent: 'bg-gradient-to-r from-pink-500 to-rose-500',
  background: 'bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800'
} as const

// 阴影效果
export const shadows = {
  sm: 'shadow-sm hover:shadow transition-shadow duration-200',
  md: 'shadow-md hover:shadow-lg transition-shadow duration-200',
  lg: 'shadow-lg hover:shadow-xl transition-shadow duration-200'
} as const

// 交互效果
export const interactions = {
  hover: {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.98
  }
} as const 