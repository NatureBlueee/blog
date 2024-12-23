import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { StackEditIntegration } from '../StackEditIntegration'

describe('StackEditIntegration', () => {
  const mockOnChange = vi.fn()
  const mockOnSave = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with provided content', () => {
    render(
      <StackEditIntegration
        content="Test Content"
        onChange={mockOnChange}
        onSave={mockOnSave}
      />
    )

    expect(screen.getByRole('textbox')).toHaveValue('Test Content')
  })

  it('opens StackEdit editor when button is clicked', async () => {
    render(
      <StackEditIntegration
        content="Test Content"
        onChange={mockOnChange}
        onSave={mockOnSave}
      />
    )

    fireEvent.click(screen.getByText('打开编辑器'))
    
    // 验证 StackEdit 是否被初始化
    await waitFor(() => {
      expect(document.querySelector('.stackedit-iframe')).toBeInTheDocument()
    })
  })
}) 