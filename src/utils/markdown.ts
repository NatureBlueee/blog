interface TextRange {
  start: number
  end: number
  text: string
}

interface MarkdownAction {
  type: string
  before: string
  after: string
  defaultText?: string
  multiline?: boolean
  linePrefix?: string
}

const MARKDOWN_ACTIONS: Record<string, MarkdownAction> = {
  bold: {
    type: 'bold',
    before: '**',
    after: '**',
    defaultText: '粗体文本'
  },
  italic: {
    type: 'italic',
    before: '_',
    after: '_',
    defaultText: '斜体文本'
  },
  code: {
    type: 'code',
    before: '`',
    after: '`',
    defaultText: 'code'
  },
  codeblock: {
    type: 'codeblock',
    before: '```\n',
    after: '\n```',
    defaultText: 'code block'
  },
  link: {
    type: 'link',
    before: '[',
    after: '](url)',
    defaultText: '链接文本'
  },
  bullet: {
    type: 'bullet',
    before: '- ',
    after: '',
    multiline: true,
    linePrefix: '- '
  },
  number: {
    type: 'number',
    before: '1. ',
    after: '',
    multiline: true,
    linePrefix: (index: number) => `${index + 1}. `
  },
  quote: {
    type: 'quote',
    before: '> ',
    after: '',
    multiline: true,
    linePrefix: '> '
  }
}

export function applyMarkdown(
  text: string,
  selection: TextRange,
  action: string
): { text: string; selection: TextRange } {
  const markdownAction = MARKDOWN_ACTIONS[action]
  if (!markdownAction) return { text, selection }

  const { before, after, defaultText, multiline, linePrefix } = markdownAction
  const selectedText = selection.text || defaultText || ''

  if (multiline && linePrefix) {
    const lines = selectedText.split('\n')
    const prefixedLines = typeof linePrefix === 'function'
      ? lines.map((line, index) => linePrefix(index) + line)
      : lines.map(line => linePrefix + line)
    
    const newText = prefixedLines.join('\n')
    const newContent = 
      text.substring(0, selection.start) +
      newText +
      text.substring(selection.end)

    return {
      text: newContent,
      selection: {
        start: selection.start,
        end: selection.start + newText.length,
        text: newText
      }
    }
  }

  const newText = before + selectedText + after
  const newContent = 
    text.substring(0, selection.start) +
    newText +
    text.substring(selection.end)

  return {
    text: newContent,
    selection: {
      start: selection.start + before.length,
      end: selection.start + before.length + selectedText.length,
      text: selectedText
    }
  }
}

export function getSelection(element: HTMLTextAreaElement): TextRange {
  return {
    start: element.selectionStart,
    end: element.selectionEnd,
    text: element.value.substring(element.selectionStart, element.selectionEnd)
  }
}

export function setSelection(
  element: HTMLTextAreaElement,
  range: TextRange
): void {
  element.setSelectionRange(range.start, range.end)
  element.focus()
} 