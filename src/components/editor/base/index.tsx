'use client'

import { useEffect, useRef, useState } from 'react'
import { Editor } from '@monaco-editor/react'
import type { TextRange } from '@/types'

interface BaseEditorProps {
  initialContent: string
  onSubmit: (content: string) => Promise<void>
  isEditing?: boolean
  previewComponents?: any
  autoSave?: boolean
  isSubmitting?: boolean
}

export function BaseEditor({
  initialContent,
  onSubmit,
  isEditing = false,
  previewComponents,
  autoSave = false,
  isSubmitting = false
}: BaseEditorProps) {
  const [content, setContent] = useState(initialContent)
  const editorRef = useRef(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleChange = async (value: string | undefined) => {
    const newContent = value || ''
    setContent(newContent)
    
    if (autoSave) {
      try {
        await onSubmit(newContent)
      } catch (error) {
        console.error('Auto save failed:', error)
      }
    }
  }

  if (!mounted) return null

  return (
    <Editor
      height="70vh"
      defaultLanguage="markdown"
      value={content}
      onChange={handleChange}
      options={{
        minimap: { enabled: false },
        readOnly: isSubmitting,
        wordWrap: 'on'
      }}
    />
  )
} 