import { NextRequest, NextResponse } from 'next/server'
import { postService } from '@/lib/services/posts'
import { generateSlug } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')

    const posts = await postService.getPosts({ status: status || undefined })
    return NextResponse.json(posts)
  } catch (error) {
    console.error('获取文章列表失败:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '获取文章列表失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    if (!data.title) {
      return NextResponse.json({ error: '标题不能为空' }, { status: 400 })
    }

    const slug = generateSlug(data.title)
    const post = await postService.createPost({
      ...data,
      slug,
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
