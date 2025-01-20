import { NextResponse } from 'next/server'
import { databaseService } from '@/lib/services/database'
import { tagService } from '@/lib/services/tag'
import { postService } from '@/lib/services/post'

export async function GET() {
  try {
    const results = {
      database: false,
      tags: false,
      posts: false,
      details: {} as Record<string, any>,
      actions: [] as string[],
    }

    const dbStatus = await databaseService.getDatabaseStatus()
    results.database = dbStatus.isHealthy
    results.details.database = dbStatus

    return NextResponse.json({
      success: true,
      results,
    })
  } catch (error) {
    console.error('验证失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '验证失败',
        details: error,
      },
      { status: 500 }
    )
  }
}
