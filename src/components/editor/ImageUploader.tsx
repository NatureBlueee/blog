'use client'

import { useState, useCallback } from 'react'
import { uploadImage } from '@/lib/upload'
import { Button } from '@/components/ui/button'
import { HiPhoto } from 'react-icons/hi2'

interface ImageUploaderProps {
  onUpload: (url: string) => void
}

export function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = useCallback(async (file: File) => {
    try {
      setIsUploading(true)
      const url = await uploadImage(file)
      onUpload(url)
    } finally {
      setIsUploading(false)
    }
  }, [onUpload])

  return (
    <Button
      variant="outline"
      onClick={() => document.getElementById('image-upload')?.click()}
      disabled={isUploading}
      className="flex items-center gap-2"
    >
      <HiPhoto className="w-4 h-4" />
      {isUploading ? '上传中...' : '插入图片'}
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        className="hidden"
      />
    </Button>
  )
} 