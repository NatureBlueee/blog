import { NextResponse } from 'next/server'
import { postService } from '@/lib/services/post'

// 设置较长的超时时间
export const revalidate = 3600 // 1小时缓存
export const dynamic = 'force-dynamic' // 强制动态渲染

export async function GET() {
  try {
    const stats = await postService.getPostStats()
    if (!stats) {
      return NextResponse.json({ error: '无统计数据' }, { status: 404 })
    }
    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json({ error: '获取统计数据失败' }, { status: 500 })
  }
}
