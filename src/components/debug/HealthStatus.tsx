interface Props {
  health?: HealthCheck[]
}

export function HealthStatus({ health }: Props) {
  if (!health || !Array.isArray(health)) return null

  return (
    <div className='space-y-2'>
      <h3 className='text-sm font-medium'>健康检查</h3>
      <div className='space-y-1'>
        {health.map((check) => (
          <div key={check.name} className='flex items-center justify-between text-sm'>
            <span>{check.name}</span>
            <span className={check.status === 'healthy' ? 'text-green-500' : 'text-red-500'}>
              {check.status === 'healthy' ? '正常' : '异常'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
