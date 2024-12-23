import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts, createPost } from '@/lib/posts'
import { validatePost } from '@/utils/post'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || 'all'
    const status = searchParams.get('status') || 'all'

    const posts = await getAllPosts({ search, category, status })
    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json(
      { error: '获取文章列表失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content, metadata } = await request.json()
    
    const validation = validatePost(content)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const post = await createPost(content, metadata)
    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json(
      { error: '创建文章失败' },
      { status: 500 }
    )
  }
} 