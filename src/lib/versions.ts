import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import type { PostVersion, VersionMetadata } from '@/types'

const versionsDirectory = path.join(process.cwd(), 'content/versions')

export async function saveVersion(
  slug: string, 
  content: string,
  metadata: PostMetadata,
  type: 'auto' | 'manual' = 'auto',
  description?: string
): Promise<PostVersion> {
  const postVersionsDir = path.join(versionsDirectory, slug)
  if (!fs.existsSync(postVersionsDir)) {
    fs.mkdirSync(postVersionsDir, { recursive: true })
  }

  const version: PostVersion = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    content,
    metadata,
    type,
    description
  }

  // 保存版本文件
  fs.writeFileSync(
    path.join(postVersionsDir, `${version.id}.json`),
    JSON.stringify(version, null, 2)
  )

  // 清理旧的自动保存版本
  if (type === 'auto') {
    await cleanupAutoSaveVersions(slug)
  }

  return version
}

async function cleanupAutoSaveVersions(slug: string) {
  const versions = await getVersionMetadata(slug)
  const autoSaveVersions = versions
    .filter(v => v.type === 'auto')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  // 只保留最近的 5 个自动保存版本
  const versionsToDelete = autoSaveVersions.slice(5)
  
  for (const version of versionsToDelete) {
    const versionPath = path.join(versionsDirectory, slug, `${version.id}.json`)
    if (fs.existsSync(versionPath)) {
      fs.unlinkSync(versionPath)
    }
  }
}

export async function getVersionMetadata(slug: string): Promise<VersionMetadata[]> {
  const postVersionsDir = path.join(versionsDirectory, slug)
  
  if (!fs.existsSync(postVersionsDir)) {
    return []
  }

  const files = fs.readdirSync(postVersionsDir)
  
  return files
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const content = fs.readFileSync(
        path.join(postVersionsDir, file),
        'utf-8'
      )
      const version = JSON.parse(content) as PostVersion
      return {
        id: version.id,
        timestamp: version.timestamp,
        type: version.type,
        description: version.description
      }
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export async function getVersion(slug: string, versionId: string): Promise<PostVersion | null> {
  const versionPath = path.join(versionsDirectory, slug, `${versionId}.json`)
  
  if (!fs.existsSync(versionPath)) {
    return null
  }

  const content = fs.readFileSync(versionPath, 'utf-8')
  return JSON.parse(content) as PostVersion
} 