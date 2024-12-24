import { NextRequest, NextResponse } from 'next/server'
import { postService } from '@/lib/services/post'

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const post = await postService.publishPost(params.slug)
    return NextResponse.json(post)
  } catch (error) {
    console.error('发布文章失败:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '发布文章失败' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const post = await postService.unpublishPost(params.slug)
    return NextResponse.json(post)
  } catch (error) {
    console.error('取消发布失败:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '取消发布失败' },
      { status: 500 }
    )
  }
}
