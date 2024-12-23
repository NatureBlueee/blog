'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function DatabaseStatus() {
  const [status, setStatus] = useState<{
    connection: boolean
    error?: string
    postsCount?: number
    postsData?: any[]
    stats?: {
      total: number
      published: number
      draft: number
    }
  }>({
    connection: false,
  })

  useEffect(() => {
    async function checkConnection() {
      try {
        // 1. 获取所有文章数量
        const { count: totalCount, error: totalError } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .is('deleted_at', null)

        if (totalError) throw totalError

        // 2. 获取已发布文章数量
        const { count: publishedCount, error: publishedError } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published')
          .is('deleted_at', null)

        if (publishedError) throw publishedError

        // 3. 获取草稿文章数量
        const { count: draftCount, error: draftError } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'draft')
          .is('deleted_at', null)

        if (draftError) throw draftError

        // 4. 获取示例文章数据
        const { data: samplePosts, error: postsError } = await supabase
          .from('posts')
          .select('id, title, slug, status, deleted_at')
          .is('deleted_at', null)
          .limit(5)

        if (postsError) throw postsError

        setStatus({
          connection: true,
          stats: {
            total: totalCount || 0,
            published: publishedCount || 0,
            draft: draftCount || 0,
          },
          postsData: samplePosts,
        })
      } catch (error) {
        console.error('Database connection error:', error)
        setStatus({
          connection: false,
          error: error instanceof Error ? error.message : '连接失败',
        })
      }
    }

    checkConnection()
  }, [])

  return (
    <div className='p-4 border rounded-lg bg-card'>
      <h2 className='text-lg font-bold mb-2'>数据库状态</h2>
      <div className='space-y-2'>
        <p>
          连接状态:{' '}
          <span className={status.connection ? 'text-green-500' : 'text-red-500'}>
            {status.connection ? '已连接' : '未连接'}
          </span>
        </p>

        {status.stats && (
          <div className='space-y-1'>
            <p>总文章数: {status.stats.total}</p>
            <p>已发布: {status.stats.published}</p>
            <p>草稿: {status.stats.draft}</p>
          </div>
        )}

        {status.error && <p className='text-red-500'>错误: {status.error}</p>}

        {status.postsData && status.postsData.length > 0 && (
          <div>
            <p className='font-medium mt-4'>最近文章:</p>
            <div className='mt-2 space-y-2'>
              {status.postsData.map((post) => (
                <div key={post.id} className='text-sm'>
                  <p>标题: {post.title}</p>
                  <p>状态: {post.status}</p>
                  <hr className='my-1' />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
