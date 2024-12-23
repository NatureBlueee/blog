import { createClient } from '@supabase/supabase-js'
import { BaseService } from './base'
import { DatabaseError } from '@/lib/errors'
import type { BlogPost, UpdatePostInput } from '@/types'

export class PostService extends BaseService {
  async getPosts({ status }: { status?: string } = {}) {
    return this.transaction(async () => {
      let query = this.supabase
        .from('posts')
        .select(
          `
          id,
          title,
          slug,
          content,
          excerpt,
          featured_image,
          seo_title,
          seo_description,
          status,
          view_count,
          published_at,
          created_at,
          updated_at,
          is_archived,
          author:author_id(name, avatar_url),
          categories:post_categories(
            category:category_id(id, name, slug)
          ),
          tags:post_tags(
            tag:tag_id(id, name, slug)
          )
        `
        )
        .order('created_at', { ascending: false })
        .is('deleted_at', null)

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query

      if (error) {
        throw new DatabaseError('获取文章列表失败', 'FETCH_POSTS_ERROR', 500, error)
      }

      return (
        data?.map((post) => ({
          ...post,
          categories: post.categories?.map((c) => c.category),
          tags: post.tags?.map((t) => t.tag),
        })) || []
      )
    }, '获取文章列表失败')
  }

  async getPostBySlug(slug: string) {
    return this.transaction(async () => {
      const { data, error } = await this.supabase
        .from('posts')
        .select(
          `
          id,
          title,
          slug,
          content,
          excerpt,
          featured_image,
          seo_title,
          seo_description,
          status,
          view_count,
          published_at,
          created_at,
          updated_at,
          is_archived,
          author:author_id(name, avatar_url),
          categories:post_categories(
            category:category_id(id, name, slug)
          ),
          tags:post_tags(
            tag:tag_id(id, name, slug)
          )
        `
        )
        .eq('slug', slug)
        .is('deleted_at', null)
        .single()

      if (error) {
        throw new DatabaseError('获取文章详情失败', 'FETCH_POST_ERROR', 500, error)
      }

      if (!data) {
        throw new DatabaseError('文章不存在', 'POST_NOT_FOUND', 404)
      }

      return {
        ...data,
        categories: data.categories?.map((c) => c.category),
        tags: data.tags?.map((t) => t.tag),
      }
    }, '获取文章详情失败')
  }

