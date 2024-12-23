'use client'

import { useState, useEffect, useRef } from 'react'
import { debounce } from 'lodash'

interface UseAutoSaveProps<T> {
  data: T
  onSave: (data: T) => Promise<void>
  enabled?: boolean
  interval?: number
  delay?: number
}

export function useAutoSave<T>({
  data,
  onSave,
  enabled = true,
  interval = 30000, // 30秒
  delay = 1000     // 1秒防抖
}: UseAutoSaveProps<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const lastDataRef = useRef<T>(data)

  const debouncedSave = debounce(async (currentData: T) => {
    try {
      setIsSubmitting(true)
      setError(null)
      await onSave(currentData)
      setLastSaved(new Date())
      lastDataRef.current = currentData
    } catch (err) {
      setError(err instanceof Error ? err.message : '自动保存失败')
      console.error('自动保存失败:', err)
    } finally {
      setIsSubmitting(false)
    }
  }, delay)

  useEffect(() => {
    if (!enabled) return

    const hasChanged = JSON.stringify(data) !== JSON.stringify(lastDataRef.current)
    if (hasChanged) {
      debouncedSave(data)
    }

    const intervalId = setInterval(() => {
      const currentData = data
      const hasChanged = JSON.stringify(currentData) !== JSON.stringify(lastDataRef.current)
      if (hasChanged) {
        debouncedSave(currentData)
      }
    }, interval)

    return () => {
      clearInterval(intervalId)
      debouncedSave.cancel()
    }
  }, [data, enabled, interval, debouncedSave])

  return {
    isSubmitting,
    error,
    lastSaved
  }
} 