'use client'

interface ConnectionStatusProps {
  status?: {
    connected: boolean
    error?: string
    url?: string
    hasAnon?: boolean
  }
}

export function ConnectionStatus({ status }: ConnectionStatusProps) {
  if (!status) return null

  return (
    <div className='flex items-center space-x-2'>
      <div className={`w-2 h-2 rounded-full ${status.connected ? 'bg-green-500' : 'bg-red-500'}`} />
      <span className='font-medium'>{status.connected ? '已连接' : '未连接'}</span>
      {status.error && <span className='text-red-500 text-sm'>({status.error})</span>}
    </div>
  )
}
