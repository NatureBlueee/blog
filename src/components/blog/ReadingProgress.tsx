'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      // 获取文档高度
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      // 获取当前滚动位置
      const currentScroll = window.scrollY
      // 计算进度百分比
      const progressPercent = (currentScroll / totalHeight) * 100
      setProgress(progressPercent)
    }

    // 添加滚动事件监听
    window.addEventListener('scroll', updateProgress)
    // 初始化进度
    updateProgress()

    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <motion.div
      className='fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 z-50'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className='h-full bg-primary'
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </motion.div>
  )
}
