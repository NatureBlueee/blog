'use client'

import dynamic from 'next/dynamic'
import type { ChangeEvent } from 'react'
import type { MDEditorProps, ContextStore } from '@uiw/react-md-editor'

const MDEditor = dynamic<MDEditorProps>(
  () => import('@uiw/react-md-editor').then((mod) => {
    const { default: MDEditor } = mod
    return MDEditor
  }),
  { ssr: false }
)

interface EditorProps {
  value: string
  onChangeAction: (value: string) => void
}

export function Editor({ value, onChangeAction }: EditorProps) {
  return (
    <MDEditor
      value={value}
      onChange={(value?: string, event?: ChangeEvent<HTMLTextAreaElement>, state?: ContextStore) => {
        onChangeAction(value || '')
      }}
      height={500}
      preview="edit"
    />
  )
} 