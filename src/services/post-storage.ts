import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Post, PostMetadata } from '@/types'

export class PostStorage {
  private postsDir: string
  private imagesDir: string

  constructor() {
    this.postsDir = path.join(process.cwd(), 'content/posts')
    this.imagesDir = path.join(process.cwd(), 'public/images/posts')
    this.ensureDirectories()
  }

  private ensureDirectories() {
    if (!fs.existsSync(this.postsDir)) {
      fs.mkdirSync(this.postsDir, { recursive: true })
    }
    if (!fs.existsSync(this.imagesDir)) {
      fs.mkdirSync(this.imagesDir, { recursive: true })
    }
  }

  async createPost(content: string): Promise<{ slug: string }> {
    const { data: metadata } = matter(content)
    const slug = this.generateSlug(metadata.title)
    const filePath = path.join(this.postsDir, `${slug}.mdx`)
    
    await fs.promises.writeFile(filePath, content)
    return { slug }
  }

  async updatePost(slug: string, content: string): Promise<{ slug: string }> {
    const { data: newMetadata } = matter(content)
    const newSlug = this.generateSlug(newMetadata.title)
    const oldPath = path.join(this.postsDir, `${slug}.mdx`)
    const newPath = path.join(this.postsDir, `${newSlug}.mdx`)

    if (!fs.existsSync(oldPath)) {
      throw new Error('Post not found')
    }

    await fs.promises.writeFile(newPath, content)

    if (newSlug !== slug) {
      await fs.promises.unlink(oldPath)
      await this.moveImages(slug, newSlug)
    }

    return { slug: newSlug }
  }

  private async moveImages(oldSlug: string, newSlug: string) {
    const oldImagesDir = path.join(this.imagesDir, oldSlug)
    const newImagesDir = path.join(this.imagesDir, newSlug)
    
    if (fs.existsSync(oldImagesDir)) {
      await fs.promises.rename(oldImagesDir, newImagesDir)
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
}

export const postStorage = new PostStorage() 