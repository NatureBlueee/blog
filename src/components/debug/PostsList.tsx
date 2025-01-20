'use client'

interface Post {
  id: string
  title: string
  slug: string
  status: string
  created_at: string
  published_at?: string
  content?: string
  excerpt?: string
  metadata?: {
    views_count?: number
    likes_count?: number
    comments_count?: number
  }
  post_tags?: Array<{
    id: string
    tag_id: string
    tags: {
      id: string
      name: string
      slug: string
    }
  }>
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

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'published':
        return { text: '已发布', className: 'bg-green-50 text-green-700 ring-1 ring-green-600/20' }
      case 'draft':
        return { text: '草稿', className: 'bg-gray-50 text-gray-600 ring-1 ring-gray-500/20' }
      case 'archived':
        return {
          text: '已归档',
          className: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20',
        }
      default:
        return { text: status, className: 'bg-gray-50 text-gray-600 ring-1 ring-gray-500/20' }
    }
  }

  return (
    <div className='divide-y divide-gray-100'>
      {posts.map((post) => {
        const statusDisplay = getStatusDisplay(post.status)
        return (
          <div
            key={post.id}
            className='p-4 bg-white rounded-lg border hover:border-gray-300 transition-colors'
          >
            <div className='space-y-2'>
              <div className='flex items-start justify-between'>
                <div>
                  <h3 className='font-medium text-gray-900'>{post.title}</h3>
                  {post.excerpt && <p className='mt-1 text-sm text-gray-500'>{post.excerpt}</p>}
                  {post.post_tags?.length > 0 && (
                    <div className='mt-2 flex items-center gap-2'>
                      {post.post_tags.map((pt) => (
                        <span
                          key={pt.id}
                          className='px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full'
                        >
                          {pt.tags.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {post.metadata && (
                  <div className='flex items-center gap-4 text-sm text-gray-500'>
                    {post.metadata.views_count !== undefined && (
                      <span>{post.metadata.views_count} 次浏览</span>
                    )}
                    {post.metadata.likes_count !== undefined && (
                      <span>{post.metadata.likes_count} 次点赞</span>
                    )}
                    {post.metadata.comments_count !== undefined && (
                      <span>{post.metadata.comments_count} 条评论</span>
                    )}
                  </div>
                )}
              </div>
              <div className='flex items-center gap-3'>
                <span
                  className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusDisplay.className}`}
                >
                  {statusDisplay.text}
                </span>
                <time
                  className='text-sm text-gray-500'
                  dateTime={post.published_at || post.created_at}
                >
                  {new Date(post.published_at || post.created_at).toLocaleDateString()}
                </time>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function getStatusDisplay(status: string) {
  switch (status) {
    case 'published':
      return { text: '已发布', className: 'bg-green-100 text-green-700' }
    case 'draft':
      return { text: '草稿', className: 'bg-gray-100 text-gray-700' }
    case 'archived':
      return { text: '已归档', className: 'bg-yellow-100 text-yellow-700' }
    default:
      return { text: '未知', className: 'bg-gray-100 text-gray-700' }
  }
}
