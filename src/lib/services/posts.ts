import type { Database } from '@/types/supabase'
import type { CreatePostInput, UpdatePostInput } from '@/types'
import { supabase } from '@/lib/supabase'
import type { BlogPost, PostVersion } from '@/types'

interface GetPostsOptions {
  status?: string
}

export const postService = {
  async getPosts({ status }: GetPostsOptions = {}) {
    try {
      let query = supabase
        .from('posts')
        .select(
          `
          id,
          title,
          slug,
          content,
          excerpt,
          category,
          tags,
          status,
          views,
          created_at,
          updated_at
        `
        )
        .order('created_at', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query

      if (error) throw error

      return data || []
    } catch (error) {
      console.error('获取文章列表失败:', error)
      throw error
    }
  },

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const { data: post, error } = await supabase
        .from('posts')
        .select(
          `
          id,
          title,
          slug,
          content,
          excerpt,
          category,
          tags,
          status,
          views,
          created_at,
          updated_at
        `
        )
        .eq('slug', slug)
        .single()

      if (error) throw error
      return post
    } catch (error) {
      console.error('获取文章失败:', error)
      throw error
    }
  },

  async getVersions(postId: string): Promise<PostVersion[]> {
    const { data: versions, error } = await supabase
      .from('post_versions')
      .select(
        `
        id,
        post_id,
        content,
        metadata,
        version_type,
        description,
        created_at,
        created_by,
        authors:created_by (
          name,
          email
        )
      `
      )
      .eq('post_id', postId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('获取版本历史失败:', error)
      throw error
    }

    return versions || []
  },

  async createPost(input: CreatePostInput) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          title: input.title,
          content: input.content,
          excerpt: input.excerpt || '',
          slug: input.slug,
          status: input.status || 'draft',
          category: input.category || '',
          tags: input.tags || [],
          views: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select('*')
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('创建文章失败:', error)
      throw error
    }
  },

  async createVersion(input: {
    post_id: string
    content: string
    metadata: any
    version_type: 'auto' | 'manual'
    description?: string
  }) {
    const { error } = await supabase.from('post_versions').insert({
      post_id: input.post_id,
      content: input.content,
      metadata: input.metadata,
      version_type: input.version_type,
      description: input.description,
      created_at: new Date().toISOString(),
    })

    if (error) throw error
  },

  async updatePost(slug: string, input: UpdatePostInput) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update({
          title: input.title,
          content: input.content,
          excerpt: input.excerpt,
          category: input.category,
          tags: input.tags,
          status: input.status,
          published_at: input.published_at,
          updated_at: new Date().toISOString(),
        })
        .eq('slug', slug)
        .select('*')
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('更新文章失败:', error)
      throw error
    }
  },

  async deletePost(slug: string): Promise<void> {
    const { error } = await supabase.from('posts').delete().eq('slug', slug)

    if (error) throw error
  },

  async incrementViews(slug: string) {
    try {
      const { error } = await supabase.rpc('increment_post_views', {
        post_slug: slug,
      })

      if (error) throw error

      return true
    } catch (error) {
      console.error('更新浏览量失败:', error)
      throw error
    }
  },
}
