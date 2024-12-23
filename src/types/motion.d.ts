import type { HTMLMotionProps } from 'framer-motion'

declare module 'framer-motion' {
  export type VariantLabels = string | string[]
  export type TargetAndTransition = {
    [key: string]: any
  }

  export interface Variant {
    [key: string]: any
  }

  export interface Variants {
    [key: string]: Variant
  }

  export interface MotionStyle extends React.CSSProperties {
    x?: number | string
    y?: number | string
    scale?: number
    rotate?: number
    background?: string | MotionValue<string>
    backdropFilter?: string
    opacity?: number | MotionValue<number>
  }

  export interface MotionProps extends HTMLMotionProps<'div'> {
    variants?: Variants
    initial?: VariantLabels | TargetAndTransition
    animate?: VariantLabels | TargetAndTransition
    exit?: VariantLabels | TargetAndTransition
    whileHover?: VariantLabels | TargetAndTransition
    whileTap?: VariantLabels | TargetAndTransition
    whileInView?: VariantLabels | TargetAndTransition
    viewport?: object
    style?: MotionStyle
    transition?: {
      duration?: number
      delay?: number
      ease?: string | number[]
      type?: string
    }
  }

  export interface AnimatePresenceProps {
    children: React.ReactNode
    mode?: 'sync' | 'wait' | 'popLayout'
  }

  export interface MotionValue<T = any> {
    get(): T
    set(value: T): void
    subscribe(subscriber: (value: T) => void): () => void
  }

  export interface UseScrollResult {
    scrollX: MotionValue<number>
    scrollY: MotionValue<number>
    scrollXProgress: MotionValue<number>
    scrollYProgress: MotionValue<number>
  }

  export interface TransformOptions {
    clamp?: boolean
    ease?: string | number[]
    mixer?: any
  }

  export type MotionTransform = <T>(
    input: MotionValue<number>,
    inputRange: number[],
    outputRange: T[],
    options?: TransformOptions
  ) => MotionValue<T>

  export interface Motion {
    (component: any): React.ForwardRefExoticComponent<any>
    div: React.ForwardRefExoticComponent<MotionProps>
    header: React.ForwardRefExoticComponent<MotionProps>
    button: React.ForwardRefExoticComponent<MotionProps>
    useScroll: () => UseScrollResult
    useTransform: MotionTransform
  }

  const motion: Motion
  export { motion }

  export function useScroll(): {
    scrollX: MotionValue<number>
    scrollY: MotionValue<number>
    scrollXProgress: MotionValue<number>
    scrollYProgress: MotionValue<number>
  }

  export function useTransform<T>(
    input: MotionValue<number>,
    inputRange: number[],
    outputRange: T[],
    options?: TransformOptions
  ): MotionValue<T>

  export function useMotionValue<T>(initial: T): MotionValue<T>

  export function useSpring<T>(
    value: MotionValue<T> | T,
    config?: {
      stiffness?: number
      damping?: number
      mass?: number
      restDelta?: number
    }
  ): MotionValue<T>
} 