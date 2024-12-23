export interface BlogEditorProps {
  initialContent?: string
  post?: Post
  isEditing?: boolean
  onSubmitAction: (content: string, metadata?: PostFormData) => Promise<void>
}

export interface Post {
  slug: string
  title: string
  content: string
  excerpt?: string
  date?: string
  author?: {
    name: string
    avatar?: string
    bio?: string
  }
  category?: string
  tags?: string[]
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
}

export interface PostFormData {
  title: string
  excerpt?: string
  category?: string
  tags?: string[]
  status: 'draft' | 'published'
}
