import prettier from 'prettier/standalone'
import markdownParser from 'prettier/parser-markdown'

export async function formatMarkdown(content: string): Promise<string> {
  try {
    const formatted = await prettier.format(content, {
      parser: 'markdown',
      plugins: [markdownParser],
      proseWrap: 'always',
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      semi: false,
      singleQuote: true
    })
    
    return formatted
  } catch (error) {
    console.error('格式化失败:', error)
    return content
  }
} 