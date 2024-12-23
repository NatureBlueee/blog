'use client'

import { useEffect } from 'react'
import 'highlight.js/styles/github-dark.css'
import hljs from 'highlight.js'

interface PostContentProps {
  content: string
}

export function PostContent({ content }: PostContentProps) {
  useEffect(() => {
    hljs.highlightAll()
  }, [content])

  return (
    <div className='prose prose-lg dark:prose-invert max-w-none'>
      <div dangerouslySetInnerHTML={{ __html: content }} className='animate-fade-in' />
    </div>
  )
}
