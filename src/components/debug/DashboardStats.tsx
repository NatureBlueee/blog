interface DashboardStatsProps {
  stats: {
    posts: {
      total: number
      published: number
      draft: number
    }
    lastUpdated: string
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className='space-y-2'>
      <h3 className='font-medium'>仪表盘统计</h3>
      <div className='grid grid-cols-3 gap-2'>
        <div className='p-2 bg-muted rounded'>
          <div className='text-sm text-muted-foreground'>总文章</div>
          <div className='text-lg font-medium'>{stats.posts.total}</div>
        </div>
        <div className='p-2 bg-muted rounded'>
          <div className='text-sm text-muted-foreground'>已发布</div>
          <div className='text-lg font-medium'>{stats.posts.published}</div>
        </div>
        <div className='p-2 bg-muted rounded'>
          <div className='text-sm text-muted-foreground'>草稿</div>
          <div className='text-lg font-medium'>{stats.posts.draft}</div>
        </div>
      </div>
      <div className='text-sm text-muted-foreground'>
        最后更新: {new Date(stats.lastUpdated).toLocaleString()}
      </div>
    </div>
  )
}
