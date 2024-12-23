import { useEffect } from 'react'
import {
  measurePageLoad,
  measureFrameRate,
  measurePageTransition,
  PerformanceMonitorProps,
} from '@/lib/performance'

export default function PerformanceMonitor({
  onMetricsUpdate,
  onFrameRateUpdate,
  onTransitionComplete,
}: PerformanceMonitorProps) {
  useEffect(() => {
    // 测量页面加载性能
    const metrics = measurePageLoad()
    onMetricsUpdate?.(metrics)

    // 测量帧率
    const measureFPS = async () => {
      const fps = await measureFrameRate()
      onFrameRateUpdate?.(fps)
    }
    measureFPS()

    // 测量页面切换时间
    const cleanup = measurePageTransition((duration) => {
      onTransitionComplete?.(duration)
    })

    // 开发环境下在控制台输出性能指标
    if (process.env.NODE_ENV === 'development') {
      console.group('Performance Metrics')
      metrics.forEach((metric) => {
        console.log(`${metric.name}: ${metric.value}${metric.unit}`)
      })
      console.groupEnd()
    }

    return cleanup
  }, [onMetricsUpdate, onFrameRateUpdate, onTransitionComplete])

  // 这是一个监控组件，不需要渲染任何内容
  return null
} 