'use client'

interface TableStatsProps {
  stats?: Array<{
    name: string
    count: number
    status: 'ok' | 'error'
    error?: string
    lastUpdated?: string
    growth?: number
  }>
}

export function TableStats({ stats }: TableStatsProps) {
  if (!stats?.length) return null

  // 表格分组和显示名称映射
  const tableGroups = {
    core: {
      title: '核心数据',
      tables: ['posts', 'tags', 'categories'],
      labels: {
        posts: '文章',
        tags: '标签',
        categories: '分类',
      },
    },
    interaction: {
      title: '交互数据',
      tables: ['comments', 'post_views', 'post_likes'],
      labels: {
        comments: '评论',
        post_views: '浏览',
        post_likes: '点赞',
      },
    },
    user: {
      title: '用户数据',
      tables: ['users', 'user_profiles'],
      labels: {
        users: '用户',
        user_profiles: '用户资料',
      },
    },
    version: {
      title: '版本控制',
      tables: ['post_versions'],
      labels: {
        post_versions: '文章版本',
      },
    },
  }

  return (
    <div className='space-y-6'>
      {Object.entries(tableGroups).map(([groupKey, group]) => (
        <div key={groupKey} className='space-y-3'>
          <h4 className='text-sm font-medium text-gray-700'>{group.title}</h4>
          <div className='grid grid-cols-3 gap-4'>
            {group.tables.map((tableName) => {
              const tableData = stats.find((s) => s.name === tableName)
              if (!tableData) return null

              return (
                <div
                  key={tableName}
                  className='p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:border-gray-300 transition-colors'
                >
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-sm font-medium text-gray-600'>
                      {group.labels[tableName]}
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        tableData.status === 'ok' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {tableData.count.toLocaleString()}
                    </span>
                  </div>
                  {tableData.growth !== undefined && (
                    <div className='flex items-center gap-1 text-xs text-gray-500'>
                      <span>24h:</span>
                      <span className={tableData.growth > 0 ? 'text-green-500' : 'text-gray-500'}>
                        {tableData.growth > 0 ? '+' : ''}
                        {tableData.growth}%
                      </span>
                    </div>
                  )}
                  {tableData.lastUpdated && (
                    <div className='text-xs text-gray-400 mt-1'>
                      {new Date(tableData.lastUpdated).toLocaleString()}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
