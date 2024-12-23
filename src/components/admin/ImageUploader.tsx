'use client'

import { useState, useRef } from 'react'
import { PhotoIcon } from '@heroicons/react/24/outline'

interface ImageUploaderProps {
  onUploadAction: (url: string) => void
}

export default function ImageUploader({ onUploadAction }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true)
      
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('上传失败')
      }

      const { url } = await response.json()
      onUploadAction(url)
    } catch (error) {
      console.error('上传图片失败:', error)
      alert('上传图片失败')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleUpload(file)
        }}
      />
      <button
        type="button"
        disabled={isUploading}
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <PhotoIcon className="w-5 h-5 mr-2" />
        {isUploading ? '上传中...' : '插入图片'}
      </button>
    </div>
  )
} 