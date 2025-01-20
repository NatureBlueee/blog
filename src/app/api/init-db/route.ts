import { NextResponse } from 'next/server'
import { databaseService } from '@/lib/services/database'
import { tagService } from '@/lib/services/tag'

export async function POST() {
  try {
    console.log('开始初始化数据库...')

    // 1. 初始化数据库
    await databaseService.initializeDatabase()
    console.log('数据库已重置')

    // 2. 验证数据库结构
    await databaseService.validateSchema()
    console.log('数据库结构验证通过')

    // 3. 创建基础标签
    const tags = await tagService.createMany([
      { name: '前端开发', slug: 'frontend' },
      { name: '后端开发', slug: 'backend' },
      { name: 'DevOps', slug: 'devops' },
      { name: '全栈开发', slug: 'fullstack' },
    ])
    console.log('基础标签创建完成')

    // 4. 获取数据库状态
    const status = await databaseService.getDatabaseStatus()

    return NextResponse.json({
      success: true,
      message: '数据库初始化成功',
      data: {
        status,
        tags: tags?.length || 0,
      },
    })
  } catch (error) {
    console.error('初始化失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '初始化失败',
        details: error,
      },
      { status: 500 }
    )
  }
}
