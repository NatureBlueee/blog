import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

export class DatabaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 500,
    public originalError?: any
  ) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export class BaseService {
  protected supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  protected handleError(error: any, message: string): never {
    console.error(`${message}:`, error)

    if (error instanceof DatabaseError) {
      throw error
    }

    throw new DatabaseError(message, 'INTERNAL_ERROR', 500, error)
  }

  protected async transaction<T>(callback: () => Promise<T>, errorMessage: string): Promise<T> {
    try {
      return await callback()
    } catch (error) {
      this.handleError(error, errorMessage)
    }
  }
}
