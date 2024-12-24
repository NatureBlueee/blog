'use client'

import { useEffect, useState } from 'react'
import { MDXRemote } from 'next-mdx-remote'
import type { MDXRemoteSerializeResult } from 'next-mdx-remote'

interface PostContentProps {
  content: string
}

export function PostContent({ content }: PostContentProps) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null)

  useEffect(() => {
    const loadContent = async () => {
      const { serialize } = await import('next-mdx-remote/serialize')
      const remarkGfm = (await import('remark-gfm')).default
      const rehypePrism = (await import('rehype-prism-plus')).default

      const source = await serialize(content, {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypePrism],
        },
      })
      setMdxSource(source)
    }

    loadContent()
  }, [content])

  if (!mdxSource) {
    return (
      <div className='animate-pulse'>
        <div className='h-4 bg-gray-200 rounded w-3/4 mb-4'></div>
        <div className='h-4 bg-gray-200 rounded w-1/2 mb-4'></div>
        <div className='h-4 bg-gray-200 rounded w-5/6'></div>
      </div>
    )
  }

  return (
    <article className='prose prose-lg dark:prose-invert max-w-none'>
      <MDXRemote {...mdxSource} />
    </article>
  )
}
