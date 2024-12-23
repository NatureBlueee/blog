'use client'

import { PostStatus } from '../../types'

interface PostStatusToggleProps {
  status: PostStatus
  onStatusChangeAction: (status: PostStatus) => Promise<void>
  disabled?: boolean
}

export default function PostStatusToggle({ 
  status, 
  onStatusChangeAction,
  disabled 
}: PostStatusToggleProps) {
  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm font-medium">状态：</span>
      <div className="flex rounded-lg border dark:border-gray-600 p-1">
        <button
          type="button"
          onClick={() => onStatusChangeAction('draft')}
          disabled={disabled}
          className={`px-3 py-1 text-sm rounded ${
            status === 'draft'
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          草稿
        </button>
        <button
          type="button"
          onClick={() => onStatusChangeAction('published')}
          disabled={disabled}
          className={`px-3 py-1 text-sm rounded ${
            status === 'published'
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          已发布
        </button>
      </div>
    </div>
  )
} 