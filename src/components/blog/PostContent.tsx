'use client'

import { useEffect, useMemo } from 'react'
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'
import Prism from 'prismjs'

// 配置 marked
marked.setOptions({
  gfm: true,
  breaks: true,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  highlight: function (code, lang) {
    if (Prism.languages[lang]) {
      return Prism.highlight(code, Prism.languages[lang], lang)
    }
    return code
  },
})

// 配置 DOMPurify
const purifyConfig = {
  ADD_TAGS: ['pre', 'code'],
  ADD_ATTR: ['class', 'tabindex', 'language-*'],
}

export function PostContent({ content }: { content: string }) {
  // 使用 useMemo 缓存处理后的内容
  const htmlContent = useMemo(() => {
    const parsed = marked.parse(content, {
      mangle: false,
      headerIds: false,
      langPrefix: 'language-', // 确保代码块的语言类名前缀一致
    })
    return DOMPurify.sanitize(parsed, purifyConfig)
  }, [content])

  useEffect(() => {
    // 在客户端渲染后高亮代码
    requestAnimationFrame(() => {
      Prism.highlightAll()
    })
  }, [htmlContent])

  return (
    <article
      className='prose prose-lg dark:prose-invert max-w-none'
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}
