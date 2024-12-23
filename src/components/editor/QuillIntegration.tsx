'use client'

import dynamic from 'next/dynamic'
import { useCallback } from 'react'
import 'react-quill/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className='h-[400px] w-full animate-pulse bg-gray-100' />,
})

interface QuillIntegrationProps {
  content: string
  onChange: (value: string) => void
  className?: string
}

export function QuillIntegration({ content, onChange, className = '' }: QuillIntegrationProps) {
  const handleChange = useCallback(
    (value: string) => {
      onChange(value)
    },
    [onChange]
  )

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  }

  return (
    <ReactQuill
      theme='snow'
      value={content}
      onChange={handleChange}
      modules={modules}
      className={`${className} prose max-w-none`}
    />
  )
}
