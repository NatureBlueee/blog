import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ImageUploader } from './ImageUploader'
import { AccessibleButton } from '@/components/common/AccessibleButton'
import type { ImageInfo } from '@/types'

interface ImageManagerProps {
  postSlug: string
  onSelect: (url: string) => void
  onClose: () => void
}

export function ImageManager({ postSlug, onSelect, onClose }: ImageManagerProps) {
  const [images, setImages] = useState<ImageInfo[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadImages() {
      try {
        const response = await fetch(`/api/posts/${postSlug}/images`)
        if (!response.ok) throw new Error('加载图片失败')
        const data = await response.json()
        setImages(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载失败')
      }
    }

    loadImages()
  }, [postSlug])

  const handleUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`/api/posts/${postSlug}/images`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('上传失败')
    }

    const newImage = await response.json()
    setImages(prev => [...prev, newImage])
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">图片管理</h3>
          <AccessibleButton
            label="关闭"
            variant="ghost"
            onClick={onClose}
          >
            <span className="sr-only">关闭</span>
            ×
          </AccessibleButton>
        </div>

        <ImageUploader
          onUpload={handleUpload}
          onError={setError}
        />

        {error && (
          <p className="text-sm text-red-500 mt-2">{error}</p>
        )}

        <div className="grid grid-cols-3 gap-4 mt-4">
          {images.map(image => (
            <button
              key={image.url}
              onClick={() => onSelect(image.url)}
              className="relative aspect-video group"
            >
              <Image
                src={image.url}
                alt={image.name}
                fill
                className="object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm">选择</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
} 