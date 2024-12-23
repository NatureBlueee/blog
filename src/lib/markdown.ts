export const markdown = {
  bold: (text: string) => `**${text}**`,
  italic: (text: string) => `*${text}*`,
  code: (text: string) => `\`${text}\``,
  codeblock: (text: string, lang = '') => `\`\`\`${lang}\n${text}\n\`\`\``,
  link: (text: string, url: string) => `[${text}](${url})`,
  bullet: (text: string) => `- ${text}`,
  number: (text: string) => `1. ${text}`,
  quote: (text: string) => `> ${text}`,
  heading1: (text: string) => `# ${text}`,
  heading2: (text: string) => `## ${text}`,
  heading3: (text: string) => `### ${text}`,
  image: (alt: string, url: string) => `![${alt}](${url})`,
  table: (headers: string[], align?: ('left' | 'center' | 'right')[]) => {
    const alignRow = headers.map((_, i) => {
      switch (align?.[i]) {
        case 'center': return ':---:'
        case 'right': return '---:'
        default: return ':---'
      }
    })
    return `| ${headers.join(' | ')} |\n| ${alignRow.join(' | ')} |`
  }
}

export function insertMarkdown(
  content: string,
  action: MarkdownAction
): string {
  const { type, range, value } = action
  const before = content.slice(0, range.start)
  const after = content.slice(range.end)
  const text = range.text

  switch (type) {
    case 'bold': return before + markdown.bold(text) + after
    case 'italic': return before + markdown.italic(text) + after
    case 'code': return before + markdown.code(text) + after
    case 'codeblock': return before + markdown.codeblock(text) + after
    case 'link': return before + markdown.link(text, value || '') + after
    case 'bullet': return before + markdown.bullet(text) + after
    case 'number': return before + markdown.number(text) + after
    case 'quote': return before + markdown.quote(text) + after
    case 'heading1': return before + markdown.heading1(text) + after
    case 'heading2': return before + markdown.heading2(text) + after
    case 'heading3': return before + markdown.heading3(text) + after
    case 'image': return before + markdown.image(text, value || '') + after
    case 'table': return before + markdown.table(text.split('|')) + after
    default: return content
  }
} 