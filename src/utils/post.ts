import matter from 'gray-matter'
import type { PostMetadata } from '@/types'

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function validatePost(content: string): { 
  isValid: boolean
  error?: string 
  metadata?: PostMetadata
} {
  try {
    const { data, content: bodyContent } = matter(content)
    
    // 验证必填字段
    if (!data.title?.trim()) {
      return { isValid: false, error: '标题不能为空' }
    }
    if (!data.excerpt?.trim()) {
      return { isValid: false, error: '摘要不能为空' }
    }
    if (!data.category?.trim()) {
      return { isValid: false, error: '分类不能为空' }
    }
    if (!Array.isArray(data.tags)) {
      return { isValid: false, error: '标签必须是数组' }
    }
    if (!bodyContent.trim()) {
      return { isValid: false, error: '文章内容不能为空' }
    }

    // 验证日期格式
    const date = new Date(data.date)
    if (isNaN(date.getTime())) {
      return { isValid: false, error: '日期格式无效' }
    }

    return { 
      isValid: true, 
      metadata: data as PostMetadata 
    }
  } catch (error) {
    return { 
      isValid: false, 
      error: 'Frontmatter 格式错误' 
    }
  }
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
} 