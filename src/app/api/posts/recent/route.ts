import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('id, title, slug, created_at, views')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (error) throw error
    
    return NextResponse.json(posts)
  } catch (error) {
    console.error('获取最近文章失败:', error)
    return NextResponse.json({ error: '获取最近文章失败' }, { status: 500 })
  }
} 