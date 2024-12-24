import { BlogList } from '@/components/blog/BlogList'
import { handleError } from '@/utils/error'
import { ErrorComponent } from '@/components/ui/error'

export default async function BlogPage() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

    const res = await fetch(`${baseUrl}/api/posts`, {
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
        'X-List-Type': 'published-only',
      },
    })

    if (!res.ok) {
      throw new Error(`获取文章失败: ${res.statusText}`)
    }

    const { data: posts } = await res.json()

    const publishedPosts = posts?.filter((post) => post.status === 'published')

    if (!publishedPosts?.length) {
      return (
        <div className='container mx-auto px-4 py-8'>
          <p className='text-gray-600'>暂无已发布的文章</p>
        </div>
      )
    }

    return (
      <div className='container mx-auto px-4 py-8'>
        <BlogList posts={publishedPosts} />
      </div>
    )
  } catch (error) {
    console.error('BlogPage: Error details:', error)
    return <ErrorComponent error={handleError(error)} />
  }
}
