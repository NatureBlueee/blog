'use client'

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { databaseService } from '@/lib/services/database'
import { ConnectionStatus } from './ConnectionStatus'
import { TableStats } from './TableStats'
import { HealthStatus } from './HealthStatus'
import { DashboardStats } from './DashboardStats'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

export function DatabaseStatus() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const queryClient = useQueryClient()

  // 数据库状态查询
  const {
    data: status,
    isLoading: isStatusLoading,
    refetch: refetchStatus,
  } = useQuery({
    queryKey: ['database-status'],
    queryFn: () => databaseService.getStatus(),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: false,
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 30,
    retry: 1,
  })

  // 仪表盘统计查询
  const {
    data: dashboardStats,
    isLoading: isDashboardLoading,
    refetch: refetchDashboard,
  } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => databaseService.getDashboardStats(),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: false,
    staleTime: Infinity,
    cacheTime: 1000 * 60 * 30,
    retry: 1,
  })

  // 同步刷新所有数据
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await Promise.all([refetchStatus(), refetchDashboard()])

      // 通知其他使用相同查询键的组件更新
      await queryClient.invalidateQueries({ queryKey: ['database-status'] })
      await queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    } catch (error) {
      console.error('刷新数据失败:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  if (isStatusLoading || isDashboardLoading) {
    return <div className='p-4 text-center'>加载中...</div>
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-lg font-semibold'>数据库状态</h2>
        <Button
          size='sm'
          variant='outline'
          onClick={handleRefresh}
          disabled={isRefreshing}
          className='flex items-center gap-2'
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? '刷新中...' : '刷新'}
        </Button>
      </div>

      <div className='grid gap-4'>
        <ConnectionStatus status={status?.connection} />
        <TableStats stats={status?.tables} />
        <HealthStatus health={status?.health} />
        {dashboardStats && <DashboardStats stats={dashboardStats} />}
      </div>
    </div>
  )
}
