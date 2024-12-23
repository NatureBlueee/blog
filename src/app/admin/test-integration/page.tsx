'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { QuillIntegration } from '@/components/editor/QuillIntegration'

export default function TestIntegrationPage() {
  const [content, setContent] = useState('')
  const [lastSaved, setLastSaved] = useState<string>()
  const [testResult, setTestResult] = useState<{
    success: boolean
    error?: string
  }>()

  const testQuill = () => {
    try {
      setTestResult({ success: true })
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : '测试失败',
      })
    }
  }

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    setLastSaved(new Date().toISOString())
  }

  return (
    <div className='container mx-auto py-8 px-4'>
      <h1 className='text-2xl font-bold mb-6'>Quill 编辑器测试</h1>

      <div className='space-y-6'>
        <Button onClick={testQuill}>测试编辑器</Button>

        {testResult && (
          <Alert variant={testResult.success ? 'default' : 'destructive'} className='mb-4'>
            <h3 className='font-bold'>测试结果</h3>
            <p>{testResult.success ? '成功' : `失败: ${testResult.error}`}</p>
          </Alert>
        )}

        <div className='border rounded-lg p-4'>
          <QuillIntegration
            content={content}
            onChange={handleContentChange}
            className='min-h-[400px]'
          />
          {lastSaved && (
            <p className='text-sm text-gray-500 mt-2'>
              最后保存时间: {new Date(lastSaved).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
