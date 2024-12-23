'use client'

import { useState } from 'react'
import { HiTrash, HiDocumentDuplicate, HiDownload } from 'react-icons/hi'

interface BulkActionsProps {
  selectedIds: string[]
  onDeleteAction: (ids: string[]) => Promise<void>
  onExportAction: (ids: string[]) => Promise<void>
  onCopyAction: (ids: string[]) => Promise<void>
}

export default function BulkActions({
  selectedIds,
  onDeleteAction,
  onExportAction,
  onCopyAction
}: BulkActionsProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = async (
    action: (ids: string[]) => Promise<void>
  ) => {
    try {
      setIsLoading(true)
      await action(selectedIds)
    } catch (error) {
      console.error('批量操作失败:', error)
      alert('操作失败')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-500">
        已选择 {selectedIds.length} 项
      </span>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleAction(onDeleteAction)}
          disabled={isLoading || selectedIds.length === 0}
          className="inline-flex items-center px-3 py-1.5 text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
        >
          <HiTrash className="w-4 h-4 mr-1" />
          删除
        </button>
        <button
          onClick={() => handleAction(onCopyAction)}
          disabled={isLoading || selectedIds.length === 0}
          className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
        >
          <HiDocumentDuplicate className="w-4 h-4 mr-1" />
          复制
        </button>
        <button
          onClick={() => handleAction(onExportAction)}
          disabled={isLoading || selectedIds.length === 0}
          className="inline-flex items-center px-3 py-1.5 text-sm text-green-600 hover:text-green-700 disabled:opacity-50"
        >
          <HiDownload className="w-4 h-4 mr-1" />
          导出
        </button>
      </div>
    </div>
  )
} 