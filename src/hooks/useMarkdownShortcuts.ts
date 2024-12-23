import { useCallback, useEffect } from 'react'
import { applyMarkdown, getSelection, setSelection } from '@/utils/markdown'
import type { TextRange } from '@/types'

interface ShortcutConfig {
  key: string
  ctrl?: boolean
  shift?: boolean
  action: string
}

const SHORTCUTS: ShortcutConfig[] = [
  { key: 'b', ctrl: true, action: 'bold' },
  { key: 'i', ctrl: true, action: 'italic' },
  { key: '`', ctrl: true, action: 'code' },
  { key: '`', ctrl: true, shift: true, action: 'codeblock' },
  { key: 'k', ctrl: true, action: 'link' },
  { key: 'u', ctrl: true, action: 'bullet' },
  { key: 'o', ctrl: true, action: 'number' },
  { key: 'q', ctrl: true, action: 'quote' },
  { key: 'f', ctrl: true, shift: true, action: 'format' }
]

export function useMarkdownShortcuts(
  textareaRef: React.RefObject<HTMLTextAreaElement>,
  onContentChange: (content: string) => void
) {
  const handleShortcut = useCallback((e: KeyboardEvent) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const shortcut = SHORTCUTS.find(
      s => 
        s.key === e.key &&
        !!s.ctrl === e.ctrlKey &&
        !!s.shift === e.shiftKey
    )

    if (!shortcut) return

    e.preventDefault()
    
    const selection: TextRange = getSelection(textarea)
    const result = applyMarkdown(textarea.value, selection, shortcut.action)
    
    onContentChange(result.text)
    setSelection(textarea, result.selection)
  }, [textareaRef, onContentChange])

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.addEventListener('keydown', handleShortcut)
    return () => textarea.removeEventListener('keydown', handleShortcut)
  }, [textareaRef, handleShortcut])

  return handleShortcut
} 