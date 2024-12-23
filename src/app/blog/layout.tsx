import PageLayout from '@/components/layout/PageLayout'

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PageLayout>{children}</PageLayout>
} 