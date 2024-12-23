import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/posts'

export async function GET() {
  try {
    const posts = await getAllPosts()
    
    // 只统计基础数据
    const stats = {
      posts: posts.length,
      views: posts.reduce((sum, post) => sum + (post.views || 0), 0),
      categories: [...new Set(posts.map(post => post.category))].length,
      tags: [...new Set(posts.flatMap(post => post.tags || []))].length
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('获取统计数据失败:', error)
    return NextResponse.json(
      { error: '获取统计数据失败' },
      { status: 500 }
    )
  }
} 