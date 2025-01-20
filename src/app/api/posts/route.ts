import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET() {
  try {
    console.log('API Route: Fetching posts...')
    const { data: posts, error } = await supabase
      .from('posts')
      .select(
        `
        *,
        author:author_id (
          id,
          email,
          raw_user_meta_data->>'name' as name
        ),
        tags:post_tags (
          tag:tags (
            id,
            name,
            slug
          )
        ),
        post_views (
          id
        )
      `
      )
      .eq('status', 'published')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) throw error

    console.log('API Route: Posts fetched:', posts?.length)

    // 处理数据格式
    const formattedPosts = posts?.map((post) => ({
      ...post,
      views: post.post_views?.length || 0,
      tags: post.tags?.map((t) => t.tag),
    }))

    return NextResponse.json({ data: formattedPosts })
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
