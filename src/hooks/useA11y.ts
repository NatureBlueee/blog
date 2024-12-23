import { useCallback, useEffect } from 'react'

interface UseA11yOptions {
  escapeCallback?: () => void
  trapFocus?: boolean
  autoFocus?: boolean
}

export function useA11y({
  escapeCallback,
  trapFocus = false,
  autoFocus = false
}: UseA11yOptions = {}) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && escapeCallback) {
      escapeCallback()
    }
  }, [escapeCallback])

  useEffect(() => {
    if (escapeCallback) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown, escapeCallback])

  useEffect(() => {
    if (trapFocus) {
      const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      const firstFocusableElement = document.querySelector<HTMLElement>(focusableElements)
      const focusableContent = document.querySelectorAll<HTMLElement>(focusableElements)
      const lastFocusableElement = focusableContent[focusableContent.length - 1]

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
              lastFocusableElement?.focus()
              e.preventDefault()
            }
          } else {
            if (document.activeElement === lastFocusableElement) {
              firstFocusableElement?.focus()
              e.preventDefault()
            }
          }
        }
      }

      document.addEventListener('keydown', handleTabKey)
      if (autoFocus) firstFocusableElement?.focus()

      return () => document.removeEventListener('keydown', handleTabKey)
    }
  }, [trapFocus, autoFocus])
} 