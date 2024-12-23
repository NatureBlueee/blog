import { NextResponse } from 'next/server'
import { PostService } from '@/lib/services/posts'
import { DatabaseError } from '@/lib/services/base'

export async function DELETE(request: Request) {
  try {
    const { slugs } = await request.json()
    if (!Array.isArray(slugs) || slugs.length === 0) {
      return NextResponse.json({ error: '无效的删除请求' }, { status: 400 })
    }

    const postService = new PostService()
    await postService.bulkDeletePosts(slugs)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('批量删除失败:', error)
    if (error instanceof DatabaseError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    return NextResponse.json({ error: '批量删除失败' }, { status: 500 })
  }
}
