'use client'

import { useState, useEffect } from 'react'
import { HiSave } from 'react-icons/hi'
import PageLayout from '@/components/layout/PageLayout'

interface Settings {
  title: string
  description: string
  author: {
    name: string
    bio: string
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    title: '',
    description: '',
    author: {
      name: '',
      bio: ''
    }
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (!response.ok) throw new Error('获取设置失败')
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error('获取设置失败:', error)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (!response.ok) throw new Error('保存设置失败')
    } catch (error) {
      console.error('保存设置失败:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">网站设置</h1>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            <HiSave className="w-5 h-5 mr-2" />
            {isSaving ? '保存中...' : '保存'}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">网站标题</label>
            <input
              type="text"
              value={settings.title}
              onChange={e => setSettings(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">网站描述</label>
            <textarea
              value={settings.description}
              onChange={e => setSettings(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
            />
          </div>

          <div className="border-t pt-4">
            <h2 className="text-lg font-medium mb-4">作者信息</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">作者名称</label>
                <input
                  type="text"
                  value={settings.author.name}
                  onChange={e => setSettings(prev => ({
                    ...prev,
                    author: { ...prev.author, name: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">个人简介</label>
                <textarea
                  value={settings.author.bio}
                  onChange={e => setSettings(prev => ({
                    ...prev,
                    author: { ...prev.author, bio: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
} 