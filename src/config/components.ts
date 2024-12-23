import type { ButtonProps, ImageProps } from '@/types'

export const BUTTON_VARIANTS = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200',
  ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800'
} as const

export const BUTTON_SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
} as const

export const IMAGE_DEFAULTS: Partial<ImageProps> = {
  width: 800,
  height: 400,
  priority: false
}

export const EDITOR_CONFIG = {
  autosaveInterval: 1000,
  maxContentLength: 50000,
  supportedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxImageSize: 5 * 1024 * 1024 // 5MB
} 