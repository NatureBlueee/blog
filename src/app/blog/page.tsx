import { postService } from '@/lib/services/posts'
import { PostCard } from '@/components/blog/PostCard'

export default async function BlogPage() {
  const posts = (await postService.getPosts({ status: 'published' })) || []

  return (
    <div className='container py-16'>
      <h1 className='text-4xl font-bold mb-8 text-center'>思考与感悟</h1>
      <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
