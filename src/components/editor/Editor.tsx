import { useCallback, useRef, useEffect } from 'react'
import { useCodeMirror } from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { EditorView } from '@codemirror/view'
import type { EditorProps } from '@/types'

export function Editor({
  value,
  onChange,
  className = ''
}: EditorProps) {
  const editor = useRef<HTMLDivElement>(null)
  
  const { setContainer } = useCodeMirror({
    container: editor.current,
    value,
    extensions: [
      markdown(),
      EditorView.lineWrapping,
      EditorView.theme({
        '&': {
          height: '100%'
        }
      })
    ],
    onChange: useCallback((value) => {
      onChange(value)
    }, [onChange])
  })

  useEffect(() => {
    if (editor.current) {
      setContainer(editor.current)
    }
  }, [setContainer])

  return (
    <div 
      ref={editor} 
      className={`h-full overflow-auto ${className}`}
      data-testid="markdown-editor"
    />
  )
} 