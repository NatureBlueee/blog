'use client'

import { useEffect, useState } from 'react'
import type { PostFormData } from '@/types'

interface MetadataFormProps {
  initialData?: Partial<PostFormData>
  onChange: (data: PostFormData) => void
}

export function MetadataForm({ initialData, onChange }: MetadataFormProps) {
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    excerpt: '',
    category: '',
    tags: [],
    ...initialData
  })

  useEffect(() => {
    onChange(formData)
  }, [formData, onChange])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'tags' ? value.split(',').map(tag => tag.trim()) : value
    }))
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          标题
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          摘要
        </label>
        <textarea
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          分类
        </label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          标签 (用逗号分隔)
        </label>
        <input
          type="text"
          name="tags"
          value={formData.tags.join(', ')}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
    </div>
  )
} 