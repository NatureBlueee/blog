import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { BlogEditor } from '../BlogEditor'

// Mock CodeMirror 组件
vi.mock('@uiw/react-codemirror', () => ({
  default: ({ onChange }: { onChange: (value: string) => void }) => (
    <textarea data-testid='mock-editor' onChange={(e) => onChange(e.target.value)} />
  ),
}))

describe('BlogEditor', () => {
  const mockOnSubmit = vi.fn()
  const mockUpdatePost = vi.fn()

  vi.mock('@/store/blog', () => ({
    useBlogStore: () => ({
      updatePost: mockUpdatePost,
    }),
  }))

  const defaultProps = {
    initialContent: '# Test Content',
    onSubmitAction: mockOnSubmit,
    isEditing: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('handles auto-save when editing', async () => {
    const post = { slug: 'test-post', content: '# Initial' }

    render(<BlogEditor {...defaultProps} post={post} isEditing={true} />)

    const editor = screen.getByTestId('mock-editor')
    fireEvent.change(editor, {
      target: { value: '# Updated Content' },
    })

    await waitFor(() => {
      expect(mockUpdatePost).toHaveBeenCalledWith(
        'test-post',
        expect.objectContaining({
          content: '# Updated Content',
        })
      )
    })
  })

  it('shows error message when save fails', async () => {
    mockOnSubmit.mockRejectedValueOnce(new Error('保存失败'))

    render(<BlogEditor {...defaultProps} />)

    const editor = screen.getByTestId('mock-editor')
    fireEvent.change(editor, {
      target: { value: '# New Content' },
    })

    await waitFor(() => {
      expect(screen.getByText('保存失败')).toBeInTheDocument()
    })
  })
})
