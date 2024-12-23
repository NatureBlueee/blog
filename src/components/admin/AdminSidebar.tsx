'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconType } from 'react-icons'
import { 
  HiHome,
  HiDocumentText,
  HiPhotograph,
  HiUsers,
  HiCog
} from 'react-icons/hi'

const navItems = [
  { href: '/admin', label: '仪表盘', icon: HiHome },
  { href: '/admin/posts', label: '文章', icon: HiDocumentText },
  { href: '/admin/media', label: '媒体', icon: HiPhotograph },
  { href: '/admin/users', label: '用户', icon: HiUsers },
  { href: '/admin/settings', label: '设置', icon: HiCog }
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const IconComponent = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary text-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <IconComponent className="w-5 h-5" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
} 