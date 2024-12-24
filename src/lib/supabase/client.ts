import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// 创建 Supabase 客户端实例
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
