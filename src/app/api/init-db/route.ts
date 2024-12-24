import { NextResponse } from 'next/server'
import { postService } from '@/lib/services/post'
import { tagService } from '@/lib/services/tag'
import { supabase } from '@/lib/supabase/client'

export async function POST() {
  try {
    console.log('开始初始化数据库...')

    // 1. 强制清理所有数据
    const { error: deleteError } = await supabase.rpc('initialize_database')
    if (deleteError) {
      console.error('初始化数据库失败:', deleteError)
      throw deleteError
    }

    // 2. 验证清理结果
    const { data: afterPosts, error: afterError } = await supabase
      .from('posts')
      .select('id, title, slug')

    console.log('清理后的文章:', afterPosts)

    // 3. 创建基础标签
    const tags = await tagService.createMany([
      { name: '前端开发', slug: 'frontend' },
      { name: '后端开发', slug: 'backend' },
      { name: 'DevOps', slug: 'devops' },
      { name: '全栈开发', slug: 'fullstack' },
    ])

    // 不再创建初始文章，让用户通过"创建测试数据"功能来添加文章

    return NextResponse.json({
      success: true,
      data: {
        tags: tags?.length || 0,
        posts: 0,
      },
    })
  } catch (error) {
    console.error('初始化失败:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '初始化失败' },
      { status: 500 }
    )
  }
}
