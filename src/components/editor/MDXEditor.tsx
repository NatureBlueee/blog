'use client'

import { useCallback } from 'react'
import { Editor } from '@monaco-editor/react'

interface MDXEditorProps {
  value: string
  onChangeAction: (value: string) => void
}

export default function MDXEditor({ value, onChangeAction }: MDXEditorProps) {
  const handleEditorChange = useCallback((value: string | undefined) => {
    onChangeAction(value || '')
  }, [onChangeAction])

  return (
    <div className="h-[500px] border rounded-lg overflow-hidden">
      <Editor
        defaultLanguage="markdown"
        value={value}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          lineNumbers: 'on',
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true
        }}
      />
    </div>
  )
} 