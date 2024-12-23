import { IconType } from 'react-icons'

interface StatsCardProps {
  icon: IconType
  title: string
  value: number
  change?: number
}

export default function StatsCard({ icon: Icon, title, value, change }: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-3 bg-primary/10 text-primary rounded-lg">
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="ml-4 text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        </div>
        {change !== undefined && (
          <span className={`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-semibold">{value.toLocaleString()}</p>
    </div>
  )
} 