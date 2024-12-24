import { SupabaseClient } from '@supabase/supabase-js'
import { supabase } from '../supabase/client'

export class DatabaseError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export class BaseService {
  protected supabase: SupabaseClient

  constructor() {
    this.supabase = supabase
  }

  protected async transaction<T>(operation: () => Promise<T>, operationName: string): Promise<T> {
    try {
      return await operation()
    } catch (error) {
      console.error(`${operationName} 失败:`, error)

      // 转换为自定义错误
      if (error instanceof Error) {
        throw new DatabaseError(error.message)
      }
      throw new DatabaseError('数据库操作失败')
    }
  }

  protected handleError(error: any, message: string): never {
    console.error(message, error)
    throw new DatabaseError(error?.message || message, error?.code === '23505' ? 409 : 500, error)
  }
}
