import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { BlogPost, BlogCategory, BlogTag, PostStatus } from '@/types'

const postsDirectory = path.join(process.cwd(), 'content/posts')

// 确保 posts 目录存在
if (!fs.existsSync(postsDirectory)) {
  fs.mkdirSync(postsDirectory, { recursive: true })
}

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      content,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      category: data.category,
      tags: data.tags || [],
      author: data.author,
      status: 'published',
      readTime: calculateReadTime(content)
    }
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error)
    return null
  }
}

export async function createPost(content: string): Promise<BlogPost> {
  const { data: frontmatter } = matter(content)
  
  const slug = frontmatter.title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const filePath = path.join(postsDirectory, `${slug}.mdx`)
  fs.writeFileSync(filePath, content)

  return {
    slug,
    content,
    title: frontmatter.title,
    date: frontmatter.date,
    excerpt: frontmatter.excerpt,
    category: frontmatter.category,
    tags: frontmatter.tags || [],
    author: frontmatter.author,
    status: 'published',
    readTime: calculateReadTime(content)
  }
}

export async function updatePost(
  oldSlug: string, 
  content: string,
  metadata: PostMetadata
): Promise<BlogPost> {
  try {
    const validation = validatePost(content)
    if (!validation.isValid) {
      throw new Error(validation.error)
    }

    const newSlug = generateSlug(metadata.title)
    const oldFilePath = path.join(postsDirectory, `${oldSlug}.mdx`)
    const newFilePath = path.join(postsDirectory, `${newSlug}.mdx`)

    // 更新 frontmatter
    const updatedContent = matter.stringify(content, {
      ...metadata,
      date: metadata.date || new Date().toISOString()
    })

    // 写入新文件
    fs.writeFileSync(newFilePath, updatedContent)

    // 如果文件名改变了，处理文件重命名
    if (newSlug !== oldSlug) {
      fs.unlinkSync(oldFilePath)
      handleImageDirectoryRename(oldSlug, newSlug)
    }

    return {
      slug: newSlug,
      content: updatedContent,
      ...metadata,
      readTime: calculateReadTime(content)
    }
  } catch (error) {
    console.error('更新文章失败:', error)
    throw error
  }
}

function handleImageDirectoryRename(oldSlug: string, newSlug: string) {
  const oldImagesDir = path.join(process.cwd(), 'public', 'images', 'posts', oldSlug)
  const newImagesDir = path.join(process.cwd(), 'public', 'images', 'posts', newSlug)
  if (fs.existsSync(oldImagesDir)) {
    fs.renameSync(oldImagesDir, newImagesDir)
  }
}

interface GetAllPostsOptions {
  search?: string
  category?: string
  status?: PostStatus | 'all'
  page?: number
  limit?: number
}

export async function getAllPosts(options: GetAllPostsOptions = {}): Promise<BlogPost[]> {
  const {
    search = '',
    category = 'all',
    status = 'all',
    page = 1,
    limit = 10
  } = options

  const files = fs.readdirSync(postsDirectory)
  let posts = await Promise.all(
    files
      .filter(file => file.endsWith('.mdx'))
      .map(async file => {
        const content = fs.readFileSync(
          path.join(postsDirectory, file),
          'utf-8'
        )
        const { data: frontMatter, content: postContent } = matter(content)
        const slug = file.replace('.mdx', '')
        
        return {
          slug,
          content: postContent,
          title: frontMatter.title,
          excerpt: frontMatter.excerpt,
          date: frontMatter.date,
          category: frontMatter.category,
          tags: frontMatter.tags || [],
          status: frontMatter.status || 'published',
          readTime: calculateReadTime(postContent)
        }
      })
  )

  // 应用筛选条件
  if (search) {
    const searchLower = search.toLowerCase()
    posts = posts.filter(post => 
      post.title.toLowerCase().includes(searchLower) ||
      post.excerpt.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower)
    )
  }

  if (category !== 'all') {
    posts = posts.filter(post => post.category === category)
  }

  if (status !== 'all') {
    posts = posts.filter(post => post.status === status)
  }

  // 排序和分页
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  const start = (page - 1) * limit
  const end = start + limit
  
  return posts.slice(start, end)
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getAllPosts()
  return posts.filter(post => post.tags.includes(tag))
}

export async function getAllCategories(): Promise<BlogCategory[]> {
  const posts = await getAllPosts()
  const categoryMap = new Map<string, BlogCategory>()

  posts.forEach(post => {
    if (!post.category) return

    const slug = post.category.toLowerCase().replace(/\s+/g, '-')
    const existing = categoryMap.get(slug)
    
    if (existing) {
      existing.count++
    } else {
      categoryMap.set(slug, {
        name: post.category,
        slug,
        count: 1
      })
    }
  })

  return Array.from(categoryMap.values())
}

export async function getAllTags(): Promise<BlogTag[]> {
  const posts = await getAllPosts()
  const tagMap = new Map<string, BlogTag>()

  posts.forEach(post => {
    post.tags.forEach(tag => {
      const slug = tag.toLowerCase().replace(/\s+/g, '-')
      const existing = tagMap.get(slug)
      
      if (existing) {
        existing.count++
      } else {
        tagMap.set(slug, {
          name: tag,
          slug,
          count: 1
        })
      }
    })
  })

  return Array.from(tagMap.values())
}

export async function getPostMetadata() {
  const posts = fs.readdirSync(postsDirectory)
  
  return posts
    .filter(file => file.endsWith('.mdx'))
    .map(file => {
      const content = fs.readFileSync(
        path.join(postsDirectory, file),
        'utf-8'
      )
      const { data: frontMatter, content: postContent } = matter(content)
      
      return {
        ...frontMatter,
        slug: file.replace('.mdx', ''),
        readTime: calculateReadTime(postContent),
        status: 'published' as const
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function deletePost(slug: string): Promise<void> {
  const filePath = path.join(postsDirectory, `${slug}.mdx`)
  const imagesDir = path.join(process.cwd(), 'public', 'images', 'posts', slug)

  // 删除文章文件
  fs.unlinkSync(filePath)

  // 如果存在图片目录，也一并删除
  if (fs.existsSync(imagesDir)) {
    fs.rmSync(imagesDir, { recursive: true })
  }
} 