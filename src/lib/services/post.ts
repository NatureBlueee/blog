import { BaseService } from './base'
import type { Post, Tag, PostStatus, PostQueryParams } from '@/types'

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

  async getPosts(params: PostQueryParams = {}) {
    return this.transaction(async () => {
      // 1. 获取文章和标签
      const { data: posts, error } = await this.supabase
        .from('posts')
        .select(
          `
          *,
          tags:post_tags (
            tag:tags (
              id,
              name,
              slug
            )
          )
        `
        )
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(params.limit || 100)

      if (error) {
        console.error('查询文章出错:', error)
        throw error
      }

      // 2. 批量查询所有文章的浏览量
      const postIds = posts?.map((post) => post.id) || []
      const { data: viewsData } = await this.supabase
        .from('post_views')
        .select('post_id, id')
        .in('post_id', postIds)

      // 3. 统计每篇文章的浏览量
      const viewsCount =
        viewsData?.reduce(
          (acc, view) => {
            acc[view.post_id] = (acc[view.post_id] || 0) + 1
            return acc
          },
          {} as Record<string, number>
        ) || {}

      // 4. 组装最终数据
      return (
        posts?.map((post) => ({
          ...post,
          views: viewsCount[post.id] || 0,
          tags: post.tags?.map((t) => t.tag) || [],
        })) || []
      )
    }, '获取文章列表')
  }

  async getPostBySlug(slug: string) {
    return this.transaction(async () => {
      const { data: post, error } = await this.supabase
        .from('posts')
        .select(
          `
          *,
          author:author_id (
            id,
            email
          ),
          tags:post_tags (
            tag:tags (
              id,
              name,
              slug
            )
          ),
          views:post_views (
            id
          )
        `
        )
        .eq('slug', slug)
        .is('deleted_at', null)
        .single()

      if (error) throw error

      return {
        ...post,
        views: post.views?.length || 0,
      }
    }, '获取文章详情')
  }

  async deletePost(slug: string) {
    return this.transaction(async () => {
      const { error } = await this.supabase
        .from('posts')
        .update({ deleted_at: new Date().toISOString() })
        .eq('slug', slug)

      if (error) throw error
      return true
    }, '删除文章')
  }

  async getRecentPosts(limit: number = 5) {
    return this.transaction(async () => {
      // 1. 获取基础文章数据
      const { data: posts, error } = await this.supabase
        .from('posts')
        .select(
          `
          id,
          title,
          slug,
          created_at,
          status,
          post_tags (
            tag:tags(*)
          )
        `
        )
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      // 2. 获取文章访问量
      const { data: viewsData, error: viewsError } = await this.supabase
        .from('post_views')
        .select('post_id')

      if (viewsError) throw viewsError

      // 3. 合并数据
      const postsWithViews = posts.map((post) => ({
        ...post,
        views: viewsData.filter((view) => view.post_id === post.id).length,
      }))

      return postsWithViews
    }, '获取最近文章')
  }

  async getPostStats() {
    return this.transaction(async () => {
      // 1. 获取基础文章数据
      const { data: posts, error } = await this.supabase
        .from('posts')
        .select(
          `
          id,
          status,
          created_at
        `
        )
        .is('deleted_at', null)

      if (error) throw error

      // 2. 单独获取总浏览量
      const { data: viewsData, error: viewsError } = await this.supabase
        .from('post_views')
        .select('id')

      if (viewsError) throw viewsError

      // 3. 计算统计数据
      const stats = {
        total: posts.length,
        published: posts.filter((post) => post.status === 'published').length,
        draft: posts.filter((post) => post.status === 'draft').length,
        totalViews: viewsData?.length || 0,
        recentPosts: posts
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)
          .map((post) => ({
            id: post.id,
            status: post.status,
            created_at: post.created_at,
          })),
      }

      console.log('文章统计数据:', {
        ...stats,
        viewsQuery: '单独查询 post_views 表',
      })
      return stats
    }, '获取文章统计数据')
  }
}

export const postService = new PostService()
