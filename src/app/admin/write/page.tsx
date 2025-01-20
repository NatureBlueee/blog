'use client'

import Link from 'next/link'
import { HiPlus, HiDocumentText } from 'react-icons/hi'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { DraftList } from '@/components/admin/write/DraftList'

export default function WritePage() {
  return (
    <div className='container mx-auto space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>写作中心</h1>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* 最近草稿 */}
        <Card>
          <CardHeader>
            <CardTitle>最近草稿</CardTitle>
          </CardHeader>
          <CardContent>
            <DraftList limit={5} />
          </CardContent>
        </Card>

        {/* 快速操作 */}
        <Card>
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <Button asChild className='w-full'>
              <Link href='/admin/write/new'>
                <HiPlus className='mr-2' /> 新建文章
              </Link>
            </Button>
            <Button asChild variant='outline' className='w-full'>
              <Link href='/admin/write/drafts'>
                <HiDocumentText className='mr-2' /> 查看所有草稿
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
