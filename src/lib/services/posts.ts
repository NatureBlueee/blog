import { supabase } from '@/lib/supabase'
import type { Post, PostStatus } from '@/types'

export class PostService {
  async getPosts({
    status,
    limit,
    orderBy,
  }: {
    status?: PostStatus
    limit?: number
    orderBy?: Record<string, 'asc' | 'desc'>
  } = {}) {
    let query = supabase.from('posts').select(`
        *,
        user:user_id(id, email),
        tags:post_tags(tag:tag_id(*))
      `)

    if (status) {
      query = query.eq('status', status)
    }

    if (limit) {
      query = query.limit(limit)
    }

    if (orderBy) {
      Object.entries(orderBy).forEach(([column, order]) => {
        query = query.order(column, { ascending: order === 'asc' })
      })
    }

    const { data, error } = await query

    if (error) throw error

    return data
  }

  async getPostBySlug(slug: string) {
    const { data, error } = await supabase
      .from('posts')
      .select(
        `
        *,
        user:user_id(id, email),
        tags:post_tags(tag:tag_id(*))
      `
      )
      .eq('slug', slug)
      .single()

    if (error) throw error

    return data
  }

  async getTags() {
    const { data, error } = await supabase
      .from('tags')
      .select('*, posts:posts_tags(post_id)')
      .order('name')

    if (error) throw error
    return data.map((tag) => ({
      ...tag,
      post_count: tag.posts?.length || 0,
    }))
  }

  async likePost(slug: string) {
    const { data: post, error: getError } = await supabase
      .from('posts')
      .select('likes')
      .eq('slug', slug)
      .single()

    if (getError) throw getError

    const { data, error: updateError } = await supabase
      .from('posts')
      .update({ likes: (post?.likes || 0) + 1 })
      .eq('slug', slug)
      .select()
      .single()

    if (updateError) throw updateError
    return data
  }
}

export const postService = new PostService()
