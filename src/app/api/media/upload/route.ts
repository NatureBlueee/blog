import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

// 允许的文件类型
const ALLOWED_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  video: ['video/mp4', 'video/webm', 'video/ogg'],
  // 添加更多文件类型
}

// 最大文件大小 (100MB)
const MAX_FILE_SIZE = 100 * 1024 * 1024

// 验证外部链接
const ALLOWED_EXTERNAL_SOURCES = [
  { 
    name: 'youtube',
    pattern: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/
  },
  { 
    name: 'gamma',
    pattern: /^(https?:\/\/)?(www\.)?gamma\.app\/.+$/
  }
]

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const externalUrl = formData.get('url') as string

    // 处理外部链接
    if (externalUrl) {
      const source = ALLOWED_EXTERNAL_SOURCES.find(s => s.pattern.test(externalUrl))
      if (!source) {
        return NextResponse.json(
          { error: '不支持的外部链接' },
          { status: 400 }
        )
      }

      return NextResponse.json({
        id: crypto.createHash('md5').update(externalUrl).digest('hex'),
        name: `${source.name}-embed`,
        url: externalUrl,
        type: `embed/${source.name}`,
        size: 0,
        createdAt: new Date().toISOString()
      })
    }

    // 处理文件上传
    if (!file) {
      return NextResponse.json(
        { error: '没有找到文件' },
        { status: 400 }
      )
    }

    // 验证文件类型
    const fileType = Object.entries(ALLOWED_TYPES).find(([_, types]) => 
      types.includes(file.type)
    )?.[0]

    if (!fileType) {
      return NextResponse.json(
        { error: '不支持的文件类型' },
        { status: 400 }
      )
    }

    // 验证文件大小
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: '文件大小不能超过 100MB' },
        { status: 400 }
      )
    }

    // 生成唯一文件名
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const fileHash = crypto.createHash('md5').update(buffer).digest('hex')
    const extension = path.extname(file.name)
    const fileName = `${fileHash}${extension}`

    // 确保上传目录存在
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', fileType)
    await mkdir(uploadDir, { recursive: true })
    await writeFile(path.join(uploadDir, fileName), buffer)

    // 返回文件信息
    return NextResponse.json({
      id: fileHash,
      name: file.name,
      url: `/uploads/${fileType}/${fileName}`,
      type: file.type,
      size: file.size,
      createdAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('文件上传失败:', error)
    return NextResponse.json(
      { error: '文件上传失败' },
      { status: 500 }
    )
  }
} 