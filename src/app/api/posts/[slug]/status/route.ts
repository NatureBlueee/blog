import { NextResponse } from 'next/server'
import { PostService } from '@/lib/services/posts'

export async function PATCH(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { status } = await request.json()
    const postService = new PostService()

    if (!params.slug) {
      return NextResponse.json({ error: '文章标识符缺失' }, { status: 400 })
    }

    const updatedPost = await postService.updatePostStatus(params.slug, status)

    if (!updatedPost) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 })
    }

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('更新文章状态失败:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '更新文章状态失败' },
      { status: 500 }
    )
  }
}
