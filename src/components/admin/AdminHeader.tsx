'use client'

import Link from 'next/link'
import { HiMenu } from 'react-icons/hi'

interface AdminHeaderProps {
  onToggleSidebar?: () => void
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <HiMenu className="w-6 h-6" />
          </button>
          <Link href="/admin" className="text-xl font-bold">
            管理后台
          </Link>
        </div>
      </div>
    </header>
  )
} 