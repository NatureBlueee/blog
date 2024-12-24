import { BaseService } from './base'
import type { Tag } from '@/types'

class TagService extends BaseService {
  async getTags() {
    const { data, error } = await this.supabase.from('tags').select('*').order('name')

    if (error) throw error
    return data || []
  }

  async getTagBySlug(slug: string): Promise<Tag | null> {
    const { data, error } = await this.supabase.from('tags').select('*').eq('slug', slug).single()

    if (error) throw error
    return data
  }

  async deleteAll() {
    return this.transaction(async () => {
      const { error } = await this.supabase.from('tags').delete().neq('id', 0)

      if (error) throw error
      return true
    }, '删除所有标签')
  }

  async createMany(tags: Partial<Tag>[]) {
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
}

export const tagService = new TagService()
