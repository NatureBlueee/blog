export interface TestResult {
  posts?: number
  content?: boolean
  responseTime?: number
  firstPost?: {
    title: string
    slug: string
    tags: any[]
  }
  markdownTest?: boolean
  performance?: {
    apiResponseTime: number
    renderTime: number
    totalTime: number
    markdownParseTime: number
  }
}
