'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconType } from 'react-icons'
import { HiHome, HiDocumentText, HiPhotograph, HiUsers, HiCog, HiPencilAlt } from 'react-icons/hi'

const navItems = [
  { href: '/admin', label: '仪表盘', icon: HiHome },
  {
    href: '/admin/write',
    label: '写作',
    icon: HiPencilAlt,
    subItems: [
      { href: '/admin/write/new', label: '新建文章' },
      { href: '/admin/write/drafts', label: '草稿箱' },
    ],
  },
  {
    href: '/admin/posts',
    label: '文章管理',
    icon: HiDocumentText,
    subItems: [
      { href: '/admin/posts/published', label: '已发布' },
      { href: '/admin/posts/all', label: '全部文章' },
    ],
  },
  { href: '/admin/media', label: '媒体库', icon: HiPhotograph },
  { href: '/admin/settings', label: '设置', icon: HiCog },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className='w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700'>
      <nav className='p-4 space-y-2'>
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
              <IconComponent className='w-5 h-5' aria-hidden='true' />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
