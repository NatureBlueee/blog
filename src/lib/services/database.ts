import { BaseService } from './base'
import { DatabaseError } from '@/lib/errors'
import type { Database } from '@/types/supabase'

// 定义类型
type TableName = keyof Database['public']['Tables']
type TableCounts = Record<TableName, number>

interface DatabaseStatus {
  counts: TableCounts
  lastChecked: string
  isHealthy: boolean
  version: string
  tables: Array<{
    name: string
    status: 'ok' | 'error'
    count: number
  }>
}

export class DatabaseService extends BaseService {
  // 定义常量
  private readonly TABLES: TableName[] = [
    'users',
    'posts',
    'tags',
    'post_tags',
    'post_versions',
    'comments',
  ]

  // 统一获取状态方法
  async getStatus(): Promise<DatabaseStatus> {
    return this.getDatabaseStatus()
  }

  // 核心方法：数据库初始化
  async initializeDatabase() {
    return this.transaction(async () => {
      // 1. 清理数据
      await this.clearAllData()

      // 2. 验证结构
      await this.validateSchema()

      // 3. 获取状态
      const status = await this.getDatabaseStatus()

      return status
    }, '初始化数据库')
  }

  // 核心方法：数据库验证
  async validateSchema() {
    return this.transaction(async () => {
      const validations = await Promise.all(this.TABLES.map((table) => this.validateTable(table)))

      const failedTables = validations.filter((v) => !v.isValid).map((v) => v.table)

      if (failedTables.length > 0) {
        throw new DatabaseError(`数据库验证失败: ${failedTables.join(', ')} 表存在问题`, 500)
      }

      return true
    }, '验证数据库结构')
  }

  // 核心方法：获取数据库状态
  async getDatabaseStatus(): Promise<DatabaseStatus> {
    return this.transaction(async () => {
      const counts = await this.getAllTableCounts()
      const isHealthy = await this.checkDatabaseHealth()
      const version = await this.getDatabaseVersion()

      // 获取每个表的详细状态
      const tables = await Promise.all(
        this.TABLES.map(async (table) => {
          const validation = await this.validateTable(table)
          return {
            name: table,
            status: validation.isValid ? 'ok' : 'error',
            count: counts[table] || 0,
          }
        })
      )

      return {
        counts,
        lastChecked: new Date().toISOString(),
        isHealthy,
        version,
        tables,
      }
    }, '获取数据库状态')
  }

  // 辅助方法：清理所有数据
  private async clearAllData() {
    const { error } = await this.supabase.rpc('initialize_database')
    if (error) {
      throw new DatabaseError('清理数据失败', 500, error)
    }
  }

  // 辅助方法：验证单个表
  private async validateTable(table: TableName) {
    const { error } = await this.supabase.from(table).select('id').limit(1)

    return {
      table,
      isValid: !error,
      error,
    }
  }

  // 辅助方法：获取所有表的计数
  private async getAllTableCounts(): Promise<TableCounts> {
    const counts = await Promise.all(
      this.TABLES.map(async (table) => ({
        table,
        count: await this.getTableCount(table),
      }))
    )

    return counts.reduce(
      (acc, { table, count }) => ({
        ...acc,
        [table]: count,
      }),
      {} as TableCounts
    )
  }

  // 辅助方法：获取单个表的计数
  private async getTableCount(table: TableName): Promise<number> {
    const { count, error } = await this.supabase
      .from(table)
      .select('*', { count: 'exact', head: true })

    if (error) {
      throw new DatabaseError(`获取${table}表计数失败`, 500, error)
    }

    return count || 0
  }

  // 辅助方法：检查数据库健康状态
  private async checkDatabaseHealth(): Promise<boolean> {
    try {
      const { data, error } = await this.supabase.rpc('check_database_health')
      if (error) throw error
      return data?.isHealthy || false
    } catch (error) {
      console.error('数据库健康检查失败:', error)
      return false
    }
  }

  // 辅助方法：获取数据库版本
  private async getDatabaseVersion(): Promise<string> {
    try {
      const { data, error } = await this.supabase.rpc('get_database_version')
      if (error) throw error
      return data?.version || 'unknown'
    } catch (error) {
      console.error('获取数据库版本失败:', error)
      return 'unknown'
    }
  }

  // 监控方法：获取性能指标
  async getPerformanceMetrics() {
    return this.transaction(async () => {
      const metrics = await this.supabase.rpc('get_database_metrics')
      return metrics
    }, '获取性能指标')
  }

  // 维护方法：优化数据库
  async optimizeTables() {
    return this.transaction(async () => {
      await Promise.all(
        this.TABLES.map((table) => this.supabase.rpc('optimize_table', { table_name: table }))
      )
    }, '优化数据库表')
  }

  // 添加获取文章预览列表方法
  async getPostsPreview() {
    return this.transaction(async () => {
      const { data: posts, error } = await this.supabase
        .from('posts')
        .select(
          `
          id,
          title,
          slug,
          status,
          created_at,
          published_at,
          metadata,
          excerpt,
          post_tags (
            id,
            tag_id,
            tags (
              id,
              name,
              slug
            )
          )
        `
        )
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      if (error) throw error
      return { data: posts }
    }, '获取文章预览列表')
  }
}

// 导出单例实例
export const databaseService = new DatabaseService()
