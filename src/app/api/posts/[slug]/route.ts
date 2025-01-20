import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { data: post, error } = await supabase
      .from('posts')
      .select(
        `
        id,
        title,
        slug,
        content,
        excerpt,
        status,
        created_at,
        published_at,
        metadata,
        author_id,
        post_tags (
          id,
          tag_id,
          tags (
            id,
            name,
            slug
          )
        )
      `
      )
      .eq('slug', params.slug)
      .is('deleted_at', null)
      .single()

    if (error) throw error
    if (!post) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 })
    }

    return NextResponse.json({ data: post })
  } catch (error) {
    console.error('获取文章失败:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '获取文章失败' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  try {
    const input = await request.json()
    const postService = new PostService()

    const updatedPost = await postService.updatePost(params.slug, input)
    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('更新文章失败:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '更新文章失败' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  try {
    const postService = new PostService()
    await postService.deletePost(params.slug)
    return NextResponse.json({ message: '删除成功' })
  } catch (error) {
    console.error('删除文章失败:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '删除文章失败' },
      { status: 500 }
    )
  }
}
