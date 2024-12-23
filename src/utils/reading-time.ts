const WORDS_PER_MINUTE = 275 // 平均阅读速度
const CHINESE_CHARS_PER_MINUTE = 500 // 中文阅读速度

/**
 * 计算文章阅读时间
 * @param content 文章内容
 * @returns 阅读时间（分钟）
 */
export function readingTime(content: string): string {
  // 移除代码块和 Markdown 语法
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/`.*?`/g, '')          // 移除内联代码
    .replace(/\[.*?\]\(.*?\)/g, '') // 移除链接
    .replace(/[#*_~`]/g, '')        // 移除 Markdown 语法

  // 分别计算中英文字数
  const chineseChars = (cleanContent.match(/[\u4e00-\u9fa5]/g) || []).length
  const englishWords = cleanContent
    .replace(/[\u4e00-\u9fa5]/g, '') // 移除中文字符
    .trim()
    .split(/\s+/)
    .length

  // 计算总阅读时间（分钟）
  const timeForChinese = chineseChars / CHINESE_CHARS_PER_MINUTE
  const timeForEnglish = englishWords / WORDS_PER_MINUTE
  const totalMinutes = Math.ceil(timeForChinese + timeForEnglish)

  return totalMinutes < 1 ? '1 分钟' : `${totalMinutes} 分钟`
} 