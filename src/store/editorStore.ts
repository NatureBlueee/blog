import { create } from 'zustand'
import type { PostFormData } from '@/types'

interface EditorState {
  content: string
  metadata: PostFormData
  isSubmitting: boolean
  error: string | null
  lastSaved: Date | null
  setContent: (content: string) => void
  setMetadata: (metadata: PostFormData) => void
  setIsSubmitting: (isSubmitting: boolean) => void
  setError: (error: string | null) => void
  setLastSaved: (date: Date) => void
}

export const useEditorStore = create<EditorState>((set) => ({
  content: '',
  metadata: {
    title: '',
    excerpt: '',
    category: '',
    status: 'draft',
  },
  isSubmitting: false,
  error: null,
  lastSaved: null,
  setContent: (content) => set({ content }),
  setMetadata: (metadata) => set({ metadata }),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  setError: (error) => set({ error }),
  setLastSaved: (date) => set({ lastSaved: date }),
}))
