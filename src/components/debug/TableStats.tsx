'use client'

interface TableStatsProps {
  stats?: Array<{
    name: string
    count: number
    status: 'ok' | 'error'
    error?: string
  }>
}

export function TableStats({ stats }: TableStatsProps) {
  if (!stats?.length) return null

  return (
    <div className='space-y-2'>
      <h3 className='font-medium'>数据表统计</h3>
      <div className='grid grid-cols-2 gap-2'>
        {stats.map((table) => (
          <div key={table.name} className='flex justify-between items-center p-2 bg-muted rounded'>
            <span>{table.name}</span>
            <span className='font-medium'>{table.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
