'use client'

import { useRouter } from 'next/navigation'
import { HiX, HiEye, HiSave } from 'react-icons/hi'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { BlogEditor } from '@/components/editor/BlogEditor'
import { postService } from '@/lib/services/post'
import type { PostFormData } from '@/types'

export default function NewPostPage() {
  const router = useRouter()

  const handleCreatePost = async (content: string, formData: PostFormData) => {
    try {
      const post = await postService.create({
        title: formData.title,
        slug: formData.slug,
        content,
        excerpt: formData.excerpt,
        status: 'draft',
        metadata: { tags: formData.tags },
      })

      toast({
        title: '成功',
        description: '文章已保存为草稿',
      })

      router.push(`/admin/posts/${post.id}/edit`)
    } catch (error) {
      console.error('创建文章失败:', error)
      toast({
        variant: 'destructive',
        title: '错误',
        description: error instanceof Error ? error.message : '创建文章失败',
      })
    }
  }

  const handlePreview = () => {
    // TODO: 实现预览功能
    toast({
      title: '提示',
      description: '预览功能开发中...',
    })
  }

  return (
    <div className='container mx-auto space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>新建文章</h1>
        <div className='flex items-center gap-2'>
          <Button variant='outline' onClick={() => router.back()}>
            <HiX className='w-4 h-4 mr-1' />
            取消
          </Button>
          <Button variant='outline' onClick={handlePreview}>
            <HiEye className='w-4 h-4 mr-1' />
            预览
          </Button>
        </div>
      </div>

      <BlogEditor initialData={{}} onSave={handleCreatePost} />
    </div>
  )
}
