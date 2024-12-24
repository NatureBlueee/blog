'use client'

interface Post {
  id: string
  title: string
  slug: string
  status: string
  created_at: string
}

interface PostsListProps {
  posts?: Post[]
}

export function PostsList({ posts }: PostsListProps) {
  if (!posts?.length) {
    return (
      <div className='flex items-center justify-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed'>
        暂无文章
      </div>
    )
  }

  return (
    <div className='divide-y divide-gray-100'>
      {posts.map((post) => (
        <div key={post.id} className='py-4 hover:bg-gray-50 transition-colors'>
          <div className='flex items-center justify-between gap-4'>
            <div className='space-y-1'>
              <h3 className='font-medium text-gray-900'>{post.title}</h3>
              <p className='text-sm text-gray-500 font-mono'>{post.slug}</p>
            </div>
            <div className='flex items-center gap-3'>
              <span
                className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                  post.status === 'published'
                    ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20'
                    : 'bg-gray-50 text-gray-600 ring-1 ring-gray-500/20'
                }`}
              >
                {post.status === 'published' ? '已发布' : '草稿'}
              </span>
              <time className='text-sm text-gray-500' dateTime={post.created_at}>
                {new Date(post.created_at).toLocaleDateString()}
              </time>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
