import { NextRequest, NextResponse } from 'next/server'
import { postService } from '@/lib/services/posts'
import { getAuthUser } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const post = await postService.getPostBySlug(params.slug)
    if (!post) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 })
    }

    const versions = await postService.getVersions(post.id)
    return NextResponse.json(versions)
  } catch (error) {
    console.error('获取版本历史失败:', error)
    return NextResponse.json({ error: '获取版本历史失败' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { content, metadata, type = 'auto', description } = await request.json()
    const post = await postService.getPostBySlug(params.slug)

    if (!post) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 })
    }

    const version = await postService.createVersion({
      post_id: post.id,
      content,
      metadata,
      version_type: type,
      description,
    })

    return NextResponse.json(version)
  } catch (error) {
    console.error('创建版本失败:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '创建版本失败' },
      { status: 500 }
    )
  }
}

async function cleanupAutoSaveVersions(postId: string) {
  try {
    // 获取所有自动保存的版本
    const { data: versions } = await supabase
      .from('post_versions')
      .select('id, created_at')
      .eq('post_id', postId)
      .eq('version_type', 'auto')
      .order('created_at', { ascending: false })

    if (!versions || versions.length <= 5) return

    // 删除旧的自动保存版本，只保留最新的5个
    const versionsToDelete = versions.slice(5)
    const idsToDelete = versionsToDelete.map((v) => v.id)

    await supabase.from('post_versions').delete().in('id', idsToDelete)
  } catch (error) {
    console.error('清理自动保存版本失败:', error)
  }
}
