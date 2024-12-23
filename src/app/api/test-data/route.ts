import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    // 1. 检查并创建测试标签
    const testTags = [
      { name: 'React', slug: 'react' },
      { name: 'Next.js', slug: 'nextjs' },
      { name: 'TypeScript', slug: 'typescript' },
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
    const { data: tags, error: tagError } = await supabase.from('tags').upsert(newTags).select()

    if (tagError) throw tagError

    // 获取所有需要的标签（包括已存在的和新创建的）
    const { data: allTags, error: allTagsError } = await supabase
      .from('tags')
      .select()
      .in(
        'slug',
        testTags.map((t) => t.slug)
      )

    if (allTagsError) throw allTagsError

    // 2. 检查并创建测试文章
    const testPosts = [
      {
        title: '使用 Next.js 13 构建现代博客',
        slug: 'building-modern-blog-with-nextjs-13',
        content: `# 使用 Next.js 13 构建现代博客

## 简介

Next.js 13 带来了许多激动人心的新特性，让我们一起探索如何使用它构建一个现代化的博客系统。

## 主要特性

- App Router
- Server Components
- Streaming SSR
- React Server Components

## 代码示例

\`\`\`typescript
// 页面组件示例
export default function BlogPage() {
  return (
    <div>
      <h1>我的博客</h1>
      <PostList />
    </div>
  )
}
\`\`\`

## 总结

Next.js 13 提供了优秀的开发体验和性能优化，是构建现代博客的理想选择。`,
        excerpt:
          'Next.js 13 带来了许多激动人心的新特性，让我们一起探索如何使用它构建一个现代化的博客系统。',
        status: 'published',
      },
      {
        title: 'TypeScript 高级技巧',
        slug: 'typescript-advanced-tips',
        content: `# TypeScript 高级技巧

## 类型体操

TypeScript 的类型系统非常强大，让我们来看一些高级用法：

\`\`\`typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type User = {
  id: number;
  profile: {
    name: string;
    age: number;
  };
};

// 现在可以部分更新嵌套对象
type PartialUser = DeepPartial<User>;
\`\`\`

## 实践建议

1. 优先使用 interface
2. 合理使用泛型
3. 避免类型断言`,
        excerpt: '探索 TypeScript 的高级特性和最佳实践，提升代码的类型安全性。',
        status: 'published',
      },
    ]

    // 检查已存在的文章
    const { data: existingPosts } = await supabase
      .from('posts')
      .select('slug')
      .in(
        'slug',
        testPosts.map((p) => p.slug)
      )

    // 过滤出不存在的文章
    const newPosts = testPosts.filter((post) => !existingPosts?.some((ep) => ep.slug === post.slug))

    // 只插入新文章
    const { data: posts, error: postError } = await supabase.from('posts').upsert(newPosts).select()

    if (postError) throw postError

    // 获取所有需要的文章（包括已存在的和新创建的）
    const { data: allPosts, error: allPostsError } = await supabase
      .from('posts')
      .select()
      .in(
        'slug',
        testPosts.map((p) => p.slug)
      )

    if (allPostsError) throw allPostsError

    // 3. 创建文章和标签的关联
    const postTags = []
    for (const post of allPosts) {
      if (post.slug === 'building-modern-blog-with-nextjs-13') {
        postTags.push(
          { post_id: post.id, tag_id: allTags.find((t) => t.slug === 'nextjs')?.id },
          { post_id: post.id, tag_id: allTags.find((t) => t.slug === 'react')?.id }
        )
      } else if (post.slug === 'typescript-advanced-tips') {
        postTags.push({
          post_id: post.id,
          tag_id: allTags.find((t) => t.slug === 'typescript')?.id,
        })
      }
    }

    // 先删除已有的关联
    await supabase
      .from('post_tags')
      .delete()
      .in(
        'post_id',
        allPosts.map((p) => p.id)
      )

    // 创建新的关联
    const { error: postTagError } = await supabase
      .from('post_tags')
      .upsert(postTags.filter((pt) => pt.post_id && pt.tag_id))

    if (postTagError) throw postTagError

    return NextResponse.json({
      success: true,
      message: '测试数据创建成功',
      data: {
        newTags: tags?.length || 0,
        newPosts: posts?.length || 0,
        postTags: postTags.length,
      },
    })
  } catch (error) {
    console.error('创建测试数据失败:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '创建测试数据失败',
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
