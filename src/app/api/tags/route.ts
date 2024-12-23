import { NextResponse } from 'next/server'
import { postService } from '@/lib/services/posts'

export async function GET() {
  try {
    const tags = await postService.getTags()
    return NextResponse.json(tags)
  } catch (error) {
    console.error('获取标签列表失败:', error)
    return NextResponse.json({ error: '获取标签列表失败' }, { status: 500 })
  }
}
