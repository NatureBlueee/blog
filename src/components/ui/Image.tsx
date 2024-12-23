'use client'

import { useState } from 'react'
import NextImage from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { animations } from '@/styles/design-system'

interface ImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  className?: string
  onClick?: () => void
}

export default function Image({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className = '',
  onClick
}: ImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const handleLoad = () => setIsLoading(false)
  const handleError = () => {
    setError(true)
    setIsLoading(false)
  }

  return (
    <div className={`relative overflow-hidden ${fill ? 'w-full h-full' : ''}`}>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            {...animations.fadeIn}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"
          />
        )}
      </AnimatePresence>

      <motion.div
        {...animations.fadeIn}
        className={`
          ${isLoading ? 'opacity-0' : 'opacity-100'}
          ${error ? 'bg-gray-200 dark:bg-gray-700' : ''}
          transition-opacity duration-300
        `}
      >
        <NextImage
          src={error ? '/images/fallback.jpg' : src}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          priority={priority}
          className={`
            ${error ? 'object-contain' : 'object-cover'}
            ${onClick ? 'cursor-pointer' : ''}
            ${className}
          `}
          onLoad={handleLoad}
          onError={handleError}
          onClick={onClick}
        />
      </motion.div>
    </div>
  )
} 