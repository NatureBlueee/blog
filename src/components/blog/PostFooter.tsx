'use client'

import { useState } from 'react'
import { HiHeart, HiShare } from 'react-icons/hi'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import type { Post } from '@/types'

interface PostFooterProps {
  post: Post
}

export function PostFooter({ post }: PostFooterProps) {
  const [likes, setLikes] = useState(post.likes || 0)
  const [hasLiked, setHasLiked] = useState(false)

  const handleLike = async () => {
    if (hasLiked) return

    try {
      const response = await fetch(`/api/posts/${post.slug}/like`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('点赞失败')

      setLikes((prev) => prev + 1)
      setHasLiked(true)

      toast({
        description: '感谢你的喜欢！',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        description: '点赞失败，请稍后重试',
      })
    }
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      })
    } catch (error) {
      // 如果浏览器不支持 share API，则复制链接
      navigator.clipboard.writeText(window.location.href)
      toast({
        description: '链接已复制到剪贴板',
      })
    }
  }

  return (
    <footer className='mt-8 pt-8 border-t'>
      <div className='flex justify-center gap-4'>
        <Button
          variant='outline'
          size='lg'
          className={hasLiked ? 'text-primary' : ''}
          onClick={handleLike}
        >
          <HiHeart className='w-5 h-5 mr-2' />
          {likes} 喜欢
        </Button>

        <Button variant='outline' size='lg' onClick={handleShare}>
          <HiShare className='w-5 h-5 mr-2' />
          分享
        </Button>
      </div>
    </footer>
  )
}
