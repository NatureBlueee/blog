interface TestResultsProps {
  results: TestResult
}

export function TestResults({ results }: TestResultsProps) {
  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-2 gap-4'>
        <div className='p-3 border rounded'>
          <h3 className='font-medium'>文章统计</h3>
          <p>总数: {results.posts || 0}</p>
          <p>首篇: {results.firstPost?.title}</p>
        </div>

        <div className='p-3 border rounded'>
          <h3 className='font-medium'>性能指标</h3>
          <p>API响应: {results.performance?.apiResponseTime}ms</p>
          <p>渲染时间: {results.performance?.renderTime}ms</p>
          <p>总耗时: {results.performance?.totalTime}ms</p>
        </div>
      </div>

      <div className='p-3 border rounded'>
        <h3 className='font-medium'>测试项</h3>
        <ul className='list-disc list-inside'>
          <li>文章内容: {results.content ? '✅' : '❌'}</li>
          <li>Markdown渲染: {results.markdownTest ? '✅' : '❌'}</li>
        </ul>
      </div>
    </div>
  )
}
