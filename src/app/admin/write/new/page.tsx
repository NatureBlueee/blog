'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { HiX, HiEye, HiSave } from 'react-icons/hi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { BlogEditor } from '@/components/editor/BlogEditor'
import { postService } from '@/lib/services/post'

export default function NewPostPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreatePost = async (content: string) => {
    if (!title.trim()) {
      toast({
        variant: 'destructive',
        title: '错误',
        description: '请输入文章标题',
      })
      return
    }

    try {
      setIsSubmitting(true)
      const post = await postService.create({
        title: title.trim(),
        content,
        status: 'draft',
      })

      toast({
        title: '成功',
        description: '文章已保存为草稿',
      })

      router.push(`/admin/write/${post.slug}`)
    } catch (error) {
      console.error('创建文章失败:', error)
      toast({
        variant: 'destructive',
        title: '错误',
        description: error instanceof Error ? error.message : '创建文章失败',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePreview = () => {
    // TODO: 实现预览功能
    toast({
      title: '提示',
      description: '预览功能开发中...',
    })
  }

  const handleSaveDraft = () => {
    // 触发编辑器的保存操作
    document.getElementById('editor-save-trigger')?.click()
  }

  return (
    <div className='container mx-auto space-y-6'>
      <div className='flex justify-between items-center'>
        <Input
          type='text'
          placeholder='输入文章标题...'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='text-2xl font-bold border-none focus-visible:ring-0 flex-1 mr-4'
        />
        <div className='flex items-center gap-2'>
          <Button variant='outline' onClick={() => router.back()} disabled={isSubmitting}>
            <HiX className='w-4 h-4 mr-1' />
            取消
          </Button>
          <Button variant='outline' onClick={handlePreview} disabled={isSubmitting}>
            <HiEye className='w-4 h-4 mr-1' />
            预览
          </Button>
          <Button onClick={handleSaveDraft} disabled={isSubmitting}>
            <HiSave className='w-4 h-4 mr-1' />
            保存草稿
          </Button>
        </div>
      </div>

      <BlogEditor
        initialData={{
          content: '',
          title: title,
        }}
        onSave={handleCreatePost}
      />
    </div>
  )
}
