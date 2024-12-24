import { BaseService } from './base'
import type { Post, Tag } from '@/types'

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
        .not('post_id', 'is', null) // 删除所有非空记录

      if (tagError) throw tagError

      // 再删除文章
      const { error: postError } = await this.supabase.from('posts').delete().not('id', 'is', null) // 删除所有非空记录

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
        // 获取标签 ID
        const { data: tags, error: tagError } = await this.supabase
          .from('tags')
          .select('id, slug')
          .in('slug', tagSlugs)

        if (tagError) throw tagError

        // 创建文章-标签关联
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
}

export const postService = new PostService()
