'use client'

import { useEffect, useState } from 'react'
import { captureWebVitals } from '@/lib/performance/metrics'
import type { PerformanceMetric } from '@/types/performance'

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])

  useEffect(() => {
    const metrics = captureWebVitals()
    setMetrics(metrics)

    // 开发环境下输出性能指标
    if (process.env.NODE_ENV === 'development') {
      console.table(metrics)
    }
  }, [])

  // 仅在开发环境下渲染性能面板
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
      <h3 className="text-sm font-semibold mb-2">Performance Metrics</h3>
      <div className="space-y-1">
        {metrics.map((metric) => (
          <div key={metric.name} className="text-xs">
            <span className="font-medium">{metric.name}:</span>{' '}
            {metric.value.toFixed(2)} {metric.unit}
          </div>
        ))}
      </div>
    </div>
  )
} 