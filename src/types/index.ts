// 移除与 Next.js 内置类型冲突的定义
import type { Variants } from 'framer-motion'

// 只扩展 Framer Motion 的类型
declare module 'framer-motion' {
  interface CustomMotionProps {
    onHoverStart?: () => void
    onHoverEnd?: () => void
    whileHover?: any
    whileTap?: any
  }
}

// 基础类型
export type Status = 'draft' | 'published' | 'archived'
export type ColorTheme = 'light' | 'dark'

// 通用接口
export interface BaseResponse<T> {
  data: T
  error?: string
  status: number
}

// 博客相关类型
export interface Post {
  id: string
  slug: string
  title: string
  content: string
  excerpt?: string
  status: 'draft' | 'published'
  author_id: string
  featured_image?: string
  seo_title?: string
  seo_description?: string
  view_count: number
  published_at?: string
  created_at: string
  updated_at: string
  deleted_at?: string
  is_archived: boolean
}

export interface PostMetadata {
  title: string
  excerpt: string
  date: string
  author: Author
  category: string
  tags: string[]
  status: 'draft' | 'published'
}

export interface Author {
  id: string
  name: string
  avatar?: string
  bio?: string
}

export interface SocialLinks {
  github?: string
  twitter?: string
  linkedin?: string
  email?: string
}

export interface BlogCategory {
  name: string
  slug: string
  count: number
  description?: string
}

export interface BlogTag {
  name: string
  slug: string
  count: number
}

// 主题相关类型
export type Theme = 'light' | 'dark'

export interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export interface TableOfContentsItem {
  id: string
  title: string
  level: number
  children?: TableOfContentsItem[]
}

export interface TableOfContentsProps {
  items: TableOfContentsItem[]
}

export type PostStatus = 'published' | 'draft'

export interface PostVersion {
  id: string
  post_id: string
  content: string
  metadata: any
  version_type: 'auto' | 'manual'
  description: string | null
  created_at: string
  created_by: string | null
  authors?: {
    name: string
  }
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  status: PostStatus
  author_id: string | null
  views: number
  metadata: Record<string, any>
  created_at: string
  updated_at: string
  published_at: string | null
  deleted_at: string | null
  likes: number
  view_count: number
}

export interface EditorBaseProps {
  initialContent: string
  isEditing?: boolean
}

export interface PostEditorProps extends EditorBaseProps {
  onSaveAction: (content: string, metadata: PostMetadata) => Promise<void>
}

export interface BlogEditorProps {
  initialContent: string
  onSubmitAction: (content: string) => Promise<void>
  isEditing?: boolean
  autoSave?: boolean
}

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export interface BlogEditorProps extends EditorBaseProps {
  onSubmitAction: (content: string) => Promise<void>
}

// 编辑器相关类型
export interface EditorProps {
  value: string
  onChange: (value: string) => void
  autoSave?: boolean
  onSave?: () => Promise<void>
}

export interface PreviewProps {
  content: string
  components?: Record<string, React.ComponentType<any>>
}

// UI 组件类型
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  label: string
}

export interface ImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
}

export interface PostFormData {
  title: string
  slug: string
  excerpt?: string
  content: string
  status: 'draft' | 'published'
  category?: string
  tags: string[]
}

export interface CreatePostInput {
  title: string
  content: string
  excerpt?: string
  slug: string
  status?: 'draft' | 'published'
  category?: string
  tags?: string[]
  versionDescription?: string
}

export interface UpdatePostInput extends Partial<CreatePostInput> {
  versionDescription?: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  category?: string
  tags?: string[]
  status: 'draft' | 'published'
  views: number
  created_at: string
  updated_at: string
}

export interface PostVersion {
  id: string
  post_id: string
  content: string
  metadata: {
    title: string
    excerpt?: string
    category?: string
    tags?: string[]
  }
  version_type: 'auto' | 'manual'
  description?: string
  created_at: string
}

export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

export interface Tag {
  id: string
  name: string
  slug: string
}
