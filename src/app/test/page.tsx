'use client'

import { useState } from 'react'

export default function TestPage() {
  const [status, setStatus] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleInitDb = async () => {
    try {
      setStatus('正在初始化数据库...')
      const response = await fetch('/api/init-db', { method: 'POST' })
      const data = await response.json()

      if (!response.ok) throw new Error(data.error || '初始化失败')

      setStatus('数据库初始化成功！')
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : '初始化失败')
      setStatus('')
    }
  }

  const handleCreateTestData = async () => {
    try {
      setStatus('正在创建测试数据...')
      const response = await fetch('/api/test-data', { method: 'POST' })
      const data = await response.json()

      if (!response.ok) throw new Error(data.error || '创建测试数据失败')

      setStatus('测试数据创建成功！')
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建测试数据失败')
      setStatus('')
    }
  }

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-4'>数据库测试页面</h1>

      <div className='space-y-4'>
        <button
          onClick={handleInitDb}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4'
        >
          初始化数据库
        </button>

        <button
          onClick={handleCreateTestData}
          className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
        >
          创建测试数据
        </button>

        {status && <div className='mt-4 p-4 bg-green-100 text-green-700 rounded'>{status}</div>}

        {error && <div className='mt-4 p-4 bg-red-100 text-red-700 rounded'>{error}</div>}
      </div>
    </div>
  )
}
