'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { MetadataForm } from './MetadataForm'
import { BlogEditor } from '@/components/blog/BlogEditor'
import { HiSave, HiDocumentAdd, HiOutlineEye } from 'react-icons/hi'
import type { PostFormData } from '@/types'
import { VisualEditor } from '@/components/editor/VisualEditor'
import {
  HiOutlineDocumentText,
  HiOutlineLink,
  HiOutlineListBullet,
  HiPhoto,
  HiTableCells
} from 'react-icons/hi2'

import {
  HiOutlineCode,
  HiOutlineQuote
} from 'react-icons/hi'

import { StackEditWrapper } from '@/components/editor/StackEditWrapper'

interface PostEditorProps {
  initialContent?: string
  initialMetadata?: PostFormData
  onSaveAction: (content: string, metadata: PostFormData) => Promise<void>
}

export default function PostEditor({
  initialContent = '',
  initialMetadata,
  onSaveAction
}: PostEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [metadata, setMetadata] = useState<PostFormData>(initialMetadata || {
    title: '',
    excerpt: '',
    category: '',
    tags: [],
    status: 'draft'
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent)
  }, [])

  const handleSave = async () => {
    if (!metadata.title?.trim()) {
      throw new Error('标题不能为空')
    }
    
    setIsSaving(true)
    try {
      await onSaveAction(content, metadata)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <MetadataForm
        initialData={metadata}
        onChange={setMetadata}
        disabled={isSaving}
      />
      
      <StackEditWrapper
        initialContent={initialContent}
        onChange={handleContentChange}
        onSave={handleSave}
      />

      <div className="flex justify-end gap-2">
        <Button
          onClick={() => handleSave()}
          variant="outline"
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          <HiSave className="w-4 h-4" />
          保存草稿
        </Button>
        <Button
          onClick={() => handleSave()}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          <HiDocumentAdd className="w-4 h-4" />
          发布文章
        </Button>
      </div>
    </div>
  )
} 