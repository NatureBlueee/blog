'use client'

import { useRouter } from 'next/navigation'
import { BlogEditor } from '@/components/blog/BlogEditor'
import matter from 'gray-matter'

const DEFAULT_CONTENT = `---
title: "New Post"
excerpt: "A brief description of your post"
date: "${new Date().toISOString().split('T')[0]}"
author:
  name: "Your Name"
  avatar: "/images/avatar.jpg"
  bio: "Your bio"
category: "Uncategorized"
tags: []
---

# New Post

Start writing your post here...
`

export default function NewPostPage() {
  const router = useRouter()

  const handleSave = async (content: string) => {
    try {
      const { data } = matter(content)
      const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
          content,
          title: data.title,
          excerpt: data.excerpt,
          category: data.category,
          tags: data.tags,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create post')
      }

      router.push('/admin')
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">New Post</h1>
      <BlogEditor 
        initialContent={DEFAULT_CONTENT} 
        onSubmitAction={handleSave}
      />
    </div>
  )
} 