'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { QuillOptionsStatic } from 'quill'

interface UseQuillEditorOptions {
  content: string
  onChange: (value: string) => void
  onSave?: (value: string) => void
  options?: Partial<QuillOptionsStatic>
}

export function useQuillEditor({
  content,
  onChange,
  onSave,
  options = {}
}: UseQuillEditorOptions) {
  const [isLoading, setIsLoading] = useState(false)
  const editorRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const defaultOptions: Partial<QuillOptionsStatic> = {
    theme: 'snow',
    placeholder: '开始编写...',
    modules: {
      toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        ['link', 'image'],
        ['clean']
      ]
    },
    ...options
  }

  const initQuill = useCallback(async () => {
    if (!containerRef.current) return

    setIsLoading(true)
    try {
      const Quill = (await import('quill')).default
      
      // 确保只初始化一次
      if (!editorRef.current) {
        editorRef.current = new Quill(containerRef.current, defaultOptions)
        
        editorRef.current.on('text-change', () => {
          const value = editorRef.current?.root.innerHTML || ''
          onChange(value)
        })

        // 设置初始内容
        editorRef.current.root.innerHTML = content
      }
    } catch (error) {
      console.error('Quill initialization error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [content, onChange, defaultOptions])

  useEffect(() => {
    initQuill()
    
    return () => {
      if (editorRef.current) {
        editorRef.current.off('text-change')
      }
    }
  }, [initQuill])

  const handleSave = useCallback(() => {
    if (onSave && editorRef.current) {
      onSave(editorRef.current.root.innerHTML)
    }
  }, [onSave])

  return {
    containerRef,
    isLoading,
    handleSave,
    editor: editorRef.current
  }
} 