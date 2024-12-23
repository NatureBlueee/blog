'use client'

import { useState, useEffect } from 'react'
import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import remarkGfm from 'remark-gfm'
import rehypePrism from 'rehype-prism-plus'
import { CustomComponents } from '@/components/blog/mdx-components'

interface PostPreviewProps {
  content: string
}

export default function PostPreview({ content }: PostPreviewProps) {
  const [mdxSource, setMdxSource] = useState<any>(null)

  useEffect(() => {
    const compileMdx = async () => {
      const compiled = await serialize(content, {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypePrism],
        },
      })
      setMdxSource(compiled)
    }

    compileMdx()
  }, [content])

  if (!mdxSource) {
    return <div className="animate-pulse">加载预览...</div>
  }

  return (
    <article className="prose dark:prose-invert max-w-none">
      <MDXRemote {...mdxSource} components={CustomComponents} />
    </article>
  )
} 