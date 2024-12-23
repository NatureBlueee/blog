'use client'

import { useState, useEffect } from 'react'
import { HiCheckCircle, HiExclamationCircle } from 'react-icons/hi'

interface SEOAnalyzerProps {
  title: string
  content: string
  excerpt: string
  tags: string[]
}

interface SEOScore {
  score: number
  checks: {
    name: string
    passed: boolean
    message: string
  }[]
}

export default function SEOAnalyzer({ 
  title, 
  content, 
  excerpt,
  tags 
}: SEOAnalyzerProps) {
  const [score, setScore] = useState<SEOScore | null>(null)

  useEffect(() => {
    analyzeSEO()
  }, [title, content, excerpt, tags])

  const analyzeSEO = () => {
    const checks = [
      {
        name: '标题长度',
        passed: title.length >= 10 && title.length <= 60,
        message: '标题应在 10-60 个字符之间'
      },
      {
        name: '摘要长度',
        passed: excerpt.length >= 120 && excerpt.length <= 160,
        message: '摘要应在 120-160 个字符之间'
      },
      {
        name: '关键词密度',
        passed: checkKeywordDensity(),
        message: '关键词密度应在 1-3% 之间'
      },
      {
        name: '标签数量',
        passed: tags.length >= 3 && tags.length <= 8,
        message: '建议使用 3-8 个标签'
      },
      {
        name: '内容长度',
        passed: content.length >= 300,
        message: '内容长度应至少 300 个字符'
      },
      {
        name: '标题结构',
        passed: checkHeadingStructure(),
        message: '文章应有清晰的标题层级结构'
      }
    ]

    const passedChecks = checks.filter(check => check.passed).length
    const score = Math.round((passedChecks / checks.length) * 100)

    setScore({ score, checks })
  }

  const checkKeywordDensity = () => {
    const words = content.toLowerCase().split(/\s+/)
    const keywordCount = tags.reduce((acc, tag) => {
      const tagWords = tag.toLowerCase().split(/\s+/)
      return acc + words.filter(word => tagWords.includes(word)).length
    }, 0)
    const density = (keywordCount / words.length) * 100
    return density >= 1 && density <= 3
  }

  const checkHeadingStructure = () => {
    const headings = content.match(/^#{1,6}\s.+$/gm) || []
    if (headings.length === 0) return false

    const levels = headings.map(h => h.match(/^(#{1,6})/)?.[0].length || 0)
    return levels.every((level, i) => 
      i === 0 || level <= levels[i - 1] + 1
    )
  }

  if (!score) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">SEO 分析</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">总分：</span>
          <span className={`text-lg font-bold ${
            score.score >= 80 
              ? 'text-green-500' 
              : score.score >= 60 
                ? 'text-yellow-500' 
                : 'text-red-500'
          }`}>
            {score.score}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {score.checks.map((check, index) => (
          <div 
            key={index}
            className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            {check.passed ? (
              <HiCheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            ) : (
              <HiExclamationCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
            )}
            <div>
              <div className="font-medium">{check.name}</div>
              <div className="text-sm text-gray-500">{check.message}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 