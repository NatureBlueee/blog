import { useMemo } from 'react'
import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import remarkGfm from 'remark-gfm'
import rehypePrism from 'rehype-prism-plus'
import type { PreviewProps } from '@/types'

export function MarkdownPreview({ content, components = {} }: PreviewProps) {
  const mdxSource = useMemo(async () => {
    return await serialize(content, {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypePrism]
      }
    })
  }, [content])

  return (
    <div className="prose dark:prose-invert max-w-none">
      <MDXRemote {...mdxSource} components={components} />
    </div>
  )
} 