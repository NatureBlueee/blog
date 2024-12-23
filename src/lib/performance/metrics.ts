import { type PerformanceMetric } from '@/types/performance'

export function captureWebVitals(): PerformanceMetric[] {
  const metrics: PerformanceMetric[] = []

  // Core Web Vitals
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'largest-contentful-paint') {
        metrics.push({
          name: 'LCP',
          value: entry.startTime,
          unit: 'ms'
        })
      }
      if (entry.entryType === 'first-input') {
        metrics.push({
          name: 'FID',
          value: entry.processingStart - entry.startTime,
          unit: 'ms'
        })
      }
      if (entry.entryType === 'layout-shift') {
        metrics.push({
          name: 'CLS',
          value: entry.value,
          unit: 'score'
        })
      }
    })
  })

  observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })

  return metrics
} 