import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { postService } from '@/lib/services/posts'
import { PostContent } from '@/components/blog/PostContent'
import { PostHeader } from '@/components/blog/PostHeader'
import { PostFooter } from '@/components/blog/PostFooter'
import { ReadingProgress } from '@/components/blog/ReadingProgress'

interface PostPageProps {
  params: {
    slug: string
  }
}

// 生成元数据
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await postService.getPostBySlug(params.slug)

  if (!post) return { title: '文章未找到' }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      authors: post.author ? [post.author.name] : undefined,
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await postService.getPostBySlug(params.slug)

  if (!post) notFound()

  return (
    <>
      <ReadingProgress />
      <article className='max-w-4xl mx-auto px-4 py-12'>
        <PostHeader post={post} />
        <PostContent content={post.content} />
        <PostFooter post={post} />
      </article>
    </>
  )
}
