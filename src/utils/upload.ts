import { v4 as uuidv4 } from 'uuid'
import sharp from 'sharp'

interface UploadOptions {
  maxSize?: number // 单位：MB
  allowedTypes?: string[]
  quality?: number
}

const defaultOptions: UploadOptions = {
  maxSize: 5,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  quality: 80
}

export async function processImage(
  file: File,
  options: UploadOptions = defaultOptions
): Promise<{ buffer: Buffer; format: string }> {
  if (!options.allowedTypes?.includes(file.type)) {
    throw new Error('不支持的文件类型')
  }

  if (file.size > (options.maxSize || 5) * 1024 * 1024) {
    throw new Error('文件大小超出限制')
  }

  const buffer = await file.arrayBuffer()
  const image = sharp(buffer)
  const metadata = await image.metadata()

  // 转换为WebP格式以获得更好的压缩效果
  return {
    buffer: await image
      .webp({ quality: options.quality })
      .toBuffer(),
    format: 'webp'
  }
}

export function generateImagePath(slug: string, originalName: string): string {
  const uniqueId = uuidv4().slice(0, 8)
  const sanitizedName = originalName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
  return `posts/${slug}/${uniqueId}-${sanitizedName}.webp`
} 