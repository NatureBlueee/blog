export interface PostMetadata {
  title: string
  excerpt: string
  date: string
  category: string
  tags: string[]
  status: 'draft' | 'published'
  author: {
    name: string
    avatar: string
    bio: string
  }
}

export interface Post {
  slug: string
  content: string
  metadata: PostMetadata
}

export interface PostVersion {
  id: string
  timestamp: string
  content: string
  metadata: PostMetadata
  type: 'auto' | 'manual' // 区分自动保存和手动保存
  description?: string    // 版本描述，手动保存时可以添加
}

export interface VersionMetadata {
  id: string
  timestamp: string
  type: 'auto' | 'manual'
  description?: string
} 