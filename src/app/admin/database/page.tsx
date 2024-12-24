import { useState } from 'react'
import { useQuery } from 'react-query'
import { databaseService } from '@/lib/services/database'
import { DatabaseStatus } from '@/types'
import TableCard from '@/components/TableCard'
import RelationshipGraph from '@/components/RelationshipGraph'
import HealthChecks from '@/components/HealthChecks'

export default function DatabaseManagementPage() {
  const [status, setStatus] = useState<DatabaseStatus>()

  // 获取数据库状态
  const { data, isLoading } = useQuery({
    queryKey: ['database-status'],
    queryFn: () => databaseService.getStatus(),
  })

  return (
    <div className='container mx-auto p-6 space-y-6'>
      <h1 className='text-2xl font-bold'>数据库管理</h1>

      {/* 数据库状态概览 */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {status?.tables.map((table) => <TableCard key={table.name} {...table} />)}
      </div>

      {/* 关系图 */}
      <div className='border rounded-lg p-4'>
        <h2 className='text-lg font-semibold mb-4'>表关系</h2>
        <RelationshipGraph data={status?.relationships} />
      </div>

      {/* 健康检查 */}
      <div className='border rounded-lg p-4'>
        <h2 className='text-lg font-semibold mb-4'>健康状态</h2>
        <HealthChecks data={status?.health} />
      </div>
    </div>
  )
}
