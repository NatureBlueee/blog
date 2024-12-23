import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AccessibleButton } from '@/components/common/AccessibleButton'
import type { PostMetadata } from '@/types'

const metadataSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  excerpt: z.string().min(1, '摘要不能为空'),
  category: z.string().min(1, '分类不能为空'),
  tags: z.array(z.string()).min(1, '至少需要一个标签'),
  status: z.enum(['draft', 'published']),
  date: z.string().optional()
})

interface MetadataFormProps {
  initialData?: PostMetadata
  onChange: (data: PostMetadata) => void
  disabled?: boolean
}

export function MetadataForm({
  initialData,
  onChange,
  disabled = false
}: MetadataFormProps) {
  const {
    register,
    handleSubmit: onSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<PostMetadata>({
    resolver: zodResolver(metadataSchema),
    defaultValues: initialData || {
      title: '',
      excerpt: '',
      category: '',
      tags: [],
      status: 'draft'
    }
  })

  // 监听表单变化并触发onChange
  useEffect(() => {
    const subscription = watch((value) => {
      onChange(value as PostMetadata)
    })
    return () => subscription.unsubscribe()
  }, [watch, onChange])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 处理表单提交
  }

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.preventDefault()
    // 处理标签点击
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          标题
        </label>
        <input
          {...register('title')}
          type="text"
          disabled={disabled}
          className="w-full px-3 py-2 border rounded-lg"
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">
          摘要
        </label>
        <textarea
          {...register('excerpt')}
          disabled={disabled}
          rows={3}
          className="w-full px-3 py-2 border rounded-lg"
        />
        {errors.excerpt && (
          <p className="text-sm text-red-500">{errors.excerpt.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">
          分类
        </label>
        <select
          {...register('category')}
          disabled={disabled}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="">选择分类</option>
          <option value="前端开发">前端开发</option>
          <option value="后端开发">后端开发</option>
          <option value="全栈开发">全栈开发</option>
        </select>
        {errors.category && (
          <p className="text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">
          标签
        </label>
        <div className="flex flex-wrap gap-2">
          {['React', 'Next.js', 'TypeScript', 'JavaScript'].map(tag => (
            <AccessibleButton
              key={tag}
              label={tag}
              variant={watch('tags')?.includes(tag) ? 'primary' : 'secondary'}
              onClick={(e) => {
                e.preventDefault()
                const currentTags = watch('tags') || []
                setValue(
                  'tags',
                  currentTags.includes(tag)
                    ? currentTags.filter(t => t !== tag)
                    : [...currentTags, tag]
                )
              }}
              disabled={disabled}
            >
              {tag}
            </AccessibleButton>
          ))}
        </div>
        {errors.tags && (
          <p className="text-sm text-red-500">{errors.tags.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">
          状态
        </label>
        <select
          {...register('status')}
          disabled={disabled}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="draft">草稿</option>
          <option value="published">已发布</option>
        </select>
      </div>
    </form>
  )
} 