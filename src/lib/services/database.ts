import { BaseService } from './base'
import type { Database, TableStats, DatabaseStatus, HealthCheck } from '@/types'

class DatabaseService extends BaseService {
  async getStatus(): Promise<DatabaseStatus> {
    return this.transaction(async () => {
      try {
        const connection = await this.checkConnection()
        const tables = await this.getTableStats()
        const health = await this.checkHealth()
        const relationships = await this.getRelationships()

        return {
          connection,
          tables,
          health,
          relationships,
        }
      } catch (error) {
        console.error('获取数据库状态失败:', error)
        throw error
      }
    }, '获取数据库状态')
  }

  private async checkConnection() {
    try {
      const { data, error } = await this.supabase.from('posts').select('id').limit(1)

      return {
        connected: !error,
        error: error?.message,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      }
    } catch (error) {
      return {
        connected: false,
        error: error instanceof Error ? error.message : '连接失败',
      }
    }
  }

  private async getTableStats() {
    const tables = ['posts', 'tags', 'categories', 'comments', 'users']
    const stats = []

    for (const table of tables) {
      try {
        const { data, error } = await this.supabase
          .from(table)
          .select('count')
          .is('deleted_at', null)
          .single()

        if (error) throw error

        stats.push({
          name: table,
          count: data?.count || 0,
          status: 'success',
        })
      } catch (error) {
        stats.push({
          name: table,
          count: 0,
          status: 'error',
          error: error instanceof Error ? error.message : '未知错误',
        })
      }
    }

    return stats
  }

  async getDashboardStats() {
    return this.transaction(async () => {
      const { count: total } = await this.supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .is('deleted_at', null)

      const { count: published } = await this.supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published')
        .is('deleted_at', null)

      const { count: draft } = await this.supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'draft')
        .is('deleted_at', null)

      return {
        posts: { total, published, draft },
        lastUpdated: new Date().toISOString(),
      }
    }, '获取仪表盘统计')
  }

  async initializeDatabase() {
    return this.transaction(async () => {
      // 初始化数据库
      await this.clearAllData()
      await this.createInitialData()
      return this.getStatus()
    }, '初始化数据库')
  }

  async clearAllData() {
    const tables = ['post_tags', 'posts', 'tags', 'categories']
    for (const table of tables) {
      const { error } = await this.supabase.from(table).delete().not('id', 'is', null)
      if (error) throw error
    }
  }

  async validateSchema() {
    return this.transaction(async () => {
      const requiredTables = ['posts', 'tags', 'categories', 'post_tags']
      const validation = {}

      for (const table of requiredTables) {
        const { data: columns, error } = await this.supabase.from(table).select('*').limit(0)

        validation[table] = {
          exists: !error,
          error: error?.message,
        }
      }

      return validation
    }, '验证数据库结构')
  }

  private async checkHealth() {
    const tables = ['posts', 'tags', 'categories', 'comments', 'users']
    const health: Record<string, boolean> = {}

    try {
      // 检查数据库连接
      const { error: connectionError } = await this.supabase.from('posts').select('id').limit(1)

      health.database = !connectionError

      // 检查各个表的访问权限
      for (const table of tables) {
        const { error } = await this.supabase.from(table).select('id').limit(1)

        health[table] = !error
      }

      return health
    } catch (error) {
      console.error('健康检查失败:', error)
      return {
        database: false,
        posts: false,
        tags: false,
        categories: false,
        comments: false,
        users: false,
      }
    }
  }

  private async getRelationships() {
    const relationships = [
      { from: 'posts', to: 'categories', through: 'category_id' },
      { from: 'posts', to: 'tags', through: 'post_tags' },
      { from: 'posts', to: 'users', through: 'author_id' },
      { from: 'comments', to: 'posts', through: 'post_id' },
      { from: 'comments', to: 'users', through: 'user_id' },
    ]

    return relationships
  }

  async getPostsPreview() {
    return this.transaction(async () => {
      const { data, error } = await this.supabase
        .from('posts')
        .select('id, title, slug, status, created_at')
        .order('created_at', { ascending: false })
        .limit(10)
        .is('deleted_at', null)

      if (error) throw error
      return data
    }, '获取文章预览')
  }
}

export const databaseService = new DatabaseService()
