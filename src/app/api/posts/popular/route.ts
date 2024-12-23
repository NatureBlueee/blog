import { NextResponse } from 'next/server'
import { postService } from '@/lib/services/posts'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number(searchParams.get('limit')) || 5

    const posts = await postService.getPosts({
      status: 'published',
      orderBy: { views: 'desc' },
      limit,
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('获取热门文章失败:', error)
    return NextResponse.json({ error: '获取热门文章失败' }, { status: 500 })
  }
}
