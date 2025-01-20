import { BaseService } from './base'
import type { Tag } from '@/types'

interface CreateTagData extends Partial<Tag> {
  name: string
  slug: string
}

class TagService extends BaseService {
  // 获取所有标签
  async getTags() {
    return this.transaction(async () => {
      const { data, error } = await this.supabase
        .from('tags')
        .select('*')
        .order('name')
        .is('deleted_at', null)

      if (error) throw error
      return data
    }, '获取所有标签')
  }

  // 根据 slug 获取标签
  async getTagBySlug(slug: string) {
    return this.transaction(async () => {
      const { data, error } = await this.supabase
        .from('tags')
        .select(
          `
          *,
          posts:post_tags(
            post:posts(
              id,
              title,
              slug,
              status,
              created_at
            )
          )
        `
        )
        .eq('slug', slug)
        .is('deleted_at', null)
        .single()

      if (error) throw error
      if (!data) throw new Error('标签不存在')

      return data
    }, '获取标签详情')
  }

  // 创建单个标签
  async create(tagData: CreateTagData) {
    return this.transaction(async () => {
      const { data, error } = await this.supabase
        .from('tags')
        .insert({
          ...tagData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return data
    }, '创建标签')
  }

  // 批量创建标签
  async createMany(tags: CreateTagData[]) {
    return this.transaction(async () => {
      const { data, error } = await this.supabase
        .from('tags')
        .insert(
          tags.map((tag) => ({
            ...tag,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }))
        )
        .select()

      if (error) throw error
      return data
    }, '批量创建标签')
  }

  // 更新标签
  async updateTag(slug: string, tagData: Partial<CreateTagData>) {
    return this.transaction(async () => {
      const { data, error } = await this.supabase
        .from('tags')
        .update({
          ...tagData,
          updated_at: new Date().toISOString(),
        })
        .eq('slug', slug)
        .select()
        .single()

      if (error) throw error
      if (!data) throw new Error('标签不存在')

      return data
    }, '更新标签')
  }

  // 删除标签（软删除）
  async deleteTag(slug: string) {
    return this.transaction(async () => {
      const { error } = await this.supabase
        .from('tags')
        .update({ deleted_at: new Date().toISOString() })
        .eq('slug', slug)

      if (error) throw error
      return true
    }, '删除标签')
  }

  // 删除所有标签
  async deleteAll() {
    return this.transaction(async () => {
      // 先删除标签关联
      const { error: relationError } = await this.supabase
        .from('post_tags')
        .delete()
        .not('tag_id', 'is', null)

      if (relationError) throw relationError

      // 再删除标签
      const { error: tagError } = await this.supabase.from('tags').delete().not('id', 'is', null)

      if (tagError) throw tagError
      return true
    }, '删除所有标签')
  }

  // 获取标签统计
  async getTagStats() {
    return this.transaction(async () => {
      const { data, error } = await this.supabase
        .from('tags')
        .select(
          `
          *,
          post_count:post_tags(count)
        `
        )
        .is('deleted_at', null)

      if (error) throw error
      return data
    }, '获取标签统计')
  }
}

export const tagService = new TagService()
