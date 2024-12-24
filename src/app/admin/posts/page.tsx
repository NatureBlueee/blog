'use client'

import { PostList } from '@/components/admin/PostList'
import { Providers } from '@/app/providers'

export default function PostsPage() {
  return (
    <Providers>
      <div className='container py-8'>
        <h1 className='text-2xl font-bold mb-6'>文章管理</h1>
        <PostList />
      </div>
    </Providers>
  )
}
