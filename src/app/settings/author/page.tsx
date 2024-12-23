'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ImageUploader } from '@/components/blog/ImageUploader'

interface Author {
  name: string
  avatar: string
  bio: string
  social: {
    github: string
    twitter: string
    linkedin: string
    email: string
  }
}

const defaultAuthor: Author = {
  name: '',
  avatar: '',
  bio: '',
  social: {
    github: '',
    twitter: '',
    linkedin: '',
    email: ''
  }
}

export default function AuthorSettingsPage() {
  const router = useRouter()
  const [author, setAuthor] = useState<Author>(defaultAuthor)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await fetch('/api/settings/author')
        if (!response.ok) {
          throw new Error('Failed to fetch author settings')
        }
        const data = await response.json()
        setAuthor(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载作者信息失败')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAuthor()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/settings/author', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(author),
      })

      if (!response.ok) {
        throw new Error('Failed to update author settings')
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新作者信息失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarUpload = (url: string) => {
    setAuthor(prev => ({
      ...prev,
      avatar: url
    }))
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        作者信息设置
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          {/* 基本信息 */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                头像
              </label>
              <div className="mt-2 flex items-center gap-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                  {author.avatar && (
                    <Image
                      src={author.avatar}
                      alt="作者头像"
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <ImageUploader
                    postId="author"
                    onUploadAction={handleAvatarUpload}
                    onError={setError}
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                名字
              </label>
              <input
                type="text"
                id="name"
                value={author.name}
                onChange={(e) => setAuthor(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-800 dark:border-gray-700"
                required
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                简介
              </label>
              <textarea
                id="bio"
                value={author.bio}
                onChange={(e) => setAuthor(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-800 dark:border-gray-700"
                required
              />
            </div>
          </div>

          {/* 社交链接 */}
          <div className="mt-8 space-y-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              社交链接
            </h2>

            <div>
              <label htmlFor="github" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                GitHub
              </label>
              <input
                type="url"
                id="github"
                value={author.social.github}
                onChange={(e) => setAuthor(prev => ({
                  ...prev,
                  social: { ...prev.social, github: e.target.value }
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            <div>
              <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Twitter
              </label>
              <input
                type="url"
                id="twitter"
                value={author.social.twitter}
                onChange={(e) => setAuthor(prev => ({
                  ...prev,
                  social: { ...prev.social, twitter: e.target.value }
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                LinkedIn
              </label>
              <input
                type="url"
                id="linkedin"
                value={author.social.linkedin}
                onChange={(e) => setAuthor(prev => ({
                  ...prev,
                  social: { ...prev.social, linkedin: e.target.value }
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={author.social.email}
                onChange={(e) => setAuthor(prev => ({
                  ...prev,
                  social: { ...prev.social, email: e.target.value }
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {isLoading ? '保存中...' : '保存设置'}
          </button>
        </div>
      </form>
    </div>
  )
} 