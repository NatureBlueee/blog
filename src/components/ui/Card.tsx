'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ReactNode } from 'react'

interface CardProps {
  title?: string
  description?: string
  image?: string
  href?: string
  tags?: string[]
  children?: ReactNode
  className?: string
  onClick?: () => void
}

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: {
    y: -4,
    transition: { duration: 0.2 }
  },
  tap: { scale: 0.98 }
}

export default function Card({
  title,
  description,
  image,
  href,
  tags,
  children,
  className = '',
  onClick
}: CardProps) {
  const content = (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      className={`
        group relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 
        shadow-sm hover:shadow-lg transition-all duration-300
        ${className}
      `}
      onClick={onClick}
    >
      {image && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={image}
            alt={title || ''}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6">
        {children || (
          <>
            {title && (
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {description}
              </p>
            )}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-700 
                             text-gray-600 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
} 