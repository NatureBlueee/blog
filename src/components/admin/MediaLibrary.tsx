'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { HiX, HiUpload, HiSearch } from 'react-icons/hi'

interface MediaLibraryProps {
  onSelect: (url: string) => void
  onClose: () => void
}

export default function MediaLibrary({ onSelect, onClose }: MediaLibraryProps) {
  const [files, setFiles] = useState<Array<{ name: string, url: string }>>([])
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('上传失败')
      
      const data = await response.json()
      setFiles(prev => [...prev, data])
    } catch (error) {
      console.error('上传失败:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">媒体库</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            关闭
          </button>
        </div>

        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg cursor-pointer"
          >
            {isUploading ? '上传中...' : '上传图片'}
          </label>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {files.map(file => (
            <div
              key={file.url}
              onClick={() => onSelect(file.url)}
              className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
            >
              <img
                src={file.url}
                alt={file.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 