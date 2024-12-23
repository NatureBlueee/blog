declare module 'next-mdx-remote' {
  import type { ComponentType, ReactElement } from 'react'

  export interface MDXRemoteProps {
    source: string
    components?: Record<string, ComponentType<any>>
  }

  export function MDXRemote(props: MDXRemoteProps): ReactElement
} 