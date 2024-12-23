'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import type { Variants, MotionValue } from 'framer-motion'
import { Menu, Moon, Sun } from 'lucide-react'
import MobileNav from './MobileNav'

const navItems = [
  { href: '/', label: '首页' },
  { href: '/blog', label: '博客' },
  { href: '/projects', label: '项目' },
  { href: '/about', label: '关于' },
]

const headerVariants: Variants = {
  initial: { 
    y: -20, 
    opacity: 0,
  },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  exit: { 
    y: -20, 
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  }
}

const navItemVariants: Variants = {
  initial: { 
    opacity: 0, 
    y: -10 
  },
  animate: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  }
}

type Background = {
  background: string
  opacity: number
}

export default function Header() {
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  
  const { scrollY } = useScroll()
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  
  const headerBackground = useTransform(
    smoothScrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.9)']
  )
  
  const headerBackgroundDark = useTransform(
    smoothScrollY,
    [0, 100],
    ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.9)']
  )

  const opacity = useTransform(
    smoothScrollY,
    [0, 100],
    [0, 1]
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCloseAction = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <motion.header
        variants={headerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{
          background: theme === 'dark' 
            ? headerBackgroundDark.get() 
            : headerBackground.get(),
          opacity: opacity.get()
        }}
        className="fixed top-0 left-0 right-0 z-40 px-6 transition-colors backdrop-blur-md"
      >
        <nav className="max-w-7xl mx-auto h-16 flex items-center justify-between">
          <Link 
            href="/"
            className="text-xl font-bold text-gray-900 dark:text-white hover:opacity-80 transition-opacity"
          >
            Your Logo
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                variants={navItemVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </motion.button>
        </nav>
      </motion.header>

      <MobileNav
        isOpen={isMenuOpen}
        onCloseAction={handleCloseAction}
        navItems={navItems}
      />
    </>
  )
} 