'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TocItem {
  id: string
  title: string
  level: number
}

interface TableOfContentsProps {
  items: TocItem[]
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '0px 0px -80% 0px',
      }
    )

    // 观察所有标题元素
    items.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      items.forEach((item) => {
        const element = document.getElementById(item.id)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [items])

  if (items.length === 0) {
    return null
  }

  return (
    <nav className="hidden lg:block sticky top-24 max-h-[calc(100vh-6rem)] overflow-auto">
      <h2 className="font-semibold text-gray-900 dark:text-white mb-4">目录</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`pl-${(item.level - 1) * 4}`}
          >
            <button
              onClick={() => {
                const element = document.getElementById(item.id)
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className={`text-sm hover:text-primary transition-colors ${
                activeId === item.id
                  ? 'text-primary font-medium'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {item.title}
            </button>
          </motion.li>
        ))}
      </ul>
    </nav>
  )
} 