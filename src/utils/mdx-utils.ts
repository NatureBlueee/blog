import { TableOfContentsItem } from '@/types'

export function extractHeadings(content: string): TableOfContentsItem[] {
  const headingLines = content
    .split('\n')
    .filter(line => line.match(/^#{1,3} /))

  const headings: TableOfContentsItem[] = headingLines.map(line => {
    const level = line.match(/^#+/)?.[0].length || 1
    const title = line.replace(/^#+\s+/, '')
    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    return {
      id,
      title,
      level,
    }
  })

  return headings
} 