export function ErrorComponent({ error }: { error: Error | unknown }) {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
        <h2 className='text-red-800 font-semibold mb-2'>加载失败</h2>
        <p className='text-red-600'>
          错误：{error instanceof Error ? error.message : String(error)}
        </p>
        {process.env.NODE_ENV === 'development' && (
          <pre className='mt-4 p-2 bg-red-100 rounded text-sm overflow-auto'>
            {JSON.stringify(error, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}
