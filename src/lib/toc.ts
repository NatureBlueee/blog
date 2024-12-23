interface TocItem {
  id: string
  title: string
  level: number
}

export function extractToc(content: string): TocItem[] {
  const headingRegex = /^#{1,6}\s+(.+)$/gm
  const items: TocItem[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[0].indexOf(' ')
    const title = match[1]
    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    items.push({
      id,
      title,
      level,
    })
  }

  return items
} 