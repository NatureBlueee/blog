import { NextResponse } from 'next/server'
import { postService } from '@/lib/services/post'

export async function GET() {
  try {
    console.log('API Route: Fetching posts...')
    const posts = await postService.getPosts({ status: 'published' })
    console.log('API Route: Posts fetched:', posts?.length)
    return NextResponse.json({ data: posts })
  } catch (error) {
    console.error('API Route: Failed to fetch posts:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '获取文章失败' },
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
