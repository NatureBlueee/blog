'use client'

import { useCallback, useState } from 'react'
import { StackEditWrapper } from './StackEditWrapper'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { Toolbar } from './Toolbar'

interface MarkdownEditorProps {
  initialContent?: string
  onSave?: (content: string) => Promise<void>
  className?: string
  showToolbar?: boolean
}

export function MarkdownEditor({
  initialContent,
  onSave,
  className,
  showToolbar = true
}: MarkdownEditorProps) {
  const [content, setContent] = useState(initialContent || '')
  const [isSaving, setIsSaving] = useState(false)
  const { theme } = useTheme()

  const handleChange = useCallback((newContent: string) => {
    setContent(newContent)
  }, [])

  const handleSave = useCallback(async () => {
    if (!onSave) return
    
    try {
      setIsSaving(true)
      await onSave(content)
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setIsSaving(false)
    }
  }, [content, onSave])

  return (
    <div className="space-y-4">
      {showToolbar && (
        <Toolbar>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            variant="outline"
            size="sm"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </Toolbar>
      )}

      <StackEditWrapper
        initialContent={content}
        onChange={handleChange}
        onSave={handleSave}
        className={className}
        theme={theme as 'light' | 'dark'}
      />
    </div>
  )
} 