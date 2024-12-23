'use client'

import { motion } from 'framer-motion'
import { HiSearch } from 'react-icons/hi'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function BlogHero() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/blog/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <section className='relative py-20 bg-gradient-to-r from-primary/5 via-background to-secondary/5'>
      <div className='container'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='max-w-2xl mx-auto text-center space-y-8'
        >
          <h1 className='text-4xl font-bold tracking-tight'>探索思维的边界</h1>
          <p className='text-xl text-muted-foreground'>
            在这里，我们一起探讨技术、哲学与生活的交织
          </p>

          <form onSubmit={handleSearch} className='relative max-w-xl mx-auto'>
            <HiSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5' />
            <input
              type='search'
              placeholder='搜索文章...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-12 pr-4 py-3 rounded-full border bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/20'
            />
          </form>
        </motion.div>
      </div>
    </section>
  )
}
