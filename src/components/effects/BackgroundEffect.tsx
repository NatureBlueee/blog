'use client'

import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'

export default function BackgroundEffect() {
  const { theme } = useTheme()
  
  return (
    <motion.div
      className="fixed inset-0 -z-10 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      transition={{ duration: 1 }}
    >
      <div 
        className={`absolute inset-0 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
            : 'bg-gradient-to-br from-gray-50 to-white'
        }`}
      />
      {/* 添加轻微的纹理效果 */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,...)"`,
          backgroundSize: '50px 50px'
        }}
      />
    </motion.div>
  )
} 