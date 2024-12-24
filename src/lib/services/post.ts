import { BaseService } from './base'
import type { Post, Tag, PostStatus } from '@/types'
import { SupabaseClient } from '@supabase/supabase-js'

interface CreatePostData extends Partial<Post> {
  tags?: string[] // 标签的 slug 数组
}

export class PostService {
  private supabase: SupabaseClient

  constructor() {
    this.supabase = supabase
  }

  async deleteAll() {
    return this.transaction(async () => {
      // 先删除关联数据
      const { error: tagError } = await this.supabase
        .from('post_tags')
        .delete()
        .not('post_id', 'is', null)

      if (tagError) throw tagError

      // 再删除文章
      const { error: postError } = await this.supabase.from('posts').delete().not('id', 'is', null)

      if (postError) throw postError

      return true
    }, '删除所有文章')
  }

  async create(postData: CreatePostData) {
    return this.transaction(async () => {
      const { tags: tagSlugs, ...post } = postData

      // 1. 创建文章
      const { data: createdPost, error: postError } = await this.supabase
        .from('posts')
        .insert({
          ...post,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (postError) throw postError

      // 2. 如果有标签，创建关联
      if (tagSlugs?.length) {
        const { data: tags, error: tagError } = await this.supabase
          .from('tags')
          .select('id, slug')
          .in('slug', tagSlugs)

        if (tagError) throw tagError

        const tagRelations = tags.map((tag) => ({
          post_id: createdPost.id,
          tag_id: tag.id,
        }))

        const { error: relationError } = await this.supabase.from('post_tags').insert(tagRelations)

        if (relationError) throw relationError
      }

      return createdPost
    }, '创建文章')
  }

  async createMany(posts: CreatePostData[]) {
    return this.transaction(async () => {
      const createdPosts = []
      for (const post of posts) {
        const createdPost = await this.create(post)
        createdPosts.push(createdPost)
      }
      return createdPosts
    }, '批量创建文章')
  }

  async getPosts({
    status,
    limit,
    includeAll = false,
    orderBy,
  }: {
    status?: PostStatus
    limit?: number
    includeAll?: boolean
    orderBy?: Record<string, 'asc' | 'desc'>
  } = {}) {
    try {
      let query = this.supabase
        .from('posts')
        .select(
          `
          *,
          author:users(id, email),
          tags:post_tags(tag:tag_id(*))
        `
        )
        .is('deleted_at', null)

      // 前台只显示已发布文章
      if (!includeAll) {
        query = query.eq('status', 'published')
      }

      if (status) {
        query = query.eq('status', status)
      }

      // 默认按发布时间排序
      if (!orderBy) {
        query = query.order('published_at', { ascending: false })
      }

      const { data, error } = await query

      if (error) throw error

      return data
    } catch (error) {
      console.error('PostService.getPosts error:', error)
      throw error instanceof Error ? error : new Error('获取文章列表时发生未知错误')
    }
  }

  async getPostBySlug(slug: string, includeAll = false) {
    try {
      let query = this.supabase
        .from('posts')
        .select(
          `
          *,
          author:users(id, email),
          tags:post_tags(tag:tag_id(*))
        `
        )
        .eq('slug', slug)
        .is('deleted_at', null)
        .single()

      if (!includeAll) {
        query = query.eq('status', 'published')
      }

      const { data, error } = await query

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('文章不存在或未发布')
        }
        throw error
      }

      // 格式化日期
      if (data) {
        return {
          ...data,
          created_at: new Date(data.created_at).toISOString(),
          updated_at: new Date(data.updated_at).toISOString(),
          published_at: data.published_at ? new Date(data.published_at).toISOString() : null,
        }
      }

      return null
    } catch (error) {
      console.error('PostService.getPostBySlug error:', error)
      throw error instanceof Error ? error : new Error('获取文章详情时发生未知错误')
    }
  }
}

export const postService = new PostService()
