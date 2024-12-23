'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import type { PostVersion } from '@/types'
import { VisualEditor } from '@/components/editor/VisualEditor'

interface Version {
  id: string
  timestamp: Date
  type: 'auto' | 'manual'
  description?: string
}

interface VersionHistoryProps {
  versions: Version[]
  onSelect: (version: Version) => void
  onClose: () => void
}

export function VersionHistory({ versions, onSelect, onClose }: VersionHistoryProps) {
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">版本历史</h2>
        <div className="space-y-2">
          {versions.map(version => (
            <button
              key={version.id}
              onClick={() => onSelect(version)}
              className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <div className="flex justify-between">
                <span>{version.timestamp.toLocaleString()}</span>
                <span className="text-sm text-gray-500">
                  {version.type === 'auto' ? '自动保存' : '手动保存'}
                </span>
              </div>
              {version.description && (
                <p className="text-sm text-gray-600 mt-1">{version.description}</p>
              )}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          关闭
        </button>
        <VisualEditor
          initialContent={content}
          onSubmit={(newContent) => setContent(newContent)}
          isSubmitting={isSaving}
        />
      </div>
    </div>
  )
} 