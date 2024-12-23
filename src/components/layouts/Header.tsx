import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

export function Header() {
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center'>
        <Link href='/' className='flex items-center space-x-2'>
          <span className='text-xl font-bold'>Jenni's Blog</span>
        </Link>
        <nav className='ml-auto flex items-center space-x-4'>
          <Link href='/blog' className='text-foreground/60 hover:text-foreground'>
            博客
          </Link>
          <Link href='/about' className='text-foreground/60 hover:text-foreground'>
            关于
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
