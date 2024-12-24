import { Metadata } from 'next'
import { PostContent } from '@/components/blog/PostContent'
import { ErrorComponent } from '@/components/ui/error'
import { handleError } from '@/utils/error'
import ReactMarkdown from 'react-markdown'

interface PostPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${params.slug}`)
    if (!res.ok) throw new Error(`获取文章失败: ${res.statusText}`)

    const { data: post } = await res.json()
    if (!post) throw new Error('文章不存在')

    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        publishedTime: post.publishedAt,
        authors: post.author ? [post.author.name] : undefined,
        tags: post.tags?.map((tag) => tag.name),
      },
    }
  } catch (error) {
    return {
      title: '文章未找到',
      description: '无法加载文章内容',
    }
  }
}

export default async function PostPage({ params }: PostPageProps) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/posts/${params.slug}`, {
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      throw new Error(`获取文章失败: ${res.statusText}`)
    }

    const { data: post } = await res.json()

    if (!post) {
      throw new Error('文章不存在')
    }

    return (
      <article className='container mx-auto px-4 py-8'>
        <header className='mb-8'>
          <h1 className='text-4xl font-bold mb-4'>{post.title}</h1>
          <div className='flex items-center text-gray-500 text-sm'>
            <time dateTime={post.created_at}>
              {new Date(post.created_at).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </time>
            {post.tags?.length > 0 && (
              <div className='flex gap-2 ml-4'>
                {post.tags.map((tag) => (
                  <span key={tag.tag.id} className='px-2 py-1 bg-gray-100 rounded-full text-sm'>
                    {tag.tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>
        <div className='prose prose-lg max-w-none'>
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    )
  } catch (error) {
    return <ErrorComponent error={handleError(error)} />
  }
}
