import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/layouts/Header'
import { Footer } from '@/components/layouts/Footer'

export function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      <div className='min-h-screen bg-background text-foreground'>
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
