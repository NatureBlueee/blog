import { 
  HiBold, 
  HiCode, 
  HiLink, 
  HiListBullet,
  HiOutlineDocumentText,
  HiPhoto,
  HiTableCells
} from 'react-icons/hi2'

import {
  HiOutlineCode,
  HiOutlineQuote
} from 'react-icons/hi'

import type { MarkdownActionType, TextRange, MarkdownAction } from '@/types/editor'

interface MarkdownToolbarProps {
  onAction: (action: MarkdownAction) => void
  getSelection: () => TextRange
  disabled?: boolean
}

interface ToolbarItem {
  type: MarkdownActionType
  icon: React.ComponentType
  label: string
  shortcut: string
  needsInput?: boolean
}

const TOOLBAR_ITEMS: ToolbarItem[] = [
  { type: 'bold', icon: HiBold, label: '加粗', shortcut: 'Ctrl+B' },
  { type: 'italic', icon: HiOutlineDocumentText, label: '斜体', shortcut: 'Ctrl+I' },
  { type: 'code', icon: HiCode, label: '行内代码', shortcut: 'Ctrl+`' },
  { type: 'codeblock', icon: HiOutlineCode, label: '代码块', shortcut: 'Ctrl+Shift+`' },
  { type: 'link', icon: HiLink, label: '链接', shortcut: 'Ctrl+K', needsInput: true },
  { type: 'bullet', icon: HiListBullet, label: '无序列表', shortcut: 'Ctrl+U' },
  { type: 'number', icon: HiOutlineDocumentText, label: '有序列表', shortcut: 'Ctrl+O' },
  { type: 'quote', icon: HiOutlineQuote, label: '引用', shortcut: 'Ctrl+Q' },
  { type: 'heading1', icon: HiOutlineDocumentText, label: '一级标题', shortcut: 'Ctrl+1' },
  { type: 'heading2', icon: HiOutlineDocumentText, label: '二级标题', shortcut: 'Ctrl+2' },
  { type: 'heading3', icon: HiOutlineDocumentText, label: '三级标题', shortcut: 'Ctrl+3' },
  { type: 'image', icon: HiPhoto, label: '图片', shortcut: 'Ctrl+P', needsInput: true },
  { type: 'table', icon: HiTableCells, label: '表格', shortcut: 'Ctrl+T', needsInput: true }
]

export function MarkdownToolbar({ onAction, getSelection, disabled = false }: MarkdownToolbarProps) {
  const handleAction = async (item: ToolbarItem) => {
    const range = getSelection()
    
    if (item.needsInput) {
      let value = ''
      
      switch (item.type) {
        case 'link':
          value = await window.prompt('请输入链接地址:', 'https://')
          break
        case 'image':
          value = await window.prompt('请输入图片地址:', 'https://')
          break
        case 'table':
          const columns = await window.prompt('请输入表格列数:', '3')
          if (columns) {
            value = Array(parseInt(columns, 10))
              .fill('列标题')
              .join(' | ')
          }
          break
      }
      
      if (!value) return
      
      onAction({
        type: item.type,
        range,
        value
      })
    } else {
      onAction({
        type: item.type,
        range
      })
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1 bg-white dark:bg-gray-800 rounded-lg p-1">
      {TOOLBAR_ITEMS.map((item) => {
        const Icon = item.icon
        return (
          <button
            key={item.type}
            onClick={() => handleAction(item)}
            disabled={disabled}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded group relative"
            aria-label={item.label}
          >
            <Icon className="w-4 h-4" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {item.label} ({item.shortcut})
            </span>
          </button>
        )
      })}
    </div>
  )
} 