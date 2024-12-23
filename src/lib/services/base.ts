import { createClient } from '@supabase/supabase-js'
import { DatabaseError } from '@/lib/errors'

export class BaseService {
  protected supabase: SupabaseClient

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  protected async transaction<T>(operation: () => Promise<T>, errorMessage: string): Promise<T> {
    try {
      console.log(`开始事务: ${errorMessage}`)
      const result = await operation()
      console.log(`事务完成: ${errorMessage}`, { result })
      return result
    } catch (error) {
      console.error(`事务失败: ${errorMessage}`, {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        error,
      })

      // 如果是 Supabase 错误
      if (error && typeof error === 'object' && 'code' in error) {
        console.error('Supabase 错误详情:', {
          code: error.code,
          details: (error as any).details,
          hint: (error as any).hint,
          message: (error as any).message,
        })
      }

      throw error
    }
  }

  protected transformPosts(posts: any[]): BlogPost[] {
    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      status: post.status,
      authorId: post.author_id,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      publishedAt: post.published_at,
      views: post.views,
      metadata: post.metadata || {},
      author: post.author
        ? {
            id: post.author.id,
            name: post.author.name,
            avatarUrl: post.author.avatar_url,
          }
        : undefined,
      tags: post.post_tags?.map((pt: any) => pt.tags).filter(Boolean) || [],
    }))
  }
}
