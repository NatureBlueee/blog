export interface PerformanceMetric {
  name: string
  value: number
  unit: string
}

export interface PerformanceData {
  metrics: PerformanceMetric[]
  timestamp: number
} 