'use client'

import type { BlogPost, PostFormData } from '@/types'
import { generateSlug } from '@/lib/utils'
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

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

    // 移除发布状态的处理，只创建草稿
    const postData = {
      ...data,
      slug,
      status: 'draft',
      published_at: null,
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

    const post = await response.json()

    // 如果需要发布，调用发布接口
    if (options.isPublishing) {
      return await publishPost(post.slug)
    }

    return post
  } catch (error) {
    console.error('创建文章失败:', error)
    throw error instanceof Error ? error : new Error('创建文章失败')
  }
}

export async function updatePost(
  slug: string,
  data: Partial<PostFormData> & { content?: string }
): Promise<BlogPost> {
  try {
    const response = await fetch(`/api/posts/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
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

export async function publishPost(slug: string): Promise<BlogPost> {
  try {
    const response = await fetch(`/api/posts/${slug}/publish`, {
      method: 'POST',
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || '发布文章失败')
    }

    return await response.json()
  } catch (error) {
    console.error('发布文章失败:', error)
    throw error instanceof Error ? error : new Error('发布文章失败')
  }
}

export async function unpublishPost(slug: string): Promise<BlogPost> {
  try {
    const response = await fetch(`/api/posts/${slug}/publish`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || '取消发布失败')
    }

    return await response.json()
  } catch (error) {
    console.error('取消发布失败:', error)
    throw error instanceof Error ? error : new Error('取消发布失败')
  }
}

export async function getAllPosts() {
  const files = await fs.readdir(postsDirectory)
  const posts = await Promise.all(
    files.map(async (filename) => {
      const filePath = path.join(postsDirectory, filename)
      const content = await fs.readFile(filePath, 'utf8')
      const { data, content: markdown } = matter(content)

      return {
        slug: filename.replace(/\.md$/, ''),
        title: data.title,
        status: data.status || 'draft', // 确保有 status 字段
        ...data,
        content: markdown,
      }
    })
  )

  return posts
}
