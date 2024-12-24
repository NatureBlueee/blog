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

    // 使用 getByText 而不是 querySelector
    expect(screen.getByText('Test Heading')).toBeInTheDocument()
    expect(screen.getByText(/This is a paragraph with/)).toBeInTheDocument()
    expect(screen.getByText('bold')).toBeInTheDocument()

    // 使用 container.querySelector 查找代码块
    const codeBlock = document.querySelector('pre code')
    expect(codeBlock).toBeInTheDocument()
    expect(codeBlock?.textContent).toContain('const test')
  })

  it('sanitizes dangerous content', () => {
    const dangerousContent = `
<script>alert('xss')</script>
<img src="x" onerror="alert('xss')">
# Safe Content
`
    render(<PostContent content={dangerousContent} />)

    // 使用 getByText 而不是 querySelector
    expect(screen.getByText('Safe Content')).toBeInTheDocument()
    expect(document.querySelector('script')).toBeNull()
  })
})
