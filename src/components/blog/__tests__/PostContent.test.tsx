import { render, screen } from '@testing-library/react'
import { PostContent } from '../PostContent'

describe('PostContent', () => {
  const mockContent = `
# Test Heading

This is a paragraph with **bold** text.

\`\`\`typescript
const test = () => {
  console.log('Hello World')
}
\`\`\`
`

  it('renders markdown content correctly', () => {
    render(<PostContent content={mockContent} />)

    // 检查标题
    expect(screen.getByText('Test Heading')).toBeInTheDocument()

    // 检查段落和加粗文本
    const paragraph = screen.getByText(/This is a paragraph with/)
    expect(paragraph).toBeInTheDocument()
    expect(screen.getByText('bold')).toBeInTheDocument()

    // 检查代码块 - 不检查具体类名，只检查内容
    const code = screen.getByText(/const test/)
    expect(code).toBeInTheDocument()
    expect(code.closest('pre')).toBeInTheDocument()
  })

  it('sanitizes dangerous content', () => {
    const dangerousContent = `
<script>alert('xss')</script>
<img src="x" onerror="alert('xss')">
# Safe Content
`
    const { container } = render(<PostContent content={dangerousContent} />)

    // 检查危险内容被移除
    expect(container.querySelector('script')).toBeNull()
    expect(container.querySelector('img[onerror]')).toBeNull()

    // 使用 container.textContent 检查文本内容
    expect(container.textContent).toContain('Safe Content')
  })
})
