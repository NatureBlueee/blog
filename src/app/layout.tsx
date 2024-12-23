import { Providers } from './providers'
import RootLayout from '@/components/layout/RootLayout'
import '@/styles/globals.css'

export const metadata = {
  title: 'My Blog',
  description: '个人博客网站',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/stackedit@latest/dist/css/stackedit.min.css" 
        />
        <script 
          src="https://cdn.jsdelivr.net/npm/stackedit@latest/dist/js/stackedit.min.js"
          defer
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
} 