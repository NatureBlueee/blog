import { supabase } from '@/lib/supabase'
import type { Post, PostStatus } from '@/types'
import { BaseService } from './base'
import type { BlogPost } from '@/types'

export class PostService extends BaseService {
  async getPosts({
    status,
    limit,
    orderBy,
  }: {
    status?: PostStatus
    limit?: number
    orderBy?: Record<string, 'asc' | 'desc'>
  } = {}) {
    try {
      let query = supabase.from('posts').select(`
          *,
          author:users(id, email),
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

      if (error) {
        console.error('Database query error:', error)
        throw new Error(`获取文章列表失败: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('PostService.getPosts error:', error)
      throw error instanceof Error ? error : new Error('获取文章列表时发生未知错误')
    }
  }

  async getPostBySlug(slug: string) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(
          `
          *,
          author:users(id, email),
          tags:post_tags(tag:tag_id(*))
        `
        )
        .eq('slug', slug)
        .single()

      if (error) {
        console.error('Database query error:', error)
        throw new Error(`获取文章详情失败: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('PostService.getPostBySlug error:', error)
      throw error instanceof Error ? error : new Error('获取文章详情时发生未知错误')
    }
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

  async deleteAll() {
    return this.transaction(async () => {
      // 先删除所有文章标签关联
      const { error: tagError } = await this.supabase.from('post_tags').delete().neq('id', 0)

      if (tagError) throw tagError

      // 再删除所有文章
      const { error: postError } = await this.supabase.from('posts').delete().neq('id', 0)

      if (postError) throw postError

      return true
    }, '删除所有文章')
  }

  async createMany(posts: Partial<BlogPost>[]) {
    return this.transaction(async () => {
      const createdPosts = []

      for (const post of posts) {
        const { tags, ...postData } = post

        // 创建文章
        const { data: createdPost, error: postError } = await this.supabase
          .from('posts')
          .insert({
            ...postData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (postError) throw postError

        // 如果有标签，创建关联
        if (tags && tags.length > 0) {
          // 获取标签 ID
          const { data: tagData } = await this.supabase
            .from('tags')
            .select('id, slug')
            .in('slug', tags)

          if (tagData) {
            const tagRelations = tagData.map((tag) => ({
              post_id: createdPost.id,
              tag_id: tag.id,
            }))

            const { error: relationError } = await this.supabase
              .from('post_tags')
              .insert(tagRelations)

            if (relationError) throw relationError
          }
        }

        createdPosts.push(createdPost)
      }

      return createdPosts
    }, '批量创建文章')
  }
}

export const postService = new PostService()
