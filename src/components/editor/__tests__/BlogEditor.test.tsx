import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { BlogEditor } from '../blog/BlogEditor'

describe('BlogEditor', () => {
  const mockOnSubmit = vi.fn()
  const mockOnSaveDraft = vi.fn()
  
  const defaultProps = {
    onSubmitAction: mockOnSubmit,
    onSaveDraft: mockOnSaveDraft,
    isEditing: false
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders editor with initial content', () => {
    const post = {
      content: '# Test Content',
      title: 'Test Post',
      slug: 'test-post',
      status: 'draft' as const
    }

    render(<BlogEditor {...defaultProps} post={post} />)
    
    expect(screen.getByDisplayValue('# Test Content')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test Post')).toBeInTheDocument()
  })

  it('calls onSubmitAction when publishing', async () => {
    render(<BlogEditor {...defaultProps} />)
    
    const content = '# New Content'
    const title = 'New Post'

    fireEvent.change(screen.getByPlaceholder('在此输入 Markdown 内容...'), {
      target: { value: content }
    })
    fireEvent.change(screen.getByLabelText('标题'), {
      target: { value: title }
    })

    fireEvent.click(screen.getByText('发布文章'))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        content,
        expect.objectContaining({ title })
      )
    })
  })

  it('calls onSaveDraft when saving draft', async () => {
    render(<BlogEditor {...defaultProps} />)
    
    const content = '# Draft Content'
    fireEvent.change(screen.getByPlaceholder('在此输入 Markdown 内容...'), {
      target: { value: content }
    })

    fireEvent.click(screen.getByText('保存草稿'))

    await waitFor(() => {
      expect(mockOnSaveDraft).toHaveBeenCalledWith(
        content,
        expect.any(Object)
      )
    })
  })
}) 