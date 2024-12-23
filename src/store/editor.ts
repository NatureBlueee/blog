'use client'

import { create } from 'zustand'
import { EDITOR_CONFIG } from '@/config/editor'
import type { PostFormData } from '@/types'

interface EditorState {
  content: string
  metadata: PostFormData
  isDirty: boolean
  isSaving: boolean
  lastSaved: Date | null
  currentVersion: string | null
  
  // Actions
  setContent: (content: string) => void
  setMetadata: (metadata: PostFormData) => void
  markAsSaving: () => void
  markAsSaved: () => void
  setCurrentVersion: (versionId: string | null) => void
  reset: () => void
}

export const useEditorStore = create<EditorState>((set) => ({
  content: '',
  metadata: {
    title: '',
    excerpt: '',
    category: '',
    tags: [],
    status: 'draft'
  },
  isDirty: false,
  isSaving: false,
  lastSaved: null,
  currentVersion: null,

  setContent: (content) => set((state) => ({
    content,
    isDirty: true
  })),

  setMetadata: (metadata) => set((state) => ({
    metadata,
    isDirty: true
  })),

  markAsSaving: () => set({ isSaving: true }),
  
  markAsSaved: () => set({
    isSaving: false,
    isDirty: false,
    lastSaved: new Date()
  }),

  setCurrentVersion: (versionId) => set({ currentVersion: versionId }),
  
  reset: () => set({
    content: '',
    metadata: {
      title: '',
      excerpt: '',
      category: '',
      tags: [],
      status: 'draft'
    },
    isDirty: false,
    isSaving: false,
    lastSaved: null,
    currentVersion: null
  })
})) 