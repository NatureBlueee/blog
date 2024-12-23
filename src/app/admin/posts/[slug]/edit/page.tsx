'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { BlogEditor } from '@/components/editor/BlogEditor'
import { toast } from '@/components/ui/use-toast'
import type { BlogPost } from '@/types'

export default function EditPostPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadPost() {
      try {
        const response = await fetch(`/api/posts/${params.slug}`)
        if (!response.ok) throw new Error('加载文章失败')
        const data = await response.json()
        setPost(data)
      } catch (error) {
        console.error('加载文章失败:', error)
        toast({
          variant: 'destructive',
          title: '错误',
          description: '加载文章失败',
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (params.slug) {
      loadPost()
    }
  }, [params.slug])

  if (isLoading) {
    return <div className='p-8'>加载中...</div>
  }

  if (!post) {
    return <div className='p-8'>文章不存在</div>
  }

  return (
    <div className='container mx-auto p-6'>
      <BlogEditor
        initialData={post}
        onSave={async (data) => {
          try {
            const response = await fetch(`/api/posts/${post.slug}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            })
            if (!response.ok) throw new Error('保存失败')

            toast({
              title: '成功',
              description: '文章已保存',
            })

            router.refresh()
          } catch (error) {
            console.error('保存失败:', error)
            toast({
              variant: 'destructive',
              title: '错误',
              description: '保存失败',
            })
          }
        }}
      />
    </div>
  )
}
