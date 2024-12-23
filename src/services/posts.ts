import type { PostFormData, BlogPost } from '@/types'

export const postService = {
  async getStats() {
    const response = await fetch('/api/posts/stats')
    if (!response.ok) throw new Error('获取统计数据失败')
    return response.json()
  },

  async createPost(data: PostFormData): Promise<BlogPost> {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('创建文章失败')
    }

    return response.json()
  },
}

export const createPost = postService.createPost.bind(postService)
