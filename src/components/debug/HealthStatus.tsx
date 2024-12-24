'use client'

interface HealthStatusProps {
  health?: {
    database?: boolean
    posts?: boolean
    tags?: boolean
    categories?: boolean
    comments?: boolean
    users?: boolean
  }
}

export function HealthStatus({ health }: HealthStatusProps) {
  if (!health) return null

  const getStatusColor = (status?: boolean) => {
    if (status === undefined) return 'bg-gray-200'
    return status ? 'bg-green-500' : 'bg-red-500'
  }

  const getStatusText = (status?: boolean) => {
    if (status === undefined) return '未检查'
    return status ? '正常' : '异常'
  }

  const items = [
    { label: '数据库连接', status: health.database },
    { label: 'posts表访问', status: health.posts },
    { label: 'tags表访问', status: health.tags },
    { label: 'categories表访问', status: health.categories },
    { label: 'comments表访问', status: health.comments },
    { label: 'users表访问', status: health.users },
  ]

  return (
    <div className='space-y-2'>
      <h3 className='text-lg font-semibold'>健康检查</h3>
      <div className='grid gap-2'>
        {items.map(({ label, status }) => (
          <div
            key={label}
            className='flex items-center justify-between p-2 bg-white rounded-lg border'
          >
            <span className='text-sm font-medium'>{label}</span>
            <span
              className={`px-2 py-1 text-xs font-medium text-white rounded ${getStatusColor(status)}`}
            >
              {getStatusText(status)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
