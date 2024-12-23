import { NextResponse } from 'next/server'
import { postService } from '@/lib/services/posts'

export async function POST(
  request: Request,
  { params }: { params: { slug: string; versionId: string } }
) {
  try {
    const updatedPost = await postService.restoreVersion(params.slug, params.versionId)
    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('恢复版本失败:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '恢复版本失败' },
      { status: 500 }
    )
  }
}
