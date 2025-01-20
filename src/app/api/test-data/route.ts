import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client.ts'

async function generateTestData() {
  const timestamp = Date.now()
  const logs = []
  const summary = {
    tags: 0,
    posts: 0,
    comments: 0,
    categories: 0,
    views: 0,
  }

  try {
    // 1. 创建测试分类
    const testCategories = [
      { name: '前端开发', slug: 'frontend', description: '前端技术相关文章' },
      { name: '后端开发', slug: 'backend', description: '后端开发与架构' },
      { name: '开发工具', slug: 'tools', description: '提升开发效率的工具' },
      { name: '最佳实践', slug: 'best-practices', description: '编程最佳实践' },
    ]

    const { data: categories } = await supabase.from('categories').upsert(testCategories).select()

    summary.categories = categories?.length || 0
    logs.push({ level: 'info', message: `创建了 ${summary.categories} 个分类` })

    // 2. 创建测试标签
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

    const { data: tags } = await supabase.from('tags').upsert(testTags).select()

    summary.tags = tags?.length || 0
    logs.push({ level: 'info', message: `创建了 ${summary.tags} 个标签` })

    // 3. 创建测试文章
    const testPosts = Array.from({ length: 10 }, (_, i) => ({
      title: `测试文章 ${i + 1}`,
      slug: `test-post-${i + 1}-${timestamp}`,
      content: `# 测试文章 ${i + 1}\n\n这是一篇测试文章的内容...`,
      excerpt: `这是测试文章 ${i + 1} 的摘要...`,
      status: i < 7 ? 'published' : 'draft',
      metadata: {
        wordCount: Math.floor(Math.random() * 2000) + 500,
        readingTime: `${Math.floor(Math.random() * 10) + 3} min`,
        coverImage: null,
      },
    }))

    for (const post of testPosts) {
      // 创建文章
      const { data: createdPost } = await supabase.from('posts').upsert(post).select().single()

      if (createdPost) {
        // 随机添加标签
        const randomTags = tags
          ?.sort(() => Math.random() - 0.5)
          .slice(0, Math.floor(Math.random() * 3) + 1)

        if (randomTags?.length) {
          await supabase.from('post_tags').upsert(
            randomTags.map((tag) => ({
              post_id: createdPost.id,
              tag_id: tag.id,
            }))
          )
        }

        // 随机添加分类
        const randomCategory = categories?.[Math.floor(Math.random() * categories.length)]
        if (randomCategory) {
          await supabase.from('post_categories').upsert({
            post_id: createdPost.id,
            category_id: randomCategory.id,
          })
        }

        // 创建测试评论
        if (Math.random() > 0.5) {
          const commentCount = Math.floor(Math.random() * 3) + 1
          for (let j = 0; j < commentCount; j++) {
            await supabase.from('comments').insert({
              post_id: createdPost.id,
              content: `这是测试评论 ${j + 1}`,
              status: 'published',
            })
            summary.comments++
          }
        }

        // 创建浏览记录
        const viewCount = Math.floor(Math.random() * 100)
        for (let k = 0; k < viewCount; k++) {
          await supabase.from('post_views').insert({
            post_id: createdPost.id,
            view_count: 1,
          })
          summary.views++
        }
      }
    }

    summary.posts = testPosts.length
    logs.push({ level: 'info', message: `创建了 ${summary.posts} 篇文章` })
    logs.push({ level: 'info', message: `创建了 ${summary.comments} 条评论` })
    logs.push({ level: 'info', message: `生成了 ${summary.views} 次浏览记录` })

    return { success: true, summary, logs }
  } catch (error) {
    logs.push({
      level: 'error',
      message: error instanceof Error ? error.message : '创建测试数据失败',
    })
    throw error
  }
}

export async function POST() {
  try {
    const { success, summary, logs } = await generateTestData()
    return NextResponse.json({ success, summary, logs })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '创建测试数据失败',
        details: error,
      },
      { status: 500 }
    )
  }
}
