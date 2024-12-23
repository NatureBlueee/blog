'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Moon, Sun, X } from 'lucide-react'

interface NavItem {
  href: string
  label: string
}

interface MobileNavProps {
  isOpen: boolean
  onCloseAction: () => void
  navItems: NavItem[]
}

const overlayVariants: Variants = {
  closed: { 
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  },
  open: { 
    opacity: 0.5,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
}

const menuVariants: Variants = {
  closed: {
    x: '100%',
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  },
  open: {
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.48, 0.15, 0.25, 0.96]
    }
  }
}

const itemVariants: Variants = {
  closed: { 
    x: 20,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  },
  open: { 
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.48, 0.15, 0.25, 0.96]
    }
  }
}

export default function MobileNav({ isOpen, onCloseAction, navItems }: MobileNavProps) {
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onCloseAction}
            className="fixed inset-0 z-40 bg-black"
          />
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 right-0 bottom-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-lg"
          >
            <div className="p-6">
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onCloseAction}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </motion.button>
              </div>

              <nav className="mt-8 space-y-6">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.href}
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onCloseAction}
                      className="block text-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle theme"
                >
                  <div className="flex items-center justify-center">
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    <span className="ml-2">{theme === 'dark' ? '切换到亮色' : '切换到暗色'}</span>
                  </div>
                </motion.button>
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 