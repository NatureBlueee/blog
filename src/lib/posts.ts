'use client'

import type { BlogPost, PostFormData } from '@/types'
import { generateSlug } from '@/lib/utils'

interface SavePostOptions {
  isPublishing?: boolean
  isDraft?: boolean
}

export async function createPost(
  data: PostFormData & { content: string },
  options: SavePostOptions = {}
): Promise<BlogPost> {
  try {
    if (!data.title) {
      throw new Error('标题不能为空')
    }

    const baseSlug = generateSlug(data.title)
    let slug = baseSlug
    let counter = 1

    // 检查 slug 是否存在
    while (true) {
      try {
        const response = await fetch(`/api/posts/${slug}/exists`)
        if (!response.ok) break

        const { exists } = await response.json()
        if (!exists) break

        slug = `${baseSlug}-${counter}`
        counter++
      } catch (error) {
        console.error('检查 slug 时出错:', error)
        break
      }
    }

    const postData = {
      ...data,
      slug,
      status: options.isPublishing ? 'published' : 'draft',
      published_at: options.isPublishing ? new Date().toISOString() : null,
    }

    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || '创建文章失败')
    }

    return await response.json()
  } catch (error) {
    console.error('创建文章失败:', error)
    throw error instanceof Error ? error : new Error('创建文章失败')
  }
}

export async function updatePost(
  slug: string,
  data: Partial<PostFormData> & { content?: string },
  options: SavePostOptions = {}
): Promise<BlogPost> {
  try {
    const postData = {
      ...data,
      status: options.isPublishing ? 'published' : 'draft',
      published_at: options.isPublishing ? new Date().toISOString() : null,
    }

    const response = await fetch(`/api/posts/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || '更新文章失败')
    }

    return await response.json()
  } catch (error) {
    console.error('更新文章失败:', error)
    throw error instanceof Error ? error : new Error('更新文章失败')
  }
}

export async function savePostVersion(
  slug: string,
  data: { content: string; metadata: any }
): Promise<any> {
  try {
    const response = await fetch(`/api/posts/${slug}/versions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || '保存版本失败')
    }

    return await response.json()
  } catch (error) {
    console.error('保存版本失败:', error)
    throw error instanceof Error ? error : new Error('保存版本失败')
  }
}
