import { useState, useEffect, useCallback } from 'react'
import { useDebounce } from 'use-debounce'

interface AutoSaveOptions<T> {
  data: T
  onSave: (data: T) => Promise<void>
  interval?: number
  enabled?: boolean
  compareData?: (a: T, b: T) => boolean
}

export function useAutoSave<T>({
  data,
  onSave,
  interval = 1000,
  enabled = true,
  compareData = (a, b) => JSON.stringify(a) === JSON.stringify(b)
}: AutoSaveOptions<T>) {
  const [initialData] = useState(data)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debouncedData] = useDebounce(data, interval)

  const handleSave = useCallback(async () => {
    if (!enabled || isSubmitting) return
    if (compareData(debouncedData, initialData)) return

    try {
      setIsSubmitting(true)
      setError(null)
      await onSave(debouncedData)
      setLastSaved(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : '自动保存失败')
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }, [debouncedData, initialData, enabled, isSubmitting, onSave, compareData])

  useEffect(() => {
    handleSave()
  }, [debouncedData, handleSave])

  return {
    lastSaved,
    isSubmitting,
    error
  }
} 