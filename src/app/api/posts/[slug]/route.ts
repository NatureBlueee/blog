import { NextRequest, NextResponse } from 'next/server'
import { postService } from '@/lib/services/posts'

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const post = await postService.getPostBySlug(params.slug)
    if (!post) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 })
    }
    return NextResponse.json(post)
  } catch (error) {
    console.error('获取文章失败:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '获取文章失败' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const data = await request.json()
    const post = await postService.updatePost(params.slug, {
      ...data,
      status: data.isPublishing ? 'published' : data.status,
      published_at: data.isPublishing ? new Date().toISOString() : data.published_at,
    })
    return NextResponse.json(post)
  } catch (error) {
    console.error('更新文章失败:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '更新文章失败' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await postService.deletePost(params.slug)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: '删除文章失败' }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  try {
    const data = await request.json()
    const { _method, ...postData } = data

    // 如果是模拟的 PATCH 请求
    if (_method === 'PATCH') {
      // 执行更新操作
      const updatedPost = await updatePostInDatabase(params.slug, postData)
      return NextResponse.json(updatedPost)
    }

    return NextResponse.json({ message: '不支持的请求方法' }, { status: 405 })
  } catch (error) {
    return NextResponse.json({ message: '更新文章失败' }, { status: 500 })
  }
}
