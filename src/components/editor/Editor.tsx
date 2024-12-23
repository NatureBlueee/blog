import { useCallback, useRef, useEffect } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { EditorView } from '@codemirror/view'
import type { EditorProps } from '@/types'

export function Editor({ content, onChange }: EditorProps) {
  const handleChange = useCallback(
    (value: string) => {
      onChange(value)
    },
    [onChange]
  )

  return (
    <CodeMirror
      value={content}
      height='500px'
      extensions={[markdown()]}
      onChange={handleChange}
      theme='dark'
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        dropCursor: true,
        allowMultipleSelections: true,
        indentOnInput: true,
      }}
    />
  )
}
