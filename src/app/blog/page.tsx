import { BlogList } from '@/components/blog/BlogList'
import { postService } from '@/lib/services/posts'
import { tagService } from '@/lib/services/tags'

export default async function BlogPage() {
  try {
    const [posts, tags] = await Promise.all([
      postService.getPosts({ status: 'published' }),
      tagService.getTags(),
    ])

    if (!Array.isArray(posts)) {
      console.error('Posts data is not an array:', posts)
      return (
        <div className='container mx-auto px-4 py-8'>
          <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
            <h2 className='text-red-800 font-semibold mb-2'>加载文章失败</h2>
            <p className='text-red-600'>错误：数据格式不正确</p>
            <p className='text-red-500 text-sm mt-2'>收到的数据：{JSON.stringify(posts)}</p>
          </div>
        </div>
      )
    }

    return (
      <div className='container mx-auto px-4 py-8'>
        <BlogList initialPosts={posts} tags={tags || []} />
      </div>
    )
  } catch (error) {
    console.error('Failed to load blog posts:', error)
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <h2 className='text-red-800 font-semibold mb-2'>加载文章失败</h2>
          <p className='text-red-600'>
            错误：{error instanceof Error ? error.message : String(error)}
          </p>
          {process.env.NODE_ENV === 'development' && (
            <pre className='mt-4 p-2 bg-red-100 rounded text-sm overflow-auto'>
              {JSON.stringify(error, null, 2)}
            </pre>
          )}
        </div>
      </div>
    )
  }
}
