import { AnimationControls } from 'framer-motion'

declare module 'framer-motion' {
  export interface MotionProps {
    onHoverStart?: () => void
    onHoverEnd?: () => void
    whileHover?: any
    whileTap?: any
    animate?: any
    initial?: any
    exit?: any
    transition?: any
    variants?: any
    viewport?: any
    style?: any
  }

  export function useInView(
    ref: React.RefObject<Element>,
    options?: {
      root?: Element | null
      margin?: string
      amount?: 'some' | 'all' | number
      once?: boolean
    }
  ): boolean

  export function useAnimation(): AnimationControls

  export interface AnimationControls {
    start: (definition: any) => Promise<any>
    stop: () => void
    set: (definition: any) => void
  }
} 