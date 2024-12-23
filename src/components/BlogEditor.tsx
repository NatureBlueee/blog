'use client'

import { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Button } from '@/components/ui/button'
import type { BlogPost } from '@/types'

interface BlogEditorProps {
  initialContent: string
  onSubmitAction: (content: string) => Promise<void>
  isEditing?: boolean
  post?: BlogPost
}

export function BlogEditor({ initialContent, onSubmitAction, isEditing, post }: BlogEditorProps) {
  const [content, setContent] = useState(() => {
    // 如果内容包含 frontmatter，提取实际内容
    if (initialContent.includes('---')) {
      const parts = initialContent.split('---')
      return parts.length >= 3 ? parts[2].trim() : initialContent
    }
    return initialContent
  })

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ['link', 'image', 'video'],
      ['clean'],
      ['code-block'],
    ],
  }

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'script',
    'indent',
    'direction',
    'color',
    'background',
    'font',
    'align',
    'link',
    'image',
    'video',
    'code-block',
  ]

  const handleSave = async () => {
    try {
      // 如果是编辑模式，保留原有的 frontmatter
      let finalContent = content
      if (isEditing && post) {
        const frontmatter = `---
title: ${post.title}
excerpt: ${post.excerpt || ''}
tags: ${post.tags ? `\n${post.tags.map((tag) => `- ${tag}`).join('\n')}` : ''}
status: ${post.status}
createdAt: '${post.created_at}'
updatedAt: '${new Date().toISOString()}'
---
`
        finalContent = `${frontmatter}\n${content}`
      }

      await onSubmitAction(finalContent)
    } catch (error) {
      console.error('保存失败:', error)
    }
  }

  return (
    <div className='space-y-4'>
      <div className='min-h-[500px]'>
        <ReactQuill
          theme='snow'
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
          className='h-[450px] mb-12'
        />
      </div>
      <div className='flex justify-end'>
        <Button onClick={handleSave} className='px-6'>
          保存
        </Button>
      </div>
    </div>
  )
}
