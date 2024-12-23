'use client'

import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { format } from 'date-fns'

interface ViewData {
  date: string
  views: number
}

interface PostAnalytics {
  totalViews: number
  avgTimeOnPage: number
  bounceRate: number
  viewsOverTime: ViewData[]
}

interface PostAnalyticsProps {
  slug: string
}

export default function PostAnalytics({ slug }: PostAnalyticsProps) {
  const [data, setData] = useState<PostAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [slug])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/posts/${slug}/analytics`)
      if (!response.ok) throw new Error('获取统计数据失败')
      const data = await response.json()
      setData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div>加载统计数据...</div>
  if (error) return <div className="text-red-500">{error}</div>
  if (!data) return null

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="text-sm text-gray-500">总浏览量</div>
          <div className="text-2xl font-bold mt-1">{data.totalViews}</div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="text-sm text-gray-500">平均停留时间</div>
          <div className="text-2xl font-bold mt-1">
            {Math.round(data.avgTimeOnPage)}秒
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="text-sm text-gray-500">跳出率</div>
          <div className="text-2xl font-bold mt-1">
            {(data.bounceRate * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-medium mb-4">浏览趋势</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.viewsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(new Date(date), 'MM-dd')}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(date) => format(new Date(date), 'yyyy-MM-dd')}
              />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
} 