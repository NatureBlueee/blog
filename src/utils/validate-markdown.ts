import matter from 'gray-matter'
import type { PostMetadata } from '@/types'

interface ValidationResult {
  isValid: boolean
  error?: string
  metadata?: PostMetadata
}

export function validateMarkdown(content: string): ValidationResult {
  try {
    const { data, content: bodyContent } = matter(content)
    
    if (!data.title?.trim()) {
      return { isValid: false, error: '标题不能为空' }
    }
    if (!data.excerpt?.trim()) {
      return { isValid: false, error: '摘要不能为空' }
    }
    if (!bodyContent.trim()) {
      return { isValid: false, error: '文章内容不能为空' }
    }

    return { 
      isValid: true,
      metadata: data as PostMetadata
    }
  } catch (error) {
    return { 
      isValid: false,
      error: '解析 Markdown 失败'
    }
  }
} 