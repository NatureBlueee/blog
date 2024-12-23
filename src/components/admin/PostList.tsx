'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import type { BlogPost } from '@/types'
import type { IconType } from 'react-icons'
import { HiEye, HiPencil, HiTrash, HiPlus } from 'react-icons/hi'
import BulkActions from './BulkActions'

interface PostListProps {
  posts: BlogPost[]
}

export default function PostList({ posts: initialPosts }: PostListProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])

  const handleDelete = async (slug: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return

    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('删除失败')

      setPosts(posts.filter(post => post.slug !== slug))
    } catch (error) {
      console.error('删除文章失败:', error)
      alert('删除文章失败')
    }
  }

  const handleBulkDelete = async (slugs: string[]) => {
    if (!confirm(`确定要删除选中的 ${slugs.length} 篇文章吗？`)) return

    try {
      await Promise.all(
        slugs.map(slug =>
          fetch(`/api/posts/${slug}`, { method: 'DELETE' })
        )
      )
      setPosts(posts.filter(post => !slugs.includes(post.slug)))
      setSelectedPosts([])
    } catch (error) {
      console.error('批量删除失败:', error)
      alert('批量删除失败')
    }
  }

  const handleBulkExport = async (slugs: string[]) => {
    try {
      const response = await fetch('/api/posts/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slugs })
      })

      if (!response.ok) throw new Error('导出失败')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `posts-${format(new Date(), 'yyyy-MM-dd')}.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('导出失败:', error)
      alert('导出失败')
    }
  }

  const handleBulkCopy = async (slugs: string[]) => {
    try {
      const response = await fetch('/api/posts/copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slugs })
      })

      if (!response.ok) throw new Error('复制失败')

      const newPosts = await response.json()
      setPosts([...newPosts, ...posts])
      setSelectedPosts([])
    } catch (error) {
      console.error('批量复制失败:', error)
      alert('批量复制失败')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <BulkActions
          selectedIds={selectedPosts}
          onDeleteAction={handleBulkDelete}
          onExportAction={handleBulkExport}
          onCopyAction={handleBulkCopy}
        />
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <HiPlus className="w-5 h-5 mr-2" />
          新建文章
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                标题
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                分类
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                发布日期
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                状态
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {posts.map((post) => (
              <tr key={post.slug} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {post.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700">
                    {post.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {format(new Date(post.date), 'yyyy-MM-dd')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    post.status === 'published'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                  }`}>
                    {post.status === 'published' ? '已发布' : '草稿'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-3">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <HiEye className="w-5 h-5" />
                    </Link>
                    <Link
                      href={`/admin/posts/${post.slug}/edit`}
                      className="text-blue-400 hover:text-blue-500"
                    >
                      <HiPencil className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(post.slug)}
                      className="text-red-400 hover:text-red-500"
                    >
                      <HiTrash className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 