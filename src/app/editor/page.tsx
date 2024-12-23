'use client'

import { MarkdownEditor } from '@/components/editor/MarkdownEditor'

export default function EditorPage() {
  const handleSave = async (content: string) => {
    try {
      const response = await fetch('/api/save-markdown', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to save markdown')
      }
    } catch (error) {
      console.error('Error saving markdown:', error)
      throw error
    }
  }

  return (
    <main className="container mx-auto py-6 px-4">
      <MarkdownEditor
        initialContent="# Welcome to the Markdown Editor"
        onSave={handleSave}
        className="min-h-[600px]"
      />
    </main>
  )
} 