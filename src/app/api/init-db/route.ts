import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    // 1. 创建用户表
    const { error: userError } = await supabase.rpc('init_users_table')
    if (userError) throw userError

    // 2. 创建文章表
    const { error: postError } = await supabase.rpc('init_posts_table')
    if (postError) throw postError

    // 3. 创建标签表
    const { error: tagError } = await supabase.rpc('init_tags_table')
    if (tagError) throw tagError

    // 4. 创建文章标签关联表
    const { error: postTagError } = await supabase.rpc('init_post_tags_table')
    if (postTagError) throw postTagError

    return NextResponse.json({
      success: true,
      message: '数据库表初始化成功',
    })
  } catch (error) {
    console.error('数据库初始化失败:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '数据库初始化失败',
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
