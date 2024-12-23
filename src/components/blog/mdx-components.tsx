import { ComponentProps } from 'react'

interface CustomHeadingProps {
  children: React.ReactNode
}

export const CustomComponents = {
  h1: function CustomH1({ children }: CustomHeadingProps) {
    return (
      <h1 className="text-3xl font-bold tracking-tight mt-8 mb-4">
        {children}
      </h1>
    )
  },
  h2: function CustomH2({ children }: CustomHeadingProps) {
    return (
      <h2 className="text-2xl font-semibold tracking-tight mt-6 mb-3">
        {children}
      </h2>
    )
  },
  pre: function CustomPre({ children }: { children: React.ReactNode }) {
    return (
      <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
        {children}
      </pre>
    )
  },
  img: function CustomImage({ src, alt, ...props }: ComponentProps<'img'>) {
    return (
      <img
        src={src}
        alt={alt}
        className="rounded-lg max-w-full h-auto"
        {...props}
      />
    )
  }
} 