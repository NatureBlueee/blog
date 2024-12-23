import { NextResponse } from 'next/server'
import { readdir, stat } from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    const files = await readdir(uploadsDir)
    
    // 过滤掉 .gitkeep 文件
    const mediaFiles = await Promise.all(
      files
        .filter(file => file !== '.gitkeep')
        .map(async (file) => {
          const filePath = path.join(uploadsDir, file)
          const stats = await stat(filePath)
          const fileId = path.parse(file).name
          
          return {
            id: fileId,
            name: file,
            url: `/uploads/${file}`,
            size: stats.size,
            createdAt: stats.birthtime.toISOString()
          }
        })
    )

    return NextResponse.json(mediaFiles)
  } catch (error) {
    console.error('获取媒体文件列表失败:', error)
    return NextResponse.json(
      { error: '获取媒体文件列表失败' },
      { status: 500 }
    )
  }
} 