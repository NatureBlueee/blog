import { NextResponse } from 'next/server'
import { postService } from '@/lib/services/posts'

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  try {
    const post = await postService.likePost(params.slug)
    return NextResponse.json(post)
  } catch (error) {
    console.error('点赞失败:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '点赞失败' },
      { status: 500 }
    )
  }
}
