import DOMPurify from 'isomorphic-dompurify'

interface PostPreviewProps {
  content: string
}

export function PostPreview({ content }: PostPreviewProps) {
  const sanitizedContent = DOMPurify.sanitize(content)

  return (
    <div className='prose dark:prose-invert max-w-none'>
      <div className='preview-content' dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
    </div>
  )
}
