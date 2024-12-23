'use client'

import { useState, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import type { PostFormData } from '@/types'

interface PostFormProps {
  initialData?: PostFormData
  onSubmit: (data: PostFormData) => Promise<void>
  isSubmitting?: boolean
}

export default function PostForm({ initialData, onSubmit, isSubmitting = false }: PostFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    tags: initialData?.tags?.join(', ') || '',
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await onSubmit({
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map((tag) => tag.trim()) : [],
    })
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div>
        <label className='block text-sm font-medium mb-2'>标题</label>
        <input
          type='text'
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          className='w-full p-2 border rounded-lg'
          required
        />
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>摘要</label>
        <textarea
          value={formData.excerpt}
          onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
          className='w-full p-2 border rounded-lg h-20'
        />
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>内容</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
          className='w-full p-2 border rounded-lg h-[400px]'
          required
        />
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>标签</label>
        <input
          type='text'
          value={formData.tags}
          onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
          className='w-full p-2 border rounded-lg'
          placeholder='用逗号分隔多个标签'
        />
      </div>

      <div className='flex justify-end'>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? '保存中...' : '保存'}
        </Button>
      </div>
    </form>
  )
}