  async createPost(input: CreatePostInput) {
    return this.transaction(async () => {
      // 1. 创建文章基本信息
      const { data: post, error: postError } = await this.supabase
        .from('posts')
        .insert({
          title: input.title,
          slug: input.slug,
          content: input.content,
          excerpt: input.excerpt,
          status: 'draft',
          author_id: input.author_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (postError) {
        throw new DatabaseError('创建文章失败', 'CREATE_POST_ERROR', 500, postError)
      }

      // 2. 创建分类关联
      if (input.categories?.length) {
        const categoryLinks = input.categories.map((categoryId) => ({
          post_id: post.id,
          category_id: categoryId,
        }))

        const { error: categoryError } = await this.supabase
          .from('post_categories')
          .insert(categoryLinks)

        if (categoryError) {
          throw new DatabaseError('创建分类关联失败', 'CREATE_CATEGORIES_ERROR', 500, categoryError)
        }
      }

      // 3. 创建标签关联
      if (input.tags?.length) {
        const tagLinks = input.tags.map((tagId) => ({
          post_id: post.id,
          tag_id: tagId,
        }))

        const { error: tagError } = await this.supabase.from('post_tags').insert(tagLinks)

        if (tagError) {
          throw new DatabaseError('创建标签关联失败', 'CREATE_TAGS_ERROR', 500, tagError)
        }
      }

      return this.getPostBySlug(post.slug)
    }, '创建文章失败')
  }

  async updatePost(slug: string, input: UpdatePostInput) {
    return this.transaction(async () => {
      // 1. 获取当前文章信息
      const { data: currentPost, error: fetchError } = await this.supabase
        .from('posts')
        .select('*, tags(*)')
        .eq('slug', slug)
        .single()

      if (fetchError || !currentPost) {
        throw new DatabaseError('文章不存在', 'POST_NOT_FOUND', 404, fetchError)
      }

      // 2. 更新文章基本信息
      const { data: post, error: updateError } = await this.supabase
        .from('posts')
        .update({
          title: input.title || currentPost.title,
          content: input.content,
          excerpt: input.excerpt,
          status: input.status || currentPost.status,
          updated_at: new Date().toISOString(),
          metadata: {
            ...currentPost.metadata,
            ...input.metadata,
          },
        })
        .eq('id', currentPost.id)
        .select(
          `
          id,
          title,
          slug,
          content,
          excerpt,
          status,
          created_at,
          updated_at,
          metadata,
          featured_image,
          seo_title,
          seo_description,
          view_count,
          tags (
            id,
            name,
            slug
          )
        `
        )
        .single()

      if (updateError) {
        throw new DatabaseError('更新文章失败', 'UPDATE_POST_ERROR', 500, updateError)
      }

      // 3. 更新标签关联
      if (input.tags) {
        await this.supabase.from('post_tags').delete().eq('post_id', currentPost.id)

        if (input.tags.length) {
          const tagLinks = input.tags.map((tagId) => ({
            post_id: currentPost.id,
            tag_id: tagId,
          }))

          const { error: tagError } = await this.supabase.from('post_tags').insert(tagLinks)

          if (tagError) {
            throw new DatabaseError('更新标签关联失败', 'UPDATE_TAGS_ERROR', 500, tagError)
          }
        }
      }

      // 4. 创建版本记录
      await this.createVersion({
        post_id: currentPost.id,
        content: input.content,
        metadata: {
          title: input.title,
          excerpt: input.excerpt,
          tags: input.tags,
        },
        version_type: 'update',
        description: '手动更新',
      })

      return post
    }, '更新文章失败')
  }

  async publishPost(slug: string) {
    return this.transaction(async () => {
      await this.validatePublish(slug)

      const post = await this.getPostBySlug(slug)
      if (!post) {
        throw new DatabaseError('文章不存在', 'POST_NOT_FOUND', 404)
      }

      // 创建发布版本
      const version = await this.createVersion({
        post_id: post.id,
        content: post.content,
        metadata: {
          title: post.title,
          excerpt: post.excerpt,
          categories: post.categories?.map((c) => c.id),
          tags: post.tags?.map((t) => t.id),
        },
        version_type: 'publish',
        description: '发布版本',
      })

      // 更新文章状态
      const { data: updatedPost, error } = await this.supabase
        .from('posts')
        .update({
          status: 'published',
          published_at: new Date().toISOString(),
          published_version_id: version.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', post.id)
        .select()
        .single()

      if (error) {
        throw new DatabaseError('发布文章失败', 'PUBLISH_POST_ERROR', 500, error)
      }

      return updatedPost
    }, '发布文章失败')
  }

  async unpublishPost(slug: string) {
    return this.transaction(async () => {
      const post = await this.getPostBySlug(slug)
      if (!post) {
        throw new DatabaseError('文章不存在', 'POST_NOT_FOUND', 404)
      }

      const { data: updatedPost, error } = await this.supabase
        .from('posts')
        .update({
          status: 'draft',
          published_at: null,
          published_version_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', post.id)
        .select()
        .single()

      if (error) {
        throw new DatabaseError('取消发布失败', 'UNPUBLISH_POST_ERROR', 500, error)
      }

      return this.getPostBySlug(updatedPost.slug)
    }, '取消发布失败')
  }

  async getVersions(postId: string) {
    return this.transaction(async () => {
      const { data, error } = await this.supabase
        .from('post_versions')
        .select(
          `
          id,
          content,
          metadata,
          version_type,
          description,
          created_at,
          created_by:users(id, name, avatar_url)
        `
        )
        .eq('post_id', postId)
        .order('created_at', { ascending: false })

      if (error) {
        throw new DatabaseError('获取版本历史失败', 'FETCH_VERSIONS_ERROR', 500, error)
      }

      return data || []
    }, '获取版本历史失败')
  }

  private async validateVersion(postId: string, versionId: string) {
    const { data: version, error } = await this.supabase
      .from('post_versions')
      .select('*')
      .eq('id', versionId)
      .eq('post_id', postId)
      .single()

    if (error || !version) {
      throw new DatabaseError('版本不存在或不属于该文章', 'INVALID_VERSION', 404, error)
    }

    return version
  }

  async restoreVersion(slug: string, versionId: string) {
    return this.transaction(async () => {
      const post = await this.getPostBySlug(slug)
      if (!post) {
        throw new DatabaseError('文章不存在', 'POST_NOT_FOUND', 404)
      }

      // 验证版本是否属于该文章
      const version = await this.validateVersion(post.id, versionId)

      // 更新文章内容和元数据
      const { error: updateError } = await this.supabase
        .from('posts')
        .update({
          content: version.content,
          title: version.metadata.title,
          excerpt: version.metadata.excerpt,
          updated_at: new Date().toISOString(),
          // 如果是已发布的版本，更新发布信息
          ...(version.version_type === 'publish' && {
            published_version_id: version.id,
            published_at: version.created_at,
          }),
        })
        .eq('id', post.id)

      if (updateError) {
        throw new DatabaseError('恢复版本失败', 'RESTORE_VERSION_ERROR', 500, updateError)
      }

      // 创建恢复记录
      await this.createVersion({
        post_id: post.id,
        content: version.content,
        metadata: version.metadata,
        version_type: 'restore',
        description: `从版本 ${version.id} 恢复`,
      })

      return this.getPostBySlug(post.slug)
    }, '恢复版本失败')
  }

  async cleanupVersions(postId: string, options = { keepCount: 5, types: ['auto'] as const }) {
    return this.transaction(async () => {
      const { data: versions } = await this.supabase
        .from('post_versions')
        .select('id, created_at')
        .eq('post_id', postId)
        .in('version_type', options.types)
        .order('created_at', { ascending: false })

      if (!versions || versions.length <= options.keepCount) return

      const versionsToDelete = versions.slice(options.keepCount)
      const idsToDelete = versionsToDelete.map((v) => v.id)

      const { error } = await this.supabase.from('post_versions').delete().in('id', idsToDelete)

      if (error) {
        throw new DatabaseError('清理版本失败', 'CLEANUP_VERSIONS_ERROR', 500, error)
      }
    }, '清理版本失败')
  }

  public async createVersion({
    post_id,
    content,
    metadata,
    version_type = 'auto',
    description = '',
  }: {
    post_id: string
    content: string
    metadata: any
    version_type?: 'auto' | 'manual' | 'update' | 'status'
    description?: string
  }) {
    const { error } = await this.supabase.from('post_versions').insert({
      post_id,
      content,
      metadata,
      version_type,
      description,
    })

    if (error) {
      throw new DatabaseError('创建版本记录失败', 'CREATE_VERSION_ERROR', 500, error)
    }
  }

  async getStats() {
    return this.transaction(async () => {
      const { data, error } = await this.supabase.rpc('get_posts_stats')

      if (error) {
        throw new DatabaseError('获取统计数据失败', 'FETCH_STATS_ERROR', 500, error)
      }

      return data
    }, '获取统计数据失败')
  }

  async bulkPublish(slugs: string[]) {
    return this.transaction(async () => {
      const results = await Promise.allSettled(
        slugs.map(async (slug) => {
          try {
            return await this.publishPost(slug)
          } catch (error) {
            return { slug, error }
          }
        })
      )

      const succeeded = results.filter(
        (r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled'
      )
      const failed = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected')

      if (failed.length > 0) {
        throw new DatabaseError(
          `批量发布失败: ${failed.length} 篇文章发布失败`,
          'BULK_PUBLISH_ERROR',
          500,
          { failed, succeeded }
        )
      }

      return succeeded.map((r) => r.value)
    }, '批量发布失败')
  }

  async bulkUnpublish(slugs: string[]) {
    return this.transaction(async () => {
      const results = await Promise.allSettled(
        slugs.map(async (slug) => {
          try {
            return await this.unpublishPost(slug)
          } catch (error) {
            return { slug, error }
          }
        })
      )

      const succeeded = results.filter(
        (r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled'
      )
      const failed = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected')

      if (failed.length > 0) {
        throw new DatabaseError(
          `批量取消发布失败: ${failed.length} 篇文章操作失败`,
          'BULK_UNPUBLISH_ERROR',
          500,
          { failed, succeeded }
        )
      }

      return succeeded.map((r) => r.value)
    }, '批量取消发布失败')
  }

  async bulkDelete(slugs: string[]) {
    return this.transaction(async () => {
      const { error } = await this.supabase
        .from('posts')
        .update({
          deleted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .in('slug', slugs)

      if (error) {
        throw new DatabaseError('批量删除失败', 'BULK_DELETE_ERROR', 500, error)
      }
    }, '批量删除失败')
  }

  async search(query: string, options: { status?: string; limit?: number } = {}) {
    return this.transaction(async () => {
      let dbQuery = this.supabase
        .from('posts')
        .select(
          `
          id,
          title,
          slug,
          excerpt,
          status,
          published_at,
          created_at,
          author:author_id(name)
        `
        )
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(options.limit || 10)

      if (options.status) {
        dbQuery = dbQuery.eq('status', options.status)
      }

      const { data, error } = await dbQuery

      if (error) {
        throw new DatabaseError('搜索文章失败', 'SEARCH_POSTS_ERROR', 500, error)
      }

      return data || []
    }, '搜索文章失败')
  }

  async archivePosts(slugs: string[]) {
    return this.transaction(async () => {
      const { error } = await this.supabase
        .from('posts')
        .update({
          is_archived: true,
          updated_at: new Date().toISOString(),
        })
        .in('slug', slugs)

      if (error) {
        throw new DatabaseError('归档文章失败', 'ARCHIVE_POSTS_ERROR', 500, error)
      }
    }, '归档文章失败')
  }

  async unarchivePosts(slugs: string[]) {
    return this.transaction(async () => {
      const { error } = await this.supabase
        .from('posts')
        .update({
          is_archived: false,
          updated_at: new Date().toISOString(),
        })
        .in('slug', slugs)

      if (error) {
        throw new DatabaseError('取消归档失败', 'UNARCHIVE_POSTS_ERROR', 500, error)
      }
    }, '取消归档失败')
  }

  async searchPosts(params: {
    query?: string
    status?: string
    category?: string
    tag?: string
    startDate?: string
    endDate?: string
    isArchived?: boolean
    limit?: number
    offset?: number
  }) {
    return this.transaction(async () => {
      let query = this.supabase
        .from('posts')
        .select(
          `
          id,
          title,
          slug,
          excerpt,
          status,
          view_count,
          published_at,
          created_at,
          updated_at,
          is_archived,
          author:author_id(name, avatar_url),
          categories:post_categories(
            category:category_id(id, name, slug)
          ),
          tags:post_tags(
            tag:tag_id(id, name, slug)
          ),
          count: count(id) over()
        `
        )
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      // 添加各种过滤条件
      if (params.query) {
        query = query.or(`title.ilike.%${params.query}%,content.ilike.%${params.query}%`)
      }

      if (params.status) {
        query = query.eq('status', params.status)
      }

      if (params.category) {
        query = query.contains('categories', [{ category: { slug: params.category } }])
      }

      if (params.tag) {
        query = query.contains('tags', [{ tag: { slug: params.tag } }])
      }

      if (params.startDate) {
        query = query.gte('created_at', params.startDate)
      }

      if (params.endDate) {
        query = query.lte('created_at', params.endDate)
      }

      if (typeof params.isArchived === 'boolean') {
        query = query.eq('is_archived', params.isArchived)
      }

      // 分页
      if (params.limit) {
        query = query.limit(params.limit)
      }

      if (params.offset) {
        query = query.offset(params.offset)
      }

      const { data, error } = await query

      if (error) {
        throw new DatabaseError('搜索文章失败', 'SEARCH_POSTS_ERROR', 500, error)
      }

      const total = data?.[0]?.count || 0
      const posts =
        data?.map((post) => ({
          ...post,
          categories: post.categories?.map((c) => c.category),
          tags: post.tags?.map((t) => t.tag),
        })) || []

      return {
        posts,
        total,
        limit: params.limit,
        offset: params.offset,
      }
    }, '搜索文章失败')
  }

  async previewVersion(slug: string, versionId: string) {
    return this.transaction(async () => {
      const post = await this.getPostBySlug(slug)
      if (!post) {
        throw new DatabaseError('文章不存在', 'POST_NOT_FOUND', 404)
      }

      const { data: version, error } = await this.supabase
        .from('post_versions')
        .select('*')
        .eq('id', versionId)
        .single()

      if (error || !version) {
        throw new DatabaseError('版本不存在', 'VERSION_NOT_FOUND', 404, error)
      }

      return {
        ...post,
        content: version.content,
        title: version.metadata.title,
        excerpt: version.metadata.excerpt,
        preview: true,
      }
    }, '预览版本失败')
  }

  async updatePostStatus(slug: string, status: 'draft' | 'published') {
    return this.transaction(async () => {
      // 1. 获取当前文章信息
      const { data: currentPost, error: fetchError } = await this.supabase
        .from('posts')
        .select('id, title, content')
        .eq('slug', slug)
        .single()

      if (fetchError || !currentPost) {
        throw new DatabaseError('文章不存在', 'POST_NOT_FOUND', 404, fetchError)
      }

      // 2. 更新文章状态
      const { data: post, error: updateError } = await this.supabase
        .from('posts')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentPost.id)
        .select(
          `
          id,
          title,
          slug,
          content,
          excerpt,
          status,
          created_at,
          updated_at,
          metadata,
          featured_image,
          seo_title,
          seo_description,
          view_count
        `
        )
        .single()

      if (updateError) {
        throw new DatabaseError('更新文章状态失败', 'UPDATE_STATUS_ERROR', 500, updateError)
      }

      // 3. 创建版本记录
      await this.createVersion({
        post_id: currentPost.id,
        content: currentPost.content,
        metadata: {
          title: currentPost.title,
          status,
        },
        version_type: 'status',
        description: `状态更新为: ${status === 'published' ? '已发布' : '草稿'}`,
      })

      return post
    }, '更新文章状态失败')
  }

  async bulkDeletePosts(slugs: string[]) {
    return this.transaction(async () => {
      // 1. 获取要删除的文章 IDs
      const { data: posts, error: fetchError } = await this.supabase
        .from('posts')
        .select('id')
        .in('slug', slugs)

      if (fetchError) {
        throw new DatabaseError('获取文章失败', 'FETCH_POSTS_ERROR', 500, fetchError)
      }

      if (!posts || posts.length === 0) {
        throw new DatabaseError('未找到要删除的文章', 'POSTS_NOT_FOUND', 404)
      }

      const postIds = posts.map((post) => post.id)

      // 2. 软删除文章（更新 deleted_at 字段）
      const { error: deleteError } = await this.supabase
        .from('posts')
        .update({
          deleted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .in('id', postIds)

      if (deleteError) {
        throw new DatabaseError('删除文章失败', 'DELETE_POSTS_ERROR', 500, deleteError)
      }

      return true
    }, '批量删除文章失败')
  }

  // ... 其他方法继续添加
}

// 创建单例实例
export const postService = new PostService()
