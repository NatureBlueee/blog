import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: Request,
  { params }: { params: { slug: string; versionId: string } }
) {
  try {
    // 先获取文章信息
    const { data: post } = await supabase
      .from('posts')
      .select('id')
      .eq('slug', params.slug)
      .single()

    if (!post) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 })
    }

    // 获取要恢复的版本
    const { data: version } = await supabase
      .from('post_versions')
      .select('*')
      .eq('id', params.versionId)
      .single()

    if (!version) {
      return NextResponse.json({ error: '版本不存在' }, { status: 404 })
    }

    // 更新文章内容
    const { data: updatedPost, error } = await supabase
      .from('posts')
      .update({
        content: version.content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', post.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('恢复版本失败:', error)
    return NextResponse.json({ error: '恢复版本失败' }, { status: 500 })
  }
}
