import { postService } from '@/lib/services/posts'

export default async function BlogPage() {
  try {
    // 1. 获取已发布的文章
    const posts = (await postService.getPosts({ status: 'published' })) || []

    // 2. 确保 posts 是一个数组
    if (!Array.isArray(posts)) {
      console.error('Posts data is not an array:', posts)
      return <div>加载文章失败</div>
    }

    // 3. 如果没有文章，显示空状态
    if (posts.length === 0) {
      return (
        <div className='text-center py-10'>
          <p className='text-gray-500'>暂无文章</p>
        </div>
      )
    }

    // 4. 渲染文章列表
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {posts.map((post) => (
            <article
              key={post.id}
              className='bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'
            >
              <div className='p-6'>
                <h2 className='text-2xl font-bold mb-2'>
                  <a href={`/blog/${post.slug}`} className='hover:text-primary'>
                    {post.title}
                  </a>
                </h2>
                <p className='text-muted-foreground mb-4'>
                  {post.excerpt || post.content.substring(0, 150)}...
                </p>
                <div className='flex justify-between items-center text-sm text-muted-foreground'>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  <span>{post.views} 次阅读</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Failed to load blog posts:', error)
    return <div>加载文章失败</div>
  }
}
