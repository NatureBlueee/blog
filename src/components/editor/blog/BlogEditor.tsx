'use client'

import { BaseEditor } from '../BaseEditor'
import type { Post, PostFormData } from '@/types'

interface BlogEditorProps {
  post?: Post
  isEditing?: boolean
  onSubmitAction: (content: string, metadata: PostFormData) => Promise<void>
  onSaveDraft?: (content: string, metadata: PostFormData) => Promise<void>
}

export function BlogEditor({
  post,
  isEditing = false,
  onSubmitAction,
  onSaveDraft
}: BlogEditorProps) {
  return (
    <BaseEditor
      initialContent={post?.content}
      initialMetadata={post}
      isEditing={isEditing}
      onSubmit={onSubmitAction}
      onSaveDraft={onSaveDraft}
    />
  )
} 