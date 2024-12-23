import { HiEye, HiPencil, HiSave, HiClock } from 'react-icons/hi'
import { AccessibleButton } from '@/components/common/AccessibleButton'
import { MarkdownToolbar } from './MarkdownToolbar'
import type { TextRange } from '@/types'

interface EditorToolbarProps {
  isPreview: boolean
  onTogglePreview: () => void
  onSave: () => void
  onShowVersions: () => void
  onMarkdownAction: (type: string, selection: TextRange) => void
  getSelection: () => TextRange
  lastSaved: Date | null
  isSubmitting: boolean
}

export function EditorToolbar({
  isPreview,
  onTogglePreview,
  onSave,
  onShowVersions,
  onMarkdownAction,
  getSelection,
  lastSaved,
  isSubmitting
}: EditorToolbarProps) {
  return (
    <div className="flex flex-col border-b dark:border-gray-700">
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center space-x-2">
          <AccessibleButton
            label={isPreview ? '编辑' : '预览'}
            variant={isPreview ? 'secondary' : 'primary'}
            onClick={onTogglePreview}
          >
            {isPreview ? <HiPencil className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
          </AccessibleButton>

          <AccessibleButton
            label="保存"
            variant="primary"
            onClick={onSave}
            disabled={isSubmitting}
          >
            <HiSave className="w-5 h-5" />
          </AccessibleButton>

          <AccessibleButton
            label="版本历史"
            variant="secondary"
            onClick={onShowVersions}
          >
            <HiClock className="w-5 h-5" />
          </AccessibleButton>
        </div>

        {lastSaved && (
          <span className="text-sm text-gray-500">
            上次保存: {lastSaved.toLocaleTimeString()}
          </span>
        )}
      </div>
      
      {!isPreview && (
        <div className="px-2 pb-2">
          <MarkdownToolbar
            onAction={onMarkdownAction}
            getSelection={getSelection}
            disabled={isSubmitting}
          />
        </div>
      )}
    </div>
  )
} 