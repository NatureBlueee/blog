'use client'

import { useRouter } from 'next/navigation'
import { BlogEditor } from '@/components/editor/BlogEditor'
import { createPost } from '@/services/posts'
import type { PostFormData } from '@/types'
import { useToast } from '@/components/ui/use-toast'

export default function NewPostPage() {
  const router = useRouter()
  const { toast } = useToast()

  const handleSave = async (data: PostFormData & { content: string }) => {
    try {
      const post = await createPost(data)

      toast({
        title: '保存成功',
        description: '文章已成功保存',
      })

      router.push(`/admin/posts/${post.slug}/edit`)
      return post
    } catch (error) {
      toast({
        title: '保存失败',
        description: error instanceof Error ? error.message : '创建文章失败',
        variant: 'destructive',
      })
      throw error
    }
  }

  return (
    <div className='container mx-auto py-6 px-4'>
      <h1 className='text-2xl font-bold mb-6'>创建新文章</h1>
      <BlogEditor onSave={handleSave} />
    </div>
  )
}
