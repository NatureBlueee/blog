import { NextResponse } from 'next/server'
import { postService } from '@/lib/services/post'
import { tagService } from '@/lib/services/tag'

export async function POST() {
  try {
    console.log('开始初始化数据库...')

    // 1. 清理现有数据
    await postService.deleteAll() // 这会同时清理 post_tags
    await tagService.deleteAll()

    // 2. 创建基础标签
    const tags = await tagService.createMany([
      { name: '前端开发', slug: 'frontend' },
      { name: '后端开发', slug: 'backend' },
      { name: 'DevOps', slug: 'devops' },
      { name: '全栈开发', slug: 'fullstack' },
    ])

    // 3. 创建初始文章
    const posts = await postService.createMany([
      {
        title: '全栈应用开发指南',
        slug: 'fullstack-development-guide',
        content: `# 全栈应用开发指南\n\n...`,
        excerpt: '探索全栈开发的最佳实践和技术选型',
        status: 'published',
      },
    ])

    console.log('初始化完成!')
    return NextResponse.json({
      success: true,
      data: {
        tags: tags?.length || 0,
        posts: posts?.length || 0,
      },
    })
  } catch (error) {
    console.error('初始化失败:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '初始化失败',
        details: error,
      },
      { status: 500 }
    )
  }
}
