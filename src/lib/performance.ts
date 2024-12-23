type PerformanceMetric = {
  name: string
  value: number
  unit: string
}

export function measurePageLoad(): PerformanceMetric[] {
  if (typeof window === 'undefined') return []

  const metrics: PerformanceMetric[] = []
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

  // 首屏加载时间
  metrics.push({
    name: 'First Contentful Paint',
    value: performance.getEntriesByType('paint')[0]?.startTime || 0,
    unit: 'ms',
  })

  // DOM 加载时间
  metrics.push({
    name: 'DOM Load',
    value: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    unit: 'ms',
  })

  // 总加载时间
  metrics.push({
    name: 'Total Load',
    value: navigation.loadEventEnd - navigation.loadEventStart,
    unit: 'ms',
  })

  return metrics
}

export function measureFrameRate(): Promise<number> {
  return new Promise((resolve) => {
    let frames = 0
    let lastTime = performance.now()

    function countFrames(currentTime: number) {
      frames++
      if (currentTime - lastTime >= 1000) {
        resolve(frames)
      } else {
        requestAnimationFrame(countFrames)
      }
    }

    requestAnimationFrame(countFrames)
  })
}

export function measurePageTransition(callback: (duration: number) => void) {
  const startTime = performance.now()

  return () => {
    const endTime = performance.now()
    const duration = endTime - startTime
    callback(duration)
  }
}

// 性能监控组件的 Props 类型
export interface PerformanceMonitorProps {
  onMetricsUpdate?: (metrics: PerformanceMetric[]) => void
  onFrameRateUpdate?: (fps: number) => void
  onTransitionComplete?: (duration: number) => void
} 