import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/posts'

export async function GET() {
  try {
    const posts = await getAllPosts()
    const popularPosts = posts
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
    
    return NextResponse.json(popularPosts)
  } catch (error) {
    console.error('获取热门文章失败:', error)
    return NextResponse.json(
      { error: '获取热门文章失败' },
      { status: 500 }
    )
  }
} 