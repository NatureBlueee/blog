import { useState, useMemo, useEffect } from 'react'
import { useDebounce } from './useDebounce'
import { pinyin } from 'pinyin-pro'

interface SearchOptions {
  enablePinyin?: boolean
  threshold?: number
  limit?: number
}

export function useSmartSearch<T extends Record<string, any>>(
  items: T[],
  searchFields: (keyof T)[],
  options: SearchOptions = {}
) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  // 创建搜索索引
  const searchIndex = useMemo(() => {
    return items.map((item) => {
      const searchData = searchFields.map((field) => {
        const value = String(item[field] || '')

        // 转换为拼音（包括首字母）
        const pinyinData = pinyin(value, {
          toneType: 'none',
          type: 'array',
          multiple: false,
        })

        // 获取拼音首字母
        const initialData = pinyin(value, {
          pattern: 'first',
          toneType: 'none',
          type: 'array',
          multiple: false,
        })

        // 调试日志
        console.log('Field:', field, 'Value:', value)
        console.log('Pinyin:', pinyinData)
        console.log('Initials:', initialData)

        return {
          original: value.toLowerCase(),
          pinyin: pinyinData.join(''),
          firstLetters: initialData.join(''),
        }
      })
      return { item, searchData }
    })
  }, [items, searchFields])

  // 搜索逻辑
  const results = useMemo(() => {
    if (!debouncedQuery) return items

    const searchQuery = debouncedQuery.toLowerCase()

    // 调试日志
    console.log('Processing query:', searchQuery)

    const matches = searchIndex
      .map(({ item, searchData }) => {
        const score = searchData.reduce((maxScore, data) => {
          // 调试日志
          console.log('Matching against:', {
            original: data.original,
            pinyin: data.pinyin,
            firstLetters: data.firstLetters,
          })

          const originalScore = data.original.includes(searchQuery) ? 1 : 0
          const pinyinScore = data.pinyin.includes(searchQuery) ? 0.8 : 0
          const firstLetterScore = data.firstLetters.includes(searchQuery) ? 0.6 : 0

          return Math.max(maxScore, originalScore, pinyinScore, firstLetterScore)
        }, 0)
        return { item, score }
      })
      .filter(({ score }) => score > (options.threshold || 0))
      .sort((a, b) => b.score - a.score)

    return matches.slice(0, options.limit).map(({ item }) => item)
  }, [debouncedQuery, searchIndex, options.threshold, options.limit])

  return {
    query,
    setQuery,
    results,
  }
}
