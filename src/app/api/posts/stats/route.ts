import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // 1. 获取总文章数
    const { count: total, error: totalError } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null)

    if (totalError) throw totalError

    // 2. 获取已发布文章数
    const { count: published, error: publishedError } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')
      .is('deleted_at', null)

    if (publishedError) throw publishedError

    // 3. 获取草稿文章数
    const { count: draft, error: draftError } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'draft')
      .is('deleted_at', null)

    if (draftError) throw draftError

    return NextResponse.json({
      total: total || 0,
      published: published || 0,
      draft: draft || 0,
    })
  } catch (error) {
    console.error('获取统计数据失败:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '获取统计数据失败' },
      { status: 500 }
    )
  }
}
