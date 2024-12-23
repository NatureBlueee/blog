import { useCallback, useState } from 'react'
import { HiUpload, HiX } from 'react-icons/hi'
import { AccessibleButton } from '@/components/common/AccessibleButton'
import type { ImageUploaderProps } from '@/types'

export function ImageUploader({
  onUpload,
  onError,
  disabled = false
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (!file) return

      try {
        setIsUploading(true)
        await onUpload(file)
      } catch (error) {
        onError(error instanceof Error ? error.message : '上传失败')
      } finally {
        setIsUploading(false)
      }
    },
    [onUpload, onError]
  )

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      try {
        setIsUploading(true)
        await onUpload(file)
      } catch (error) {
        onError(error instanceof Error ? error.message : '上传失败')
      } finally {
        setIsUploading(false)
      }
    },
    [onUpload, onError]
  )

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`
        relative p-6 border-2 border-dashed rounded-lg
        ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={disabled || isUploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />

      <div className="flex flex-col items-center space-y-2">
        <HiUpload className="w-8 h-8 text-gray-400" />
        <p className="text-sm text-gray-500">
          {isUploading
            ? '上传中...'
            : '点击或拖拽图片到此处上传'}
        </p>
      </div>
    </div>
  )
} 