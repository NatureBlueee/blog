import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/posts'

export async function GET() {
  try {
    const posts = await getAllPosts()
    
    // 获取最近 5 篇文章
    const recentPosts = posts
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map(post => ({
        id: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        createdAt: post.date,
        views: post.views || 0
      }))

    return NextResponse.json(recentPosts)
  } catch (error) {
    console.error('获取最近文章失败:', error)
    return NextResponse.json(
      { error: '获取最近文章失败' },
      { status: 500 }
    )
  }
} 