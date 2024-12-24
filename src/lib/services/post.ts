import { BaseService } from './base'
import type { Post, Tag, PostStatus } from '@/types'

interface CreatePostData extends Partial<Post> {
  tags?: string[] // 标签的 slug 数组
}

class PostService extends BaseService {
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
    orderBy,
  }: {
    status?: PostStatus
    limit?: number
    orderBy?: Record<string, 'asc' | 'desc'>
  } = {}) {
    try {
      let query = this.supabase.from('posts').select(`
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

      if (error) throw error

      return data
    } catch (error) {
      console.error('PostService.getPosts error:', error)
      throw error instanceof Error ? error : new Error('获取文章列表时发生未知错误')
    }
  }

  async getPostBySlug(slug: string) {
    try {
      const { data, error } = await this.supabase
        .from('posts')
        .select(
          `
          *,
          author:users(id, email),
          tags:post_tags(tag:tags(*))
        `
        )
        .eq('slug', slug)
        .single()

      if (error) throw error
      if (!data) throw new Error('文章不存在')

      // 格式化日期
      return {
        ...data,
        created_at: new Date(data.created_at).toISOString(),
        updated_at: new Date(data.updated_at).toISOString(),
        published_at: data.published_at ? new Date(data.published_at).toISOString() : null,
      }
    } catch (error) {
      console.error('PostService.getPostBySlug error:', error)
      throw error instanceof Error ? error : new Error('获取文章详情时发生未知错误')
    }
  }
}

export const postService = new PostService()
