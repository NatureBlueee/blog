'use client'

import { MDXRemote } from 'next-mdx-remote'
import { CustomComponents } from './mdx-components'

interface ArticleContentProps {
  source: any // MDX source from server
}

export default function ArticleContent({ source }: ArticleContentProps) {
  return (
    <article className="prose dark:prose-invert max-w-none">
      <MDXRemote {...source} components={CustomComponents} />
    </article>
  )
} 