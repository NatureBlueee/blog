'use client'

import { useState, useEffect } from 'react'
import { HiUpload, HiTrash, HiLink, HiSearch, HiSortDescending } from 'react-icons/hi'
import PageLayout from '@/components/layout/PageLayout'

interface MediaFile {
  id: string
  name: string
  url: string
  type: string
  size: number
  createdAt: string
}

type SortField = 'name' | 'size' | 'createdAt'
type SortOrder = 'asc' | 'desc'

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [filteredFiles, setFilteredFiles] = useState<MediaFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [externalUrl, setExternalUrl] = useState('')
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [selectedType, setSelectedType] = useState<string>('all')

  // 文件类型选项
  const typeOptions = [
    { value: 'all', label: '全部' },
    { value: 'image', label: '图片' },
    { value: 'video', label: '视频' },
    { value: 'embed', label: '嵌入' }
  ]

  useEffect(() => {
    fetchFiles()
  }, [])

  useEffect(() => {
    // 过滤和排序文件
    let result = [...files]

    // 类型过滤
    if (selectedType !== 'all') {
      result = result.filter(file => file.type.startsWith(selectedType))
    }

    // 搜索过滤
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(file => 
        file.name.toLowerCase().includes(searchLower)
      )
    }

    // 排序
    result.sort((a, b) => {
      let compareResult = 0
      switch (sortField) {
        case 'name':
          compareResult = a.name.localeCompare(b.name)
          break
        case 'size':
          compareResult = a.size - b.size
          break
        case 'createdAt':
          compareResult = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
      }
      return sortOrder === 'asc' ? compareResult : -compareResult
    })

    setFilteredFiles(result)
  }, [files, search, sortField, sortOrder, selectedType])

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/media')
      if (!response.ok) throw new Error('获取文件列表失败')
      const data = await response.json()
      setFiles(data)
    } catch (error) {
      console.error('获取文件列表失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', e.target.files[0])

    try {
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '上传失败')
      }

      const data = await response.json()
      setFiles(prev => [data, ...prev])
    } catch (error) {
      console.error('上传失败:', error)
      alert(error instanceof Error ? error.message : '上传失败')
    } finally {
      setIsUploading(false)
    }
  }

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!externalUrl.trim()) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('url', externalUrl)

    try {
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '添加失败')
      }

      const data = await response.json()
      setFiles(prev => [data, ...prev])
      setExternalUrl('')
      setShowUrlInput(false)
    } catch (error) {
      console.error('添加外部链接失败:', error)
      alert(error instanceof Error ? error.message : '添加失败')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个文件吗？')) return

    try {
      const response = await fetch(`/api/media/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('删除失败')

      setFiles(prev => prev.filter(file => file.id !== id))
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败')
    }
  }

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(order => order === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  const renderMediaItem = (file: MediaFile) => {
    if (file.type.startsWith('embed/')) {
      return (
        <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <span className="text-lg">{file.name}</span>
        </div>
      )
    }

    if (file.type.startsWith('video/')) {
      return (
        <video
          src={file.url}
          className="w-full aspect-video object-cover rounded-lg"
          controls
        />
      )
    }

    return (
      <img
        src={file.url}
        alt={file.name}
        className="w-full aspect-square object-cover rounded-lg"
      />
    )
  }

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">媒体库</h1>
          <div className="flex gap-4">
            <label className="relative cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept="image/*,video/*"
                disabled={isUploading}
              />
              <span className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                <HiUpload className="w-5 h-5 mr-2" />
                {isUploading ? '上传中...' : '上传文件'}
              </span>
            </label>
            <button
              onClick={() => setShowUrlInput(prev => !prev)}
              className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <HiLink className="w-5 h-5 mr-2" />
              添加链接
            </button>
          </div>
        </div>

        <div className="mb-6 space-y-4">
          {showUrlInput && (
            <form onSubmit={handleUrlSubmit} className="flex gap-4">
              <input
                type="url"
                value={externalUrl}
                onChange={e => setExternalUrl(e.target.value)}
                placeholder="输入 YouTube 或 Gamma 链接"
                className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                disabled={isUploading}
              />
              <button
                type="submit"
                disabled={isUploading}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {isUploading ? '添加中...' : '添加'}
              </button>
            </form>
          )}

          <div className="flex gap-4">
            <div className="relative flex-1">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="搜索文件..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              {['name', 'size', 'createdAt'].map((field) => (
                <button
                  key={field}
                  onClick={() => handleSort(field as SortField)}
                  className={`px-4 py-2 rounded-lg border ${
                    sortField === field ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  <HiSortDescending className={`w-5 h-5 ${
                    sortField === field && sortOrder === 'asc' ? 'rotate-180' : ''
                  }`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredFiles.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            没有找到文件
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredFiles.map(file => (
              <div key={file.id} className="relative group">
                {renderMediaItem(file)}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    onClick={() => handleDelete(file.id)}
                  >
                    <HiTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  )
} 