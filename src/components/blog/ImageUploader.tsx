'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import type { FileRejection, DropzoneOptions } from 'react-dropzone'
import Image from 'next/image'

interface ImageUploaderProps {
  onUploadAction: (url: string) => void
  onError?: (error: string) => void
  postId?: string
  className?: string
  maxSize?: number
  accept?: DropzoneOptions['accept']
}

interface UploadResponse {
  url: string
  success: boolean
  error?: string
}

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024 // 5MB
const DEFAULT_ACCEPT = {
  'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
}

export function ImageUploader({ 
  onUploadAction, 
  onError, 
  postId, 
  className = '',
  maxSize = DEFAULT_MAX_SIZE,
  accept = DEFAULT_ACCEPT
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = useCallback(async (file: File) => {
    if (!file) {
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', file)
      if (postId) {
        formData.append('postId', postId)
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Upload failed: ${errorText}`)
      }

      const data = await response.json() as UploadResponse
      if (!data.success) {
        throw new Error(data.error || 'Upload failed: Server returned unsuccessful response')
      }

      onUploadAction(data.url)
      return data.url
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image'
      onError?.(errorMessage)
      throw error
    }
  }, [postId, onUploadAction, onError])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      onError?.('Please upload an image file')
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    try {
      setIsUploading(true)
      await handleUpload(file)
    } finally {
      setIsUploading(false)
      URL.revokeObjectURL(objectUrl)
    }
  }, [handleUpload, onError])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    maxSize,
    onDropRejected: (fileRejections: FileRejection[]) => {
      const error = fileRejections[0]?.errors[0]?.message || 'File rejected'
      onError?.(error)
    }
  })

  return (
    <div 
      {...getRootProps()} 
      className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
        isDragActive 
          ? 'border-primary bg-primary/5' 
          : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
      } ${className}`}
      role="button"
      tabIndex={0}
      aria-label="Image upload area"
    >
      <input {...getInputProps()} aria-label="File input" />
      {isUploading ? (
        <div className="flex flex-col items-center space-y-2">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Uploading...
          </span>
        </div>
      ) : preview ? (
        <div className="relative w-full h-full">
          <Image
            src={preview}
            alt="Upload preview"
            fill
            className="object-contain rounded-lg"
            priority
          />
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-2 text-gray-600 dark:text-gray-400">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <p className="text-sm">
            {isDragActive
              ? 'Drop the image here'
              : 'Drag and drop an image, or click to select'}
          </p>
          <p className="text-xs text-gray-500">
            Supports: PNG, JPG, GIF, WebP (max {Math.round(maxSize / (1024 * 1024))}MB)
          </p>
        </div>
      )}
    </div>
  )
} 