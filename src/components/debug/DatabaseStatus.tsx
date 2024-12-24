'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { databaseService } from '@/lib/services/database'
import { ConnectionStatus } from './ConnectionStatus'
import { TableStats } from './TableStats'
import { HealthStatus } from './HealthStatus'
import { DashboardStats } from './DashboardStats'

export function DatabaseStatus() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  // 移除自动刷新，只在组件挂载和手动刷新时获取数据
  const {
    data: status,
    isLoading,
    refetch: refetchStatus,
  } = useQuery({
    queryKey: ['database-status'],
    queryFn: () => databaseService.getStatus(),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: false, // 禁用自动刷新
    staleTime: Infinity, // 数据永不过期
    cacheTime: 1000 * 60 * 30, // 缓存30分钟
    retry: 1,
  })

  const { data: dashboardStats, refetch: refetchDashboard } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => databaseService.getDashboardStats(),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: false,
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 30,
    retry: 1,
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await Promise.all([refetchStatus(), refetchDashboard()])
    } catch (error) {
      console.error('刷新数据失败:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  if (isLoading) return <div>加载中...</div>

  return (
    <div className='p-4 border rounded-lg bg-card'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-lg font-bold'>数据库状态</h2>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className='px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50'
        >
          {isRefreshing ? '刷新中...' : '刷新'}
        </button>
      </div>
      <div className='space-y-4'>
        <ConnectionStatus status={status?.connection} />
        <TableStats stats={status?.tables} />
        <HealthStatus health={status?.health} />
        {dashboardStats && <DashboardStats stats={dashboardStats} />}
      </div>
    </div>
  )
}
