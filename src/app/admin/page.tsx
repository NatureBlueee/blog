'use client'

import { useState, useEffect } from 'react'
import { HiDocumentText, HiPhotograph, HiUsers, HiEye } from 'react-icons/hi'
import PageLayout from '@/components/layout/PageLayout'
import StatsCard from '@/components/admin/StatsCard'
import RecentPosts from '@/components/admin/RecentPosts'
import PopularPosts from '@/components/admin/PopularPosts'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    posts: 0,
    media: 0,
    views: 0,
    comments: 0
  })

  // ... 获取统计数据
  
  return (
    <PageLayout>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard icon={HiDocumentText} title="文章" value={stats.posts} />
          <StatsCard icon={HiPhotograph} title="媒体" value={stats.media} />
          <StatsCard icon={HiEye} title="浏览" value={stats.views} />
          <StatsCard icon={HiUsers} title="评论" value={stats.comments} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentPosts />
          <PopularPosts />
        </div>
      </div>
    </PageLayout>
  )
} 