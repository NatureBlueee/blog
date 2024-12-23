'use client'

import { useState } from 'react'
import {
  HiOutlineDocumentText,
  HiOutlineLink,
  HiOutlineListBullet,
  HiPhoto,
  HiTableCells
} from 'react-icons/hi2'

import {
  HiOutlineCode,
  HiOutlineQuote
} from 'react-icons/hi'

interface VisualEditorProps {
  initialContent: string
  onSubmit: (content: string) => void
  isSubmitting?: boolean
}

const TOOLBAR_ITEMS = [
  { type: 'heading', icon: HiOutlineDocumentText, label: '标题' },
  { type: 'link', icon: HiOutlineLink, label: '链接' },
  { type: 'list', icon: HiOutlineListBullet, label: '列表' },
  { type: 'image', icon: HiPhoto, label: '图片' },
  { type: 'table', icon: HiTableCells, label: '表格' },
  { type: 'code', icon: HiOutlineCode, label: '代码' },
  { type: 'quote', icon: HiOutlineQuote, label: '引用' }
]

export function VisualEditor({ initialContent, onSubmit, isSubmitting }: VisualEditorProps) {
  const [content, setContent] = useState(initialContent)

  const handleToolbarAction = (type: string) => {
    let insertion = ''
    switch (type) {
      case 'heading':
        insertion = '\n# 标题\n'
        break
      case 'link':
        insertion = '[链接文字](链接地址)'
        break
      case 'list':
        insertion = '\n- 列表项\n- 列表项\n- 列表项\n'
        break
      case 'image':
        insertion = '\n![图片描述](图片地址)\n'
        break
      case 'table':
        insertion = '\n| 表头 | 表头 |\n|------|------|\n| 内容 | 内容 |\n'
        break
      case 'code':
        insertion = '\n```\n代码块\n```\n'
        break
      case 'quote':
        insertion = '\n> 引用文字\n'
        break
    }
    setContent(prev => prev + insertion)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
        {TOOLBAR_ITEMS.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => handleToolbarAction(type)}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title={label}
          >
            <Icon className="w-5 h-5" />
          </button>
        ))}
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isSubmitting}
        className="w-full h-[500px] p-4 border rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-800"
        placeholder="开始编写..."
      />
    </div>
  )
} 