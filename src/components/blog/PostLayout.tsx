import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PostLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen'>
      <nav className='sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b'>
        <div className='container mx-auto px-4 h-16 flex items-center'>
          <Link href='/blog'>
            <Button variant='ghost' size='sm' className='gap-2'>
              <ArrowLeft className='w-4 h-4' />
              返回文章列表
            </Button>
          </Link>
        </div>
      </nav>
      <main className='container mx-auto px-4 py-8'>{children}</main>
    </div>
  )
}
