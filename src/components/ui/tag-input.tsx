'use client'

import { useState, useCallback } from 'react'
import { Input } from './input'
import { Badge } from './badge'
import { HiX } from 'react-icons/hi'

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  disabled?: boolean
  className?: string
}

export function TagInput({
  value = [],
  onChange,
  disabled = false,
  className = ''
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()])
      }
      setInputValue('')
    }
  }, [inputValue, value, onChange])

  const removeTag = useCallback((tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove))
  }, [value, onChange])

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {value.map(tag => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              disabled={disabled}
              className="hover:text-destructive"
            >
              <HiX className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="输入标签后按回车添加..."
      />
    </div>
  )
} 