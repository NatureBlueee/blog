import { NextRequest, NextResponse } from 'next/server'
import { postService } from '@/lib/services/posts'

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const post = await postService.getPostBySlug(params.slug)
    return NextResponse.json({ exists: !!post })
  } catch (error) {
    console.error('检查文章是否存在失败:', error)
    return NextResponse.json({ exists: false })
  }
}
