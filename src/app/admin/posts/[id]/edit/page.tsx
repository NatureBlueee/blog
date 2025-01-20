'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { postService } from '@/lib/services/post'
import { BlogEditor } from '@/components/editor/BlogEditor'
import { toast } from '@/components/ui/use-toast'
import type { PostFormData } from '@/types'

export default function EditPostPage() {
  const params = useParams()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await postService.getById(params.id as string)
        setPost(data)
      } catch (error) {
        console.error('获取文章失败:', error)
        toast({
          variant: 'destructive',
          title: '错误',
          description: '获取文章失败',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [params.id])

  const handleUpdatePost = async (content: string, formData: PostFormData) => {
    try {
      await postService.update(params.id as string, {
        title: formData.title,
        content,
        excerpt: formData.excerpt,
        status: formData.status,
        metadata: { tags: formData.tags },
      })

      toast({
        title: '成功',
        description: '文章已更新',
      })
    } catch (error) {
      console.error('更新文章失败:', error)
      toast({
        variant: 'destructive',
        title: '错误',
        description: error instanceof Error ? error.message : '更新文章失败',
      })
    }
  }

  if (loading) {
    return <div>加载中...</div>
  }

  if (!post) {
    return <div>文章不存在</div>
  }

  return (
    <div className='container mx-auto space-y-6'>
      <h1 className='text-2xl font-bold'>编辑文章</h1>
      <BlogEditor
        initialData={{
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          tags: post.metadata?.tags || [],
          status: post.status,
        }}
        onSave={handleUpdatePost}
      />
    </div>
  )
}
