'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatDate } from '@/utils/date'
import { postService } from '@/lib/services/post'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Post } from '@/types'

export function DraftList({ limit = 5 }) {
  const [drafts, setDrafts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDrafts()
  }, [])

  const fetchDrafts = async () => {
    try {
      setIsLoading(true)
      const data = await postService.getPosts({
        status: 'draft',
        limit,
        orderBy: {
          column: 'updated_at',
          order: 'desc',
        },
      })
      setDrafts(data)
    } catch (error) {
      console.error('获取草稿失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className='space-y-4'>
        {[...Array(limit)].map((_, i) => (
          <Skeleton key={i} className='h-20' />
        ))}
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {drafts.map((draft) => (
        <Link key={draft.id} href={`/admin/write/${draft.slug}`} className='block'>
          <Card className='hover:bg-accent transition-colors'>
            <CardContent className='p-4'>
              <h3 className='font-medium mb-1'>{draft.title}</h3>
              <p className='text-sm text-muted-foreground'>
                最后编辑: {formatDate(draft.updated_at)}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
