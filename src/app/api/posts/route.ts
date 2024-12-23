import { NextResponse } from 'next/server'
import { PostService } from '@/lib/services/posts'
import { getAuthUser } from '@/lib/auth'

export async function GET() {
  try {
    const postService = new PostService()
    const posts = await postService.getAllPosts()
    return NextResponse.json(posts)
  } catch (error) {
    console.error('获取文章列表失败:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '获取文章列表失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const data = await request.json()
    if (!data.title) {
      return NextResponse.json({ error: '标题不能为空' }, { status: 400 })
    }

    const postService = new PostService()
    const post = await postService.createPost({
      title: data.title,
      content: data.content || '',
      excerpt: data.excerpt || '',
      tags: data.tags || [],
      author_id: user.id,
      status: 'draft',
      slug: data.title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '-'),
      metadata: {
        seo_title: data.title,
        seo_description: data.excerpt || '',
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('创建文章失败:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '创建文章失败' },
      { status: 500 }
    )
  }
}
