import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    // 生成唯一的时间戳后缀
    const timestamp = Date.now()

    // 1. 检查并创建测试标签
    const testTags = [
      { name: 'React', slug: 'react' },
      { name: 'Next.js', slug: 'nextjs' },
      { name: 'TypeScript', slug: 'typescript' },
      { name: '性能优化', slug: 'performance' },
      { name: '系统设计', slug: 'system-design' },
      { name: '数据库', slug: 'database' },
      { name: '测试', slug: 'testing' },
      { name: 'DevOps', slug: 'devops' },
    ]

    // 先获取已存在的标签
    const { data: existingTags } = await supabase
      .from('tags')
      .select('slug')
      .in(
        'slug',
        testTags.map((t) => t.slug)
      )

    // 过滤出不存在的标签
    const newTags = testTags.filter((tag) => !existingTags?.some((et) => et.slug === tag.slug))

    // 只插入新标签
    if (newTags.length > 0) {
      const { error: tagError } = await supabase.from('tags').upsert(newTags)
      if (tagError) throw tagError
    }

    // 获取所有需要的标签
    const { data: allTags, error: allTagsError } = await supabase
      .from('tags')
      .select()
      .in(
        'slug',
        testTags.map((t) => t.slug)
      )

    if (allTagsError) throw allTagsError

    // 2. 创建测试文章
    const testPosts = [
      {
        title: '使用 Next.js 13 构建现代博客',
        slug: `building-modern-blog-with-nextjs-13-${timestamp}`,
        content: `# 使用 Next.js 13 构建现代博客\n\n...`,
        excerpt: 'Next.js 13 带来了许多激动人心的新特性...',
        status: 'published',
        tags: ['nextjs', 'react', 'typescript'],
      },
      {
        title: 'TypeScript 高级技巧',
        slug: `typescript-advanced-tips-${timestamp}`,
        content: `# TypeScript 高级技巧\n\n...`,
        excerpt: '探索 TypeScript 的高级特性和最佳实践...',
        status: 'published',
        tags: ['typescript', 'react'],
      },
      {
        title: '全栈应用的自动化测试策略',
        slug: `full-stack-testing-strategy-${timestamp}`,
        content: `# 全栈应用的自动化测试策略\n\n...`,
        excerpt: '探讨全栈应用中的测试策略...',
        status: 'draft',
        tags: ['testing', 'devops', 'typescript'],
      },
    ]

    // 清理旧的测试数据
    await supabase.from('post_tags').delete().neq('id', 0)
    await supabase.from('posts').delete().neq('id', 0)

    // 创建新文章
    for (const post of testPosts) {
      const { tags: postTags, ...postData } = post

      // 使用预定义的状态
      const published_at = postData.status === 'published' ? new Date().toISOString() : null

      // 创建文章
      const { data: createdPost, error: postError } = await supabase
        .from('posts')
        .upsert({
          ...postData,
          slug: `${postData.slug}-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          published_at,
        })
        .select()
        .single()

      if (postError) {
        console.error('创建文章失败:', postError)
        throw postError
      }

      console.log('成功创建文章:', createdPost)

      // 创建文章-标签关联
      const tagRelations = postTags
        .map((tagSlug) => ({
          post_id: createdPost.id,
          tag_id: allTags?.find((t) => t.slug === tagSlug)?.id,
        }))
        .filter((relation) => relation.tag_id)

      if (tagRelations.length > 0) {
        const { error: relationError } = await supabase.from('post_tags').upsert(tagRelations)

        if (relationError) {
          console.error('创建标签关联失败:', relationError)
          throw relationError
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: '测试数据创建成功',
      summary: {
        tags: allTags?.length || 0,
        posts: testPosts.length,
      },
    })
  } catch (error) {
    console.error('创建测试数据失败:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '创建测试数据失败',
        details: error,
      },
      { status: 500 }
    )
  }
}
