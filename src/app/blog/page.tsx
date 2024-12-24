import { BlogList } from '@/components/blog/BlogList'
import { handleError } from '@/utils/error'
import { ErrorComponent } from '@/components/ui/error'

export default async function BlogPage() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    console.log('BlogPage: Fetching from URL:', `${baseUrl}/api/posts`)

    const res = await fetch(`${baseUrl}/api/posts`, {
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('BlogPage: Response status:', res.status)

    if (!res.ok) {
      throw new Error(`获取文章失败: ${res.statusText}`)
    }

    const { data: posts } = await res.json()
    console.log('BlogPage: Posts received:', posts?.length)

    if (!posts?.length) {
      return (
        <div className='container mx-auto px-4 py-8'>
          <p className='text-gray-600'>暂无文章</p>
        </div>
      )
    }

    return (
      <div className='container mx-auto px-4 py-8'>
        <BlogList posts={posts} />
      </div>
    )
  } catch (error) {
    console.error('BlogPage: Error details:', {
      message: error instanceof Error ? error.message : '未知错误',
      stack: error instanceof Error ? error.stack : undefined,
    })
    return <ErrorComponent error={handleError(error)} />
  }
}
