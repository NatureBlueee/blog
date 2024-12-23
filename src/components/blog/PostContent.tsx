'use client'

import { useEffect } from 'react'
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'
import Prism from 'prismjs'

// 基础语言支持
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'

// 使用默认主题
import 'prismjs/themes/prism.css'

interface PostContentProps {
  content: string
}

export function PostContent({ content }: PostContentProps) {
  useEffect(() => {
    // 在客户端渲染后高亮代码
    Prism.highlightAll()
  }, [content])

  // 将 Markdown 转换为 HTML 并清理
  const htmlContent = DOMPurify.sanitize(marked(content))

  return (
    <div
      className='prose prose-lg dark:prose-invert max-w-none'
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}
