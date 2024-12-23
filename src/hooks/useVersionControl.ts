'use client'

import { useState, useCallback } from 'react'
import type { PostVersion } from '@/types'

export function useVersionControl(postId: string) {
  const [versions, setVersions] = useState<PostVersion[]>([])
  const [currentVersion, setCurrentVersion] = useState<string | null>(null)

  const saveVersion = useCallback(async (
    content: string,
    type: 'auto' | 'manual',
    description?: string
  ) => {
    const version: PostVersion = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      content,
      type,
      description
    }

    setVersions(prev => [...prev, version])
    return version.id
  }, [])

  const loadVersion = useCallback(async (versionId: string) => {
    const version = versions.find(v => v.id === versionId)
    if (version) {
      setCurrentVersion(version.id)
      return version.content
    }
    return null
  }, [versions])

  return {
    versions,
    currentVersion,
    saveVersion,
    loadVersion
  }
} 