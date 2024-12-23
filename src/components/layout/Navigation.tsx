'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { NAVIGATION } from '@/config/constants'
import { useState, useEffect } from 'react'

export default function Navigation() {
  const { t } = useTranslation()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // 避免服务端渲染时的不匹配
  }

  return (
    <nav className="hidden md:flex items-center space-x-8">
      {NAVIGATION.main.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`text-base transition-colors ${
            pathname === item.href
              ? 'text-primary font-medium'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
          }`}
        >
          {t(item.name)}
        </Link>
      ))}
    </nav>
  )
} 